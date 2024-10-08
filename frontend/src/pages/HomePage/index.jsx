import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import LandingPage from "../../assets/background.png";
import Briefcase from "../../assets/case.png";
import Icons from "../../assets/icons.png";
import BlockchainImage from "../../assets/blockchain.svg";
import LancePointLogo from "../../assets/logo.png"; // Replace with the actual path

const Home = () => {
  const decentralizedRef = useRef(null);
  const paymentRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="p-6 min-h-screen flex flex-col items-center bg-cover bg-center text-white"
      style={{
        backgroundImage: `linear-gradient(270deg, #2B1836, #22213A), url(${LandingPage})`,
      }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center w-full max-w-6xl mx-auto">
        <div className="mt-4">
          <img
            src={LancePointLogo}
            alt="LancePoint Logo"
            className="w-[3rem] h-auto"
          />
        </div>
        <div className="space-x-6">
          <button
            onClick={() => scrollToSection(decentralizedRef)}
            className="text-white hover:text-blue-300"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection(paymentRef)}
            className="text-white hover:text-blue-300"
          >
            Features
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center text-center mx-auto mt-[4rem] mb-[5rem] max-w-4xl">
        <h1 className="space-grotesk-font text-4xl md:text-5xl lg:text-6xl font-semibold drop-shadow-lg mb-8">
          Unleash Your <span className="text-blue-300">Potential</span> with{" "}
          <span className="text-blue-300">Decentralized</span> Freelancing and
          Transparency.
        </h1>

        <div className="flex space-x-6 mt-[4rem]">
          <Link to={"/signup"}>
            <button className="font-bold bg-blue-400 hover:bg-purple-900 text-white py-3 px-8 rounded-full shadow-lg transition-all">
              Create Account
            </button>
          </Link>
          <Link to={"/login"}>
            <button className="font-bold bg-blue-400 hover:bg-purple-900 text-white py-3 px-8 rounded-full shadow-lg transition-all">
              Sign In
            </button>
          </Link>
        </div>
      </div>

      {/* Decentralized Services Section */}
      <div
        ref={decentralizedRef}
        className="flex flex-col lg:flex-row items-center text-center lg:text-left mt-10 mx-auto max-w-5xl space-y-6 lg:space-y-0 lg:space-x-6 px-4"
      >
        <img
          src={Briefcase}
          alt="briefcase icon"
          className="w-16 h-16 lg:w-20 lg:h-20 drop-shadow-md"
        />

        <div>
          <h2 className="text-xl md:text-2xl text-blue-100">
            Buy and sell services in a decentralized manner
          </h2>
          <p className="text-sm md:text-base text-blue-200 mt-2 leading-relaxed">
            With our decentralized platform, you can buy and sell services
            securely and transparently. Say goodbye to intermediaries and hello
            to direct transactions, empowering freelancers and clients alike.
            Join us today and experience the freedom of decentralized service
            exchange.
          </p>
        </div>
      </div>

      {/* On-chain Payment Solutions Section */}
      <div
        ref={paymentRef}
        className="text-center mt-20 mx-auto px-4 max-w-4xl"
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-blue-300">
          Enjoy on-chain payment solutions.
        </h2>
        <p className="text-blue-200 mt-4 leading-relaxed text-sm md:text-base max-w-2xl mx-auto">
          Experience the simplicity and security of on-chain payments with our
          revolutionary platform. Say goodbye to traditional payment methods and
          hello to transparent and efficient transactions.
        </p>
        <img
          src={BlockchainImage}
          alt="Blockchain"
          className="w-30 h-auto mt-6 mx-auto"
        />
      </div>

      {/* Reputation Control Section */}
      <div className="flex flex-col mb-20 lg:flex-row items-center text-center lg:text-left mt-20 mx-auto max-w-5xl space-y-6 lg:space-y-0 lg:space-x-6 px-4">
        <img
          src={Icons}
          alt="briefcase icon"
          className="w-16 h-16 lg:w-20 lg:h-20 drop-shadow-md"
        />

        <div>
          <h2 className="text-xl md:text-2xl text-blue-100">
            Stay in control of your own reputation
          </h2>
          <p className="text-sm md:text-base text-blue-200 mt-2 leading-relaxed">
            Say goodbye to centralized rating systems and hello to autonomy and
            control. With us, you decide how your reputation is perceived,
            ensuring trust and confidence in your services.
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-gray-300 py-4 w-full">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
          <div>
            <p>
              &copy; {new Date().getFullYear()} LancePoint. All rights reserved.
            </p>
            <p>Follow us on:</p>
            <div className="flex space-x-4">
              <Link to="#" className="hover:text-blue-400">
                Facebook
              </Link>
              <Link to="#" className="hover:text-blue-400">
                Twitter
              </Link>
              <Link to="#" className="hover:text-blue-400">
                LinkedIn
              </Link>
            </div>
          </div>
          <div>
            <p>Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
