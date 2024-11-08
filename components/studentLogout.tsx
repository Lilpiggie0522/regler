export default function StudentLogout() {
    return (
        <div className="flex min-h-screen">
            {/* Background */}
            <div className="w-full bg-yellow-400 flex flex-col justify-center items-center p-8">
                <div className="bg-white p-20 rounded-lg shadow-lg max-w-lg w-full">
                    <h1 className="text-5xl font-bold text-black mb-8 relative text-center">Thank you!</h1>
                    <h2 className="text-xl font-bold text-black mb-8 relative text-center">Your application has been successfully submitted.</h2>

                </div>
            </div>
        </div>
    );
}