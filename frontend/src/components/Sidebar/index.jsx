import React, { useContext } from "react";
import { Link } from "react-router-dom";
// import HomeIcon from '@/assets/Home.svg';
// import BrowseJobs from '@/assets/Browse Jobs.svg';
// import YourGigs from '@/assets/Your Jobs.svg';
// import Application from '@/assets/Job Applications.svg';
// import Create from '@/assets/Create Jobs.svg';
// import Profile from '@/assets/iconamoon_profile.svg';
// import Logout from '@/assets/icons.svg';

import { AuthContext } from "../../context/auth";

const SideNav = () => {
  const { auth, logout } = useContext(AuthContext);

  const logoutuser = () => {
    logout();
    console.log(auth);
  };

  return (
    <div className="flex-1 bg-primary-dark h-screen p-8 fixed top-0 left-0 overflow-y-auto">
      <div className="text-white mt-10">
        <div className="font-bold capitalize">
          {auth.user.firstname + " " + auth.user.lastname}
        </div>
        <div className="text-secondary-dark">{auth.user.email}</div>
      </div>
      <ul className="space-y-6 text-white mt-10">
        <li className="flex gap-2 hover:bg-purple-dark p-1 pl-6 rounded">
          <Link to="/" className="hover:text-blue-400 font-semi-bold">
            <i class="fa-solid fa-house"></i> Home
          </Link>
        </li>
        <li className="flex gap-2 hover:bg-purple-dark p-1 pl-6 rounded">
          <Link to="/createjobs" className="hover:text-blue-400 font-semi-bold">
            <i class="fa-solid fa-square-plus"></i> Create Gigs
          </Link>
        </li>
        <li className="flex gap-2 hover:bg-purple-dark p-1 pl-6 rounded">
          <Link to="/jobs" className="hover:text-blue-400 font-semi-bold">
            <i class="fa-solid fa-chart-simple"></i> Browse Gigs
          </Link>
        </li>
        <li className="flex gap-2 hover:bg-purple-dark p-1 pl-6 rounded">
          <Link to="/yourjob" className="hover:text-blue-400 font-semi-bold">
            <i class="fa-solid fa-bell"></i> Your Gigs
          </Link>
        </li>
        <li className="flex gap-2 hover:bg-purple-dark p-1 pl-6 rounded">
          <Link
            to="/application"
            className="hover:text-blue-400 font-semi-bold"
          >
            <i class="fa-solid fa-rectangle-list"></i> Orders
          </Link>
        </li>

        <li className="flex gap-2 hover:bg-purple-dark p-1 pl-6 rounded">
          <Link to="/profile" className="hover:text-blue-400 font-semi-bold">
            <i class="fa-solid fa-user"></i> Profile
          </Link>
        </li>

        <li
          className="flex gap-2  p-1 pl-6 rounded "
          onClick={logoutuser}
          style={{ marginTop: "50px" }}
        ></li>
      </ul>
    </div>
  );
};

export default SideNav;
