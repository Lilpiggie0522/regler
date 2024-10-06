import Image from "next/image";

export default function Home() {
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
          <h1 className="text-5xl font-bold text-black mb-4 relative top-[-20px]">App Name</h1>
          <h2 className="text-2xl font-bold text-black mb-8 relative top-[-16px]">Welcome to login</h2>
          <p className="text-black mb-6">Please select one of the following options to sign in.</p>

          {/* student login button */}
          <button className="w-full bg-black text-white py-2 rounded-full mb-4">
            Students
          </button>

          <p className="text-center text-black mb-4">or</p>

          {/* staff login button */}
          <button className="w-full bg-white text-black py-2 rounded-full">
            Staff
          </button>

          {/* privacy policy */}
          <p className="text-center text-s text-gray-700 mt-4">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline">Terms of Service</a> and{" "}
            <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
