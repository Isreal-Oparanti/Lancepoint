import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import signUpImage from "../../assets/2.jpeg";
import signUpImage1 from "../../assets/1.jpeg";
import { toast } from "react-toastify"; // Correct import
import WormholeConnect from "@wormhole-foundation/wormhole-connect";

const SignUp = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState(""); // Corrected spelling
  const [error, setError] = useState("");
  const navigate = useNavigate(); // For navigation after successful signup

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Reset error message
    console.log(email);

    // Basic Validation
    if (!firstname || !lastname || !email || !password) {
      setError("Please fill in all required fields.");
      toast.error("Please fill in all required fields.");
      return;
    }

    console.log(description);

    try {
      // Send request to backend with correct data
      const response = await axios.post("http://localhost:5000/api/register", {
        firstname,
        lastname,
        email,
        password,
        description,
      });
      console.log("Signup successful:", response.data);
      toast.success("Sign up Successful!!!");

      // Redirect to login page after successful signup
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      setError(
        error.response?.data?.message || "Signup failed. Please try again."
      );
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  return (
    <>
      <div
        id="container"
        className="flex flex-col lg:flex-row justify-center w-full max-h-screen"
      >
        {/* Left Side - Form */}
        <div className="flex-1 bg-primary-dark flex flex-col items-center justify-center p-4 overflow-scroll">
          <div>
            <div className="bg-opacity-10 mt-10 flex justify-center bg-secondary-dark bg-blur py-8 mx-auto shadow rounded-lg px-4 w-full max-w-md relative border-2 border-stone-700">
              <form
                onSubmit={handleFormSubmit}
                className="flex flex-col justify-center space-y-4 w-full"
              >
                <div className="text-white mt-2 text-center text-xl font-semibold">
                  Sign Up
                </div>

                {/* Display Error Message */}
                {error && (
                  <div className="text-red-500 text-center">{error}</div>
                )}

                {/* First Name and Last Name */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="mt-1 w-full">
                    <input
                      type="text"
                      name="firstname"
                      placeholder="First Name"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      className="appearance-none placeholder:text-slate-400 text-slate-300 bg-slate-700 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="mt-1 w-full">
                    <input
                      type="text"
                      name="lastname"
                      placeholder="Last Name"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      className="appearance-none placeholder:text-slate-400 text-slate-300 bg-slate-700 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="mt-1 w-full">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none placeholder:text-slate-400 text-slate-300 bg-slate-700 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                {/* Password Input */}
                <div className="mt-1 w-full">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none placeholder:text-slate-400 text-slate-300 bg-slate-700 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                {/* Description Input (Optional) */}
                <div className="mt-1 w-full">
                  <textarea
                    name="description"
                    placeholder="Tell us about yourself and what you do ..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="appearance-none placeholder:text-slate-400 text-slate-300 bg-slate-700 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none h-24"
                  ></textarea>
                </div>

                {/* Connect Wallet */}
                <div className="text-white text-center">Connect Wallet</div>
                <div className="flex justify-center">
                  <button
                    type="button"
                    // onClick={connectWallet}
                    className="bg-white py-2 px-4 w-full text-xs rounded-full hover:bg-gray-200 transition"
                  >
                    MetaMask
                  </button>
                </div>

                {/* Sign Up Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-purple-700 text-white py-2 px-4 w-full text-sm rounded-full hover:bg-purple-800 transition"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
            <div className="h-[400px] overflow-scroll">
              <WormholeConnect />
            </div>
          </div>

          {/* <div className="text-white mt-4 mx-auto text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              Login
            </Link>
          </div> */}
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:flex flex-1">
          <img
            src={signUpImage}
            className="object-cover w-full h-full"
            alt="Sign Up"
          />
        </div>
      </div>
    </>
  );
};

export default SignUp;
