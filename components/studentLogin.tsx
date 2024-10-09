'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import TermsOfServiceModal from "@/components/modals/termsOfServiceModal";
import StudentVerificationModal from "@/components/modals/studentVerificationModel";
import ErrorModal from './modals/errorModal';
import { sendVerificationEmail } from '@/components/services/emailService';
import { useStudentContext } from '@/context/studentContext';

export default function StudentLogin() {
  const router = useRouter();
  const {setStudentId, setTeamId, setCourseId} = useStudentContext()

  const [errorMessage, setErrorMessage] = useState('');
  const [zID, setZid] = useState('');
  const [courseCode, setCourseCode] = useState('');

  const [showLoginFail, setShowLoginFail] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const handleVerificationSuccess = () => {
    setShowVerificationModal(false);
    router.push('/studentDetailConfirm');
  };

  // frontend invalid check
  const validateInput = () => {

    const zidRegex = /^z[0-9]{7}$/;
    const courseCodeRegex = /^[A-Za-z]{4}[0-9]{4}$/;

    if (!zidRegex.test(zID)) {
      setErrorMessage('Invalid zID format.');
      return false;
    }
    if (!courseCodeRegex.test(courseCode)) {
      setErrorMessage('Invalid Course Code format.');
      return false;
    }
    return true;
  };

  const handleSendVerificationEmail = async () => {
    if (!validateInput()) {
      setShowLoginFail(true);
      return;
    }

    const emailSent = await sendVerificationEmail(zID, courseCode); // 使用拆分后的逻辑

    if (!emailSent.ok) {
      const res = await emailSent.json()
      console.log(res.error)
      setErrorMessage('Failed to send verification email.');
      setShowLoginFail(true);
    } else {
      setShowVerificationModal(true);
      const student = await emailSent.json()
      const {studentId, teamId, courseId} = student
      setStudentId(studentId)
      setTeamId(teamId)
      setCourseId(courseId)
      // console.log("student got from email backend is:")
      // console.log(student)
    }
  };

  // const sendVerificationEmail = async () => {
  //   // frontend check: if format wrong
  //   if (!validateInput()) {
  //     setShowLoginFail(true);
  //     return;
  //   }

  //   // test for verification
  //   setShowVerificationModal(true);

  //   try {
  //     const response = await fetch('/api/studentSystem/identityCheck', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ zid: zID, courseCode: courseCode }),
  //     });

  //     if (!response.ok) {
  //       setErrorMessage('Failed to send verification email.');
  //       setShowLoginFail(true);
  //       alert(response);
  //     } else {
  //       setShowVerificationModal(true);
  //       setShowLoginFail(false);
  //     }
  //   } catch (error) {
  //     console.error('Error during email sending:', error);
  //     setErrorMessage('Server error. Please try again later.');
  //     setShowLoginFail(true);
  //   }

  // };
  

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
          <p className="text-black mb-6 text-left">Enter your zID and Course code below to login:</p>

          {/* zID Input */}
          <div className="mb-6">
          <label htmlFor="zID" className="sr-only">zID:</label>
            <input
              id="zID"
              name="zID"
              value={zID}
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md text-black placeholder-gray-500"
              placeholder="zID: z1234567"
              onChange={(input) => setZid(input.target.value)} // refresh zID
            />
          </div>

          {/* Course Code Input */}
          <div className="mb-6">
          <label htmlFor="courseCode" className="sr-only">Course Code:</label>
            <input
              id="courseCode"
              name="courseCode"
              value={courseCode}
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md text-black placeholder-gray-500"
              placeholder="Course Code: Comp3900"
              onChange={(input) => setCourseCode(input.target.value)} // refresh course code
            />
          </div>

          {/* Verify button */}
          
          <button 
            onClick={ handleSendVerificationEmail } // check whether Input invalid
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
            <StudentVerificationModal
              onClose={() => setShowVerificationModal(false)}
              onVerificationSuccess={handleVerificationSuccess}
              zID={zID}
              courseCode={courseCode}
            />
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


