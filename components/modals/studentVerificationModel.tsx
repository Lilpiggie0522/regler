"use client";

import { useState, useEffect } from "react";

import { StudentVerificationModalProps } from "@/components/modals/ModalProps";
import ErrorModal from "./errorModal";
import { sendVerificationEmail } from "@/components/services/emailService";

export default function StudentVerificationModal({ onClose, onVerificationSuccess, zID, courseCode, term }: StudentVerificationModalProps) {

    const [verificationCode, setVerificationCode] = useState("");
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [countdown, setCountdown] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        // counting down
        if (isResendDisabled) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown <= 1) {
                        clearInterval(timer!);
                        setIsResendDisabled(false);
                        return 60; // reset timer
                    }
                    return prevCountdown - 1;
                });
            }, 1000);
        }

        // clean timer
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [isResendDisabled]);

    const handleResend = async () => {
        setIsResendDisabled(true);
        setCountdown(60);
        await sendVerificationEmail(zID, courseCode, term); // resend email
    };


    const handleVerificationSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/authcodeSystem/checkAuthcode", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ zid: zID, code: verificationCode }),
            });

            if (!response.ok) {
                const resObj = await response.json()
                setErrorMessage("Verification failed.");
                setShowErrorModal(true);
                throw new Error("Verification failed." + resObj.error);
            }
            // successful verification, jump to team evaluation form
            onVerificationSuccess();

        } catch (error) {
            console.error("Error during checking verification code:", error);
            setErrorMessage("Verification failed.");
            setShowErrorModal(true);
        } finally {
            setLoading(false); // Stop loading regardless of success or failure
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
                <button
                    className="absolute top-2 right-2 text-black text-3xl"
                    onClick={onClose}
                >
            &times;
                </button>
                <p className="text-center text-lg font-bold text-black">
            The verification code has been sent. Please check your email.</p>
                <input
                    type="text"
                    className="w-full p-2 mt-6 border border-gray-300 rounded-md text-black placeholder-gray-500"
                    placeholder="Enter the verification code"
                    value={verificationCode}
                    onChange={(input) => setVerificationCode(input.target.value)}
                />

                <div className="flex justify-between mt-6">
                    {/* Resend button */}
                    <button
                        className={`w-1/2 mr-2 py-2 rounded-full ${isResendDisabled ? "bg-gray-300" : "bg-yellow-400 text-black"}`}
                        onClick={handleResend}
                        disabled={isResendDisabled}
                    >
                        {isResendDisabled ? `Resend in ${countdown}s` : "Resend"}
                    </button>

                    {/* Sign in button */}
                    <button
                        type="button"
                        className={`w-1/2 bg-black text-white py-2 rounded-full flex items-center justify-center ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={handleVerificationSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"></path>
                                </svg>
                        Processing...
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </div>

                {/* ErrorModal */}
                {showErrorModal && (
                    <ErrorModal
                        errorMessage={errorMessage}
                        onClose={() => setShowErrorModal(false)}
                    />
                )}
            </div>
        </div>
    );
}