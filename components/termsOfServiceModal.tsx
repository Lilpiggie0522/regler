'use client';

import React from 'react';

export interface TermsOfServiceModalProps {
  onClose: () => void;
}

const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative text-black">
        <h2 className="text-2xl text-black font-bold mb-4">Terms and Conditions</h2>
        <p className="mb-2">
          By logging in, you are acknowledging that:
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li className="mb-2">
            I am authorized to use this system for submitting disputes and evidence related to group projects.
          </li>
          <li className="mb-2">
            I have read and understand the institution’s Acceptable Use Policy and Privacy Policy, and I agree to follow all rules.
          </li>
          <li className="mb-2">
            I understand that submitted materials, including personal data and evidence, may be accessed by authorized staff for dispute resolution.
          </li>
          <li className="mb-2">
            I agree that misuse of this system, including submitting false information, may result in disciplinary action.
          </li>
          <li>
            I acknowledge that all dispute resolutions are final, based on the evidence provided.
          </li>
        </ul>
        {/* close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black text-3xl"
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default TermsOfServiceModal;
