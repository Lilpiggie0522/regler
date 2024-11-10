"use client";

import React from "react";
import { ConfirmModalProps } from "@/components/modals/ModalProps";


export default function ConfirmModal ({ message, onConfirm, onCancel, onClose }: ConfirmModalProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
                <button
                    className="absolute top-2 right-2 text-black text-3xl"
                    onClick={onClose}
                >
                    &times;
                </button>
                <p className="text-lg font-bold text-black mb-4">
                    {message}
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white px-4 py-2 rounded-md"
                    >
                        Yes
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 text-black px-4 py-2 rounded-md"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};
