import Image from 'next/image';

export default function StudentLogin() {
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
              className="w-full p-3 border border-gray-300 rounded-md text-black placeholder-gray-500"
              placeholder="zID: z12345"
            />
          </div>

          {/* Course Code Input */}
          <div className="mb-6">
            {/*<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="courseCode">Course Code: </label>*/}
            <input
              id="courseCode"
              name="courseCode"
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md text-black placeholder-gray-500"
              placeholder="Course Code: COMP3900"
            />
          </div>

          {/* Verify button */}
          <button className="w-full bg-black text-white py-2 rounded-full mb-6">
            Verify with email
          </button>

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
