import {useNavigate} from "react-router-dom"

export function LandingPage() {
 
    const navigate = useNavigate();
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative w-full max-w-[1440px] mx-auto h-[400px] md:h-[500px] bg-blue-600 overflow-hidden">
        {/* SVG Wave */}
        <svg
          className="absolute bottom-0 left-0 w-full h-[200px] md:h-[300px]"
          viewBox="0 0 1440 490"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M 0,500 L 0,187 C 89.77990430622009,160.78947368421052 179.55980861244018,134.57894736842107 273,151 C 366.4401913875598,167.42105263157893 463.54066985645943,226.47368421052627 570,229 C 676.4593301435406,231.52631578947373 792.2775119617223,177.5263157894737 897,179 C 1001.7224880382777,180.4736842105263 1095.3492822966507,237.42105263157896 1184,248 C 1272.6507177033493,258.57894736842104 1356.3253588516745,222.78947368421052 1440,187 L 1440,500 L 0,500 Z"
            fill="#f9fafb"
            stroke="none"
            
          />
        </svg>

        {/* Hero Content */}

        <div className="relative z-10 flex flex-col items-start justify-start h-full text-center p-0 px-6">
          <h1 className="text-xl md:text-xl font-bold text-white mb-2 mt-0 px-0 py-0">
            TIX-MANAGEMENT
          </h1>
          <div className="rounded-full bg-gray-100 opacity-50 h-16 w-16 absolute top-4 right-4 animate-bounce md:top-8 lg:right-36 lg:mr-40"></div>
          <div className="rounded-full bg-gray-100 opacity-50 h-16 w-16 absolute top-1 left-1"></div>

          <p className="text-white text-sm t md:text-sm self-center max-w-xl mb-8">
           An all-in-one ticket management platform designed to streamline communication and boost productivity for your team.
          </p>
          {/* <div className="flex flex-col  space-x-5 space-y-3 mb-10">
            <button className="block bg-white justify-center align-items-center text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition">
              Get Started
            </button>
            <button className="border border-white text-white px-6 py-3 space-x-5 rounded-md font-semibold hover:bg-white hover:text-blue-600 transition">
              Login
            </button>
          </div> */}
          <div className="w-full max-w-md mx-auto flex flex-col items-stretch space-y-3 mb-10">
            <button onClick={() => {
              navigate("/signup");
            }} className="block w-full bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition">
              Get Started
            </button>
            
              <button onClick= {() => {
                navigate("/login")
              }} className="block w-full border border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-600 transition">
                Login
              </button>
          
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
              Why Choose Ticket Management?
            </h2>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 max-w-[1440px] mx-auto px-6 grid md:grid-cols-3 gap-8">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h3 className="font-semibold text-xl mb-2">Fast & Reliable</h3>
          <p className="text-gray-600">
            Experience lightning-fast performance with our cloud-based solution.
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h3 className="font-semibold text-xl mb-2">User Friendly</h3>
          <p className="text-gray-600">
            Enjoy an intuitive interface designed for everyone.
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h3 className="font-semibold text-xl mb-2">Secure</h3>
          <p className="text-gray-600">
            Your data is protected with top-grade encryption standards.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm">
          <p>© 2025 AppName. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
