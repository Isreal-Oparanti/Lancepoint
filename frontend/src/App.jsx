import React, { useState, useEffect } from "react";

import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
  useLocation,
} from "react-router-dom";
import SideNav from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/HomePage";
import CreateGig from "./pages/CreateJobs";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
import YourGigsPage from "./pages/YourJobs";
import Application from "./pages/Application";
import { OktoProvider, BuildType } from "okto-sdk-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const OKTO_CLIENT_API_KEY = "870a3df1-2aa7-4cd0-b403-8b4f09aea96e";

  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation(); // Get the current location

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isLandingPage = location.pathname === "/";
  const isSignupPage = location.pathname === "/signup";
  const isLoginPage = location.pathname === "/login";

  console.log("App component rendered");
  const [authToken, setAuthToken] = useState(null);
  const handleLogout = () => {
    console.log("setting auth token to null");
    setAuthToken(null); // Clear the authToken
  };

  return (
    <OktoProvider apiKey={OKTO_CLIENT_API_KEY} buildType={BuildType.SANDBOX}>
      <div className="App">
        {/* <Route path="/login" element={<Login />} /> */}
        <div className="flex">
          {/* Show SideNav on larger screens and not on landing, signup, or login pages */}
          {!isMobile && !isLandingPage && !isSignupPage && !isLoginPage && (
            <SideNav />
          )}
          {/* Main content area */}
          <div className={`flex-1 ${isMobile ? "ml-0" : "ml-0"}`}>
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/createjobs" element={<CreateGig />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/yourjob" element={<YourGigsPage />} />
              <Route path="/application" element={<Application />} />
            </Routes>
          </div>
        </div>
        {/* Show BottomNav on smaller screens and not on landing, signup, or login pages */}
        {isMobile && !isLandingPage && !isSignupPage && !isLoginPage && (
          <BottomNav />
        )}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </OktoProvider>
  );
}

// Wrap the App component with Router
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
