import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import HomeIcon from "@/assets/LancepointLogo.svg";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { AuthContext } from "../../context/auth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        console.log("fetched wallet and user profile", userData);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <Toaster />
      <header className="bg-opacity-90 mx-auto p-2 bg-primary-dark text-white rounded-full border-2 border-stone-500">
        <nav className="flex justify-between items-center w-[90%] mx-auto md:flex-row flex-col">
          <div className="flex justify-between w-full md:w-auto items-center">
            <img src={HomeIcon} alt="Home Icon" width="92" height="92" />
            <button
              onClick={toggleMenu}
              className="text-3xl cursor-pointer md:hidden"
            >
              {isMenuOpen ? "Close" : "Menu"}
            </button>
          </div>

          <div className="relative flex items-center mt-3 md:mt-0 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search Jobs"
              className="w-full md:w-[300px] px-3 bg-primary-dark border-2 border-secondary-dark  py-1 rounded-full outline-none text-secondary-dark"
            />
            <i className="absolute top-3 right-3 fa fa-search text-secondary-dark"></i>
          </div>

          <div
            className={`md:flex md:flex-row md:items-center flex-col md:static absolute w-full left-0 md:min-h-fit min-h-[60vh] bg-primary-dark transition-all duration-500 ${
              isMenuOpen ? "top-[60px]" : "top-[-100%]"
            } md:space-x-8 space-y-4 md:space-y-0 items-center md:w-auto p-5 md:p-0`}
          >
            <ul className="flex md:flex-row flex-col md:gap-6 gap-4 text-center w-full">
              <li>
                <Link to="/jobs" className="hover:text-gray-500">
                  Jobs
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-gray-500">
                  Resources
                </a>
              </li>
            </ul>

            {/* <div className="whitespace-nowrap">
              {walletAddress ? (
                <p
                  className="cursor-pointer text-purple-500"
                  onClick={copyToClipboard}
                  title="Click to copy"
                >
                  {formattedAddress}
                </p>
              ) : (
                <p>No wallet connected</p>
              )}
            </div> */}
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
