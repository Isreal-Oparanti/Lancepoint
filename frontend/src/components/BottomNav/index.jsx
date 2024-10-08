// BottomNav.js
import React from "react";
import { Link } from "react-router-dom";

const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary-dark p-2 flex justify-around">
      <Link to="/jobs" className="text-white hover:text-blue-400">
        <i className="fa-solid fa-chart-simple"></i>
      </Link>
      <Link to="/createjobs" className="text-white hover:text-blue-400">
        <i className="fa-solid fa-square-plus"></i>
      </Link>

      <Link to="/yourjob" className="text-white hover:text-blue-400">
        <i className="fa-solid fa-bell"></i>
      </Link>
      <Link to="/application" className="text-white hover:text-blue-400">
        <i class="fa-solid fa-rectangle-list"></i>
      </Link>
      <Link to="/profile" className="text-white hover:text-blue-400">
        <i className="fa-solid fa-user"></i>
      </Link>
    </div>
  );
};

export default BottomNav;
