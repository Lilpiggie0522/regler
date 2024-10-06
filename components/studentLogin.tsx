'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function StudentLogin() {

  const [showLoginFail, setShowLoginFail] = useState(false); // control the login fail model show
  const [errorMessage, setErrorMessage] = useState(''); // error message
  const [zid, setZid] = useState('');
  const [courseCode, setCourseCode] = useState('');

  // frontend invalid check
  const validateInput = () => {

    const zidRegex = /^z[0-9]{7}$/; // zID start with 'z', then 7 numbers
    const courseCodeRegex = /^[A-Z]{4}[0-9]{4}$/; // 4 upper case letters with 4 numbers 

    if (!zidRegex.test(zid)) {
      setErrorMessage('Invalid zID format.');
      return false;
    }
    if (!courseCodeRegex.test(courseCode)) {
      setErrorMessage('Invalid Course Code format.');
      return false;
    }
    return true;
  };

  const checkLoginFail = async () => {
    // 1. frontend check: if format wrong
    if (!validateInput()) {
      setShowLoginFail(true);
      return;
    }

    // // 2. backend check
    // try {
    //   const response = await fetch('/api/identityCheck', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ zid, courseCode }),
    //   });

    //   const data = await response.json();

    //   if (!data.success) {
    //     setErrorMessage('Invalid input. Please try again.');
    //     setShowLoginFail(true);
    //   } else {
    //     console.log('Login successful!');
    //      // link to identify check page
    //   }
    // } catch (error) {
    //   console.error('Error during login:', error);
    //   setErrorMessage('Server error. Please try again later.');
    //   setShowLoginFail(true);
    // }
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
          <p className="text-black mb-6 text-left">Enter your zID and Course code below to login:</p>

          {/* zID Input */}
          <div className="mb-6">
            {/*<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="zid">zID: </label>*/}
            <input
              id="zid"
              name="zid"
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md text-black placeholder-gray-500"
              placeholder="zID: z1234567"
              onChange={(input) => setZid(input.target.value)} // refresh zID
            />
          </div>

          {/* Course Code Input */}
          <div className="mb-6">
            {/*<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="courseCode">Course Code: </label>*/}
            <input
              id="courseCode"
              name="courseCode"
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md text-black placeholder-gray-500"
              placeholder="Course Code: COMP3900"
              onChange={(input) => setCourseCode(input.target.value)} // refresh course code
            />
          </div>

          {/* Verify button */}
          
          <button 
            onClick={ checkLoginFail } // check whether Input invalid
            className="w-full bg-black text-white py-2 rounded-full mb-6">
            Verify with email
          </button>

          {/* showLoginFail */}
          {showLoginFail ? (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
                <button
                  className="absolute top-2 right-2 text-black text-3xl"
                  onClick={() => setShowLoginFail(false)} // click on close button to hide the model
                >
                  &times;
                </button>
                <p className="text-center text-lg font-bold text-black">{errorMessage}</p>
                <p className="text-center text-lg text-black font-bold">Please try again.</p>
              </div>
            </div>
          ) : null}

          {/* privacy policy */}
          <p className="text-center text-s text-gray-700">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline">Terms of Service</a> and{" "}
            <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
