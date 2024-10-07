import React, { useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="p-6 min-h-screen  flex flex-col justify-center items-center">
      <div className="space-grotesk-font text-primary-dark text-center mx-auto mt-10 text-3xl md:text-4xl lg:text-5xl font-semibold w-full max-w-lg">
        Hiring And <span className="text-primary-dark">Outsourcing</span> like never before
      </div>
      
      <div className="text-white text-center mx-auto text-sm md:text-base lg:text-lg w-full max-w-md mt-4">
        Redefining Talent Acquisition: Innovations Shaping the Future.
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-10">
        <Link to={'/signup'}>
          <button className="font-bold bg-primary-dark text-white py-3 px-8 rounded-full w-48 hover:bg-primary-dark-light transition-all">
            Create Account
          </button>
        </Link>
        
        <Link to={'/login'}>
          <button className="font-bold bg-primary-dark text-white py-3 px-8 rounded-full w-48 hover:bg-primary-dark-light transition-all">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
