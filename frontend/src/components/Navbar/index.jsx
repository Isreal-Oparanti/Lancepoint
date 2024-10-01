import React, { useState } from "react";
import { Link } from "react-router-dom";
import  HomeIcon  from '/src/assets/LancepointLogo.svg';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="bg-opacity-90 mx-auto p-2 bg-primary-dark text-white rounded-full border-2 border-stone-500">
        <nav className="flex justify-between  items-center w-[90%] mx-auto md:flex-row flex-col">
         
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
            className={`md:flex   md:flex-row md:items-center flex-col md:static absolute w-full left-0 md:min-h-fit min-h-[60vh] bg-primary-dark transition-all duration-500 ${
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

            <div className=" gap-3   md:mt-0">
              <button className="bg-primary-dark text-white px-4 py-2 w-[10rem] bg-blue-700  rounded-full hover:bg-blue-700">
                <Link to="/createjobs">Create Jobs</Link>
              </button>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
