import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import signUpImage from "../../assets/BG.png";
import Solflare from "@solflare-wallet/sdk";
import { toast, Toaster } from "react-hot-toast";

const SignUp = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const wallet = new Solflare();

  const handleConnect = async () => {
    try {
      await wallet.connect();
      const walletAddress = wallet.publicKey.toString();
      localStorage.setItem("walletAddress", walletAddress);
      setWalletAddress(walletAddress);
      toast.success(`Wallet connected`, { position: "top-right", duration: 10000 });
      setIsWalletConnected(true);
    } catch (err) {
      toast.error("Error connecting to wallet!");
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (!firstname || !lastname || !email || !password || !walletAddress) {
      const missingFieldError = "Please fill in all required fields.";
      setError(missingFieldError);
      toast.error(missingFieldError, { duration: 5000, position: "top-right" });
      setLoading(false);
      return;
    }

    const payload = { firstname, lastname, email, password, description, wallet: walletAddress };

    try {
      const response = await axios.post("https://x-ploit-backend-4.onrender.com/api/register", payload);
      toast.success("Sign up Successful!", { position: "top-right" });
      setLoading(false);
      navigate("/login");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, { duration: 5000, position: "top-right" });
      setLoading(false);
    }
  };

  return (
    <div id="container" className="flex flex-col lg:flex-row justify-center w-full h-screen bg-black"> {/* Change made here */}
      {/* Form Container */}
      <div className="flex-1 bg-primary-dark flex items-center p-3 justify-center h-full">
        <div className="bg-opacity-10 mt-8 flex sm:max-h-screen justify-center bg-secondary-dark bg-blur py-5 mx-auto shadow rounded-lg px-4 w-full max-w-lg relative border-2 border-stone-700">
          <form onSubmit={handleFormSubmit} className="flex flex-col justify-center space-y-3 w-full">
            <div className="text-white mt-2 text-center text-xl font-semibold">Sign Up</div>
            {error && <div className="text-red-500 text-center">{error}</div>}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="mt-1 w-full">
                <input type="text" name="firstname" placeholder="First Name" value={firstname} onChange={(e) => setFirstname(e.target.value)} className="appearance-none placeholder:text-slate-400 text-slate-300 bg-slate-700 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div className="mt-1 w-full">
                <input type="text" name="lastname" placeholder="Last Name" value={lastname} onChange={(e) => setLastname(e.target.value)} className="appearance-none placeholder:text-slate-400 text-slate-300 bg-slate-700 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>
            <div className="mt-1 w-full">
              <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none placeholder:text-slate-400 text-slate-300 bg-slate-700 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div className="mt-1 w-full">
              <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none placeholder:text-slate-400 text-slate-300 bg-slate-700 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div className="mt-1 w-full">
              <textarea name="description" placeholder="Tell us about yourself and what you do ..." value={description} onChange={(e) => setDescription(e.target.value)} className="appearance-none placeholder:text-slate-400 text-slate-300 bg-slate-700 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none h-17"></textarea>
            </div>

            {/* Hidden input for walletAddress */}
            <input type="hidden" name="walletAddress" value={walletAddress} />

            <div className="text-white text-center">Connect Wallet</div>
            <div className="flex justify-center">
              <button type="button" onClick={handleConnect} disabled={isWalletConnected} className={`bg-white py-2 px-4 w-full text-xs rounded-full hover:bg-gray-200 transition items-center flex justify-center ${isWalletConnected ? "opacity-50 cursor-not-allowed" : ""}`}>
                <img src="Group.png" width={20} height={20} alt="Solflare" />
                <span className="text-[12px]">{isWalletConnected ? "Wallet Connected" : "Solflare"}</span>
              </button>
            </div>
            <Toaster />
            <div className="flex justify-center">
              <button type="submit" disabled={!isWalletConnected || loading} className={`bg-purple-700 text-white py-2 px-4 w-full text-sm rounded-full hover:bg-purple-800 transition ${!isWalletConnected || loading ? "opacity-50 cursor-not-allowed" : ""}`}>
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
            <div className="text-white mt-2 mx-auto text-center">
              Have an account already?{" "}
              <Link to="/login" className="text-blue-400 hover:underline">Sign In</Link>
            </div>
          </form>
        </div>
      </div>

      {/* Sign Up Image */}
      <div className="hidden lg:flex lg:flex-1">
        <img src={signUpImage} className="object-cover w-full h-full" alt="Sign Up" />
      </div>
    </div>
  );
};

export default SignUp;
