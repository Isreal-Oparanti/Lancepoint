import React from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '/src/assets/Home.svg';
import BrowseJobs from '/src/assets/Browse Jobs.svg';
import YourGigs from '/src/assets/Your Jobs.svg';
import Application from '/src/assets/Job Applications.svg';
import Create from '/src/assets/Create Jobs.svg';
import Profile from '/src/assets/iconamoon_profile.svg';

const SideNav = () => {
  return (
    <div className="flex-1 bg-primary-dark h-screen p-6 fixed top-0 left-0 overflow-y-auto">
      <div className='text-white mt-10'>
        <div className='font-bold'>John Doe</div>
        <div className='text-secondary-dark'>johndoediv@gmail.com</div>
      </div>
      <ul className="space-y-6 text-white mt-10">
        <li className="flex gap-2 hover:bg-purple-dark p-1 pl-6 rounded">
          <img src={HomeIcon} alt="Home Icon" width="20" height="20" /> 
          <Link to="/" className="hover:text-blue-400 font-semi-bold">Home</Link>
        </li>
        <li className="flex gap-2 hover:bg-purple-dark p-1 pl-6 rounded">
          <img src={BrowseJobs} alt="Home Icon" width="20" height="20" />
          <Link to="/jobs" className="hover:text-blue-400 font-semi-bold">Browse Gigs</Link>
        </li>
        <li className="flex gap-2 hover:bg-purple-dark p-1 pl-6 rounded">
          <img src={YourGigs} alt="Home Icon" width="20" height="20" />
          <Link to="/yourGigs" className="hover:text-blue-400 font-semi-bold">Your Gigs</Link>
        </li>
        <li className="flex gap-2 hover:bg-purple-dark p-1 pl-6 rounded">
          <img src={Application} alt="Home Icon" width="20" height="20" />
          <Link to="/application" className="hover:text-blue-400 font-semi-bold">Application</Link>
        </li>
        <li className="flex gap-2 hover:bg-purple-dark p-1 pl-6 rounded">
          <img src={Create} alt="Home Icon" width="20" height="20" />
          <Link to="/createGig" className="hover:text-blue-400 font-semi-bold">Create Gigs</Link>
        </li>
        <li className="flex gap-2 hover:bg-purple-dark p-1 pl-6 rounded">
          <img src={Profile} alt="Home Icon" width="20" height="20" />
          <Link to="/profile" className="hover:text-blue-400 font-semi-bold">Profile</Link>
        </li>
      </ul>
    </div>
  );
}

export default SideNav;
