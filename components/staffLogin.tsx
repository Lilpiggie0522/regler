'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import TermsOfServiceModal from "@/components/modals/termsOfServiceModal";
import ErrorModal from './modals/errorModal';
import { sendStaffVerificationEmail } from '@/components/services/emailService';
import { useStudentContext } from '@/context/studentContext';
import StaffVerificationModal from './modals/staffVerificationModal';

export default function StaffLogin() {
  const router = useRouter();
  // const {setStudentId, setTeamId, setCourseId} = useStudentContext()
  const { useLocalStorageState } = useStudentContext()
  const [, setStaffEmail] = useLocalStorageState('email', '')
  const [, setStaffRole] = useLocalStorageState('role', '')
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');

  const [showLoginFail, setShowLoginFail] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const handleVerificationSuccess = () => {
    setShowVerificationModal(false);
    router.push('/lecturer');
  };

  // frontend invalid check
  const validateInput = () => {

    const emailRegex = /.*@[a-zA-Z\.]+((\.com)|(\.unsw.edu.au))$/;

    if (!emailRegex.test(email)) {
      setErrorMessage('Invalid email format.');
      return false;
    }
    return true;
  };

  const handleSendVerificationEmail = async () => {
    if (!validateInput()) {
      setShowLoginFail(true);
      return;
    }

    const emailSent = await sendStaffVerificationEmail(email);

    if (!emailSent.ok) {
      const res = await emailSent.json()
      console.log(res.error)
      setErrorMessage('Failed to send verification email.');
      setShowLoginFail(true);
    } else {
      setShowVerificationModal(true);
      const admin = await emailSent.json()
      const { email, role } = admin

      setStaffEmail(email)
      setStaffRole(role)
    }
  };


  return (
    <div className="flex min-h-screen">
      {/* Left part image */}
      <div className="w-3/5 relative">
        <Image
          src="/Mainpage-priscilla-du-preez-unsplash.jpg" // Image URL
          alt="Students working together"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
        />
        <div className="absolute bottom-4 left-4 text-white text-xs">
          Image by Priscilla Du Preez from Unsplash
        </div>
      </div>

      {/* Right part sign in */}
      <div className="w-2/5 bg-yellow-400 flex flex-col justify-center items-center p-8">
        <div className="max-w-sm w-full text-left">
          <h1 className="text-4xl font-bold text-black text-left mb-8">Log in</h1>
          <p className="text-black mb-6 text-left">Enter your email below to login:</p>

          {/* zID Input */}
          <div className="mb-6">
            <label htmlFor="email" className="sr-only">zID:</label>
            <input
              id="email"
              name="email"
              value={email}
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md text-black placeholder-gray-500"
              placeholder="email: john.smith@unsw.edu.au"
              onChange={(input) => setEmail(input.target.value)} // refresh zID
            />
          </div>

          {/* Verify button */}

          <button
            onClick={handleSendVerificationEmail} // check whether Input invalid
            className="w-full bg-black text-white py-2 rounded-full mb-6">
            Verify with email
          </button>

          {/* showLoginFail */}
          {showLoginFail ? (
            <ErrorModal
              errorMessage={errorMessage}
              onClose={() => setShowLoginFail(false)}
            />
          ) : null}

          {/* showVerificationModal */}
          {showVerificationModal ? (
            <StaffVerificationModal email={email} onClose={() => setShowVerificationModal(false)} onVerificationSuccess={handleVerificationSuccess} />
          ) : null}

          {/* privacy policy */}
          <p className="text-center text-s text-gray-700 mt-4">
            By clicking continue, you agree to our{" "}
            <button
              onClick={() => setShowTermsModal(true)}
              className="underline text-blue-700"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <a href="https://www.unsw.edu.au/privacy" target="_blank" rel="noopener noreferrer" className="underline text-blue-700">Privacy Policy</a>.
          </p>
          {/* Terms of Service model */}
          {showTermsModal && (
            <TermsOfServiceModal onClose={() => setShowTermsModal(false)} />
          )}
        </div>
      </div>
    </div>
  );
}


