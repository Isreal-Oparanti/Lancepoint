import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useOkto } from "okto-sdk-react";

import signUpImage from "../../assets/BG.png";
import { AuthContext } from "../../context/auth";

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState();

  const BASE_URL = "https://sandbox-api.okto.tech";
  const OKTO_CLIENT_API = "b9b928ee-9b60-4e34-bb2d-4398dfcb012c"; // Ensure this API key is correct
  const { authenticate } = useOkto();
  const handleGoogleLogin = async (credentialResponse) => {
    console.log("Google login response:", credentialResponse);

    const idToken = credentialResponse.credential;
    console.log(idToken);
    console.log("google idtoken: ", idToken);
    authenticate(idToken, async (authResponse, error) => {
      if (authResponse) {
        console.log("auth token received", authToken);
        navigate("/profile");
      }
      if (error) {
        console.error("Authentication error:", error);
      }
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://x-ploit-backend-4.onrender.com/api/login",
        { email, password }
      );

      const { user } = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      setAuth({ user });
      toast.success("Login Successful!");
      navigate("/profile");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Login failed. Please try again.";
      console.error("Login error details:", { errorMsg, error });
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div
        id="container"
        className="flex flex-col lg:flex-row justify-center w-full min-h-screen"
      >
        <div className="flex-1 bg-primary-dark flex flex-col items-center justify-center p-10">
          <div className="bg-opacity-10 mt-8 flex flex-col justify-center bg-secondary-dark py-6 mx-auto shadow rounded-lg px-4 w-full max-w-md relative border-2 border-stone-700">
            <form
              onSubmit={handleFormSubmit}
              className="flex flex-col justify-center space-y-4 w-full"
            >
              <div className="text-white mt-2 text-center text-xl font-semibold">
                Login
              </div>

              {error && <div className="text-red-500 text-center">{error}</div>}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none placeholder:text-slate-400 text-slate-300 bg-slate-700 block w-full px-3 py-2 rounded-md shadow-sm"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none placeholder:text-slate-400 text-slate-300 bg-slate-700 block w-full px-3 py-2 rounded-md shadow-sm"
              />

              <button
                type="submit"
                disabled={loading}
                className={`bg-purple-700 text-white py-2 px-4 w-full text-sm rounded-full hover:bg-purple-800 transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Loading..." : "Login"}
              </button>
            </form>

            <div className="text-white mt-4 mx-auto text-center">OR</div>

            <div className="flex justify-center w-full mt-4">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={(error) => {
                  console.log("Login Failed", error);
                }}
              />
            </div>
          </div>

          <div className="text-white mt-4 mx-auto text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:underline">
              Sign Up
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex flex-1">
          <img
            src={signUpImage}
            className="object-cover w-full h-full"
            alt="Login"
          />
        </div>
      </div>
    </>
  );
};

export default Login;
