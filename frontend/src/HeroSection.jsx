export default function HeroSection({ scrollToDropzone }) {
  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div>
          <p className="text-sm font-semibold tracking-widest text-gray-300 uppercase">
            Early Disease Detection for Farmers
          </p>
          <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-yellow-500">
              AI-Powered Potato Leaf
            </span>{" "}
            Disease Detection
          </h1>
          <p className="mt-4 text-lg text-gray-400 sm:mt-6">
            Detect early signs of{" "}
            <span className="text-green-400">Late Blight</span> and{" "}
            <span className="text-yellow-400">Early Blight</span> in potato
            leaves with our advanced AI model. Trained on a powerful CNN
            architecture with{" "}
            <span className="text-green-300">99% accuracy</span>, our system
            helps farmers take timely corrective actions to protect their crops
            and maximize yield.
          </p>
          <div className="mt-8 sm:mt-12">
            <button
              onClick={scrollToDropzone}
              className="inline-flex items-center px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-green-500 to-yellow-500 rounded-full shadow-lg hover:shadow-green-500/50 transition-all duration-300"
            >
              Detect Disease Now
            </button>
          </div>
          <div className="inline-flex items-center pt-6 mt-8 border-t border-gray-800 sm:pt-10 sm:mt-14">
            <svg
              className="w-6 h-6 text-green-500"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 7.00003H21M21 7.00003V15M21 7.00003L13 15L9 11L3 17"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ml-2 text-base font-normal text-white">
              Helping farmers prevent crop loss with AI
            </span>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center md:justify-end">
          <img
            className="w-full max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl"
            src="https://melissaknorris.com/wp-content/uploads/2021/08/Melissa-Early-Blight-Potato.jpg"
            alt="Farmer using AI for potato crop"
          />
        </div>
      </div>
    </div>
  );
}
