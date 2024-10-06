import Image from 'next/image';

export default function StudentLoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left part image */}
      <div className="w-1/2 relative">
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
        <div className="max-w-sm w-full">
          <h1 className="text-3xl font-bold text-left mb-6">Log in</h1>
          <p className="mb-4 text-left">Enter your zID and Course code below to login:</p>

          {/* zID 输入框 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="zid">zID: </label>
            <input
              id="zid"
              name="zid"
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="z12345"
            />
          </div>

          {/* Course Code 输入框 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="courseCode">Course Code: </label>
            <input
              id="courseCode"
              name="courseCode"
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="COMP1234"
            />
          </div>

          {/* 登录按钮 */}
          <button className="w-full bg-black text-white py-2 rounded-full mb-4">
            Verify with email
          </button>

          {/* 条款和隐私政策 */}
          <p className="text-xs text-gray-700 mt-4 text-center">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline">Terms of Service</a> and{" "}
            <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
