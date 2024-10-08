import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import HomeIcon from "../../assets/LancePointLogo.svg";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { AuthContext } from "../../context/auth";

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const { auth } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          "https://x-ploit-backend-4.onrender.com/api/get-profile",
          { profileId: auth?.user?._id }
        );
        const userData = response.data;
        setUserProfile(userData);
        if (userData.wallet) {
          setWalletAddress(userData.wallet);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (auth?.user?._id) {
      fetchUserData();
    }
  }, [auth]);

  const copyToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress).then(() => {
        toast.success("Wallet address copied to clipboard!", {
          position: "top-right",
          duration: 4000,
        });
      });
    }
  };

  const formattedAddress =
    walletAddress.length > 0
      ? walletAddress.substring(0, 5) +
        "..." +
        walletAddress.substring(walletAddress.length - 5)
      : "";

  return (
    <>
      <Toaster />
      <header className="bg-opacity-90 mx-auto p-2 bg-primary-dark text-white rounded-full border-2 border-stone-500">
        <nav className="flex justify-between items-center w-[90%] mx-auto flex-row">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <img src={HomeIcon} alt="Home Icon" width="92" height="92" />
          </div>

          {/* Search Box - Hidden on medium and smaller screens */}
          <div className="relative hidden lg:flex items-center w-[300px]">
            <input
              type="text"
              placeholder="Search Jobs"
              className="w-full px-3 bg-primary-dark border-2 border-secondary-dark py-1 rounded-full outline-none text-secondary-dark"
            />
            <i className="absolute top-3 right-3 fa fa-search text-secondary-dark"></i>
          </div>

          {/* Logout Section - Visible on all screens */}
          <div className="flex items-center space-x-3">
            <Link to="/login" className="hover:text-blue-400 font-semi-bold flex items-center">
              <i className="fa-solid fa-right-from-bracket"></i>
              <span className="ml-1">Logout</span>
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
