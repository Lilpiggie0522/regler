'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ModalProps } from "@/components/modals/ModalProps";


const WrongGroupModal = ({ onClose }: ModalProps) => {
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
          <button
            className="absolute top-2 right-2 text-black text-xl"
            onClick={onClose}
          >
            &times;
          </button>
          <h2 className="text-xl font-bold mb-4 text-black text-center">Request Group Change</h2>
          <p className="mb-5 text-black text-center">
            If there is any error in your details, please email your tutor to request a correction.
          </p>
        </div>
      </div>
    );
};

export default function StudentDetailConfirm() {

    const router = useRouter();

    const [showModal, setShowModal] = useState(false);

    const handleNotThisGroup = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="min-h-screen bg-yellow-400 flex justify-center items-center">
        {/* Outer container for the confirmation card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-lg w-full text-center">
            {/* Title */}
            <h1 className="text-4xl font-bold mb-6 text-black">Details Confirmed</h1>
            
            {/* Details Section */}
            <div className="bg-white border-2 border-yellow-400 rounded-lg py-6 px-4 mb-6 max-w-sm mx-auto">
            {/* Use grid to split label and value */}
            <div className="grid grid-cols-2 gap-4">
                <p className="text-right font-bold text-gray-500">
                Course Code:
                </p>
                <p className="text-left font-bold text-black">
                COMP3900
                </p>

                <p className="text-right font-bold text-gray-500">
                Group Name:
                </p>
                <p className="text-left font-bold text-black">
                Cow Horse
                </p>

                <p className="text-right font-bold text-gray-500">
                Mentor Name:
                </p>
                <p className="text-left font-bold text-black">
                Someone
                </p>
            </div>

            </div>
            {/* Confirm and Not this group buttons */}
            <button 
                className="bg-black text-white text-center w-full py-2 rounded-full mb-4 max-w-sm mx-auto"
                onClick={() => router.push('/teamEvaluationForm')}
            >
            Confirm
            </button>
            <button 
                className="bg-yellow-400 text-white text-center w-full py-2 rounded-full border-2 border-yellow-400 max-w-sm mx-auto"
                onClick={handleNotThisGroup}
            >
            Not this group?
            </button>

        </div>
        {/* Modal for 'Not this group' */}
        {showModal ? (
            <WrongGroupModal onClose={closeModal} />) : null}
        </div>
    );
};