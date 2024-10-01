import React,{ useContext } from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '/src/assets/Home.svg';
import BrowseJobs from '/src/assets/Browse Jobs.svg';
import YourGigs from '/src/assets/Your Jobs.svg';
import Application from '/src/assets/Job Applications.svg';
import Create from '/src/assets/Create Jobs.svg';
import Profile from '/src/assets/iconamoon_profile.svg';
import Logout from '/src/assets/icons.svg';
import { AuthContext } from '../../context/auth';

 
 
 
const SideNav = () => {
  const { auth, logout } = useContext(AuthContext); // Get auth context
   
   const logoutuser = () =>{ 
      logout()
      console.log(auth)
   }

  return (
    <div className="flex-1 bg-primary-dark h-screen p-6 fixed top-0 left-0 overflow-y-auto">
      <div className='text-white mt-10'>
        <div className='font-bold capitalize'>{auth.user.firstname+ " "+ auth.user.lastname}</div>
        <div className='text-secondary-dark'>{auth.user.email}</div>
      </div>
      <ul className="space-y-6 text-white mt-10">
        <li className="flex gap-2 hover:bg-purple-dark p-1 pl-6 rounded">
          <img src={HomeIcon} alt="Home Icon" width="20" height="20" /> 
          <Link to="/home" className="hover:text-blue-400 font-semi-bold">Home</Link>
        </li>
        <li className="flex gap-2 hover:bg-purple-dark p-1 pl-6 rounded">
          <img src={Create} alt="Home Icon" width="20" height="20" />
          <Link to="/createjobs" className="hover:text-blue-400 font-semi-bold">Create Gigs</Link>
        </li>
        <li className="flex gap-2 hover:bg-purple-dark p-1 pl-6 rounded">
          <img src={BrowseJobs} alt="Home Icon" width="20" height="20" />
          <Link to="/jobs" className="hover:text-blue-400 font-semi-bold">Browse Gigs</Link>
        </li>
        <li className="flex gap-2 hover:bg-purple-dark p-1 pl-6 rounded">
          <img src={YourGigs} alt="Home Icon" width="20" height="20" />
          <Link to="/yourjob" className="hover:text-blue-400 font-semi-bold">Your Gigs</Link>
        </li>
        <li className="flex gap-2 hover:bg-purple-dark p-1 pl-6 rounded">
          <img src={Application} alt="Home Icon" width="20" height="20" />
          <Link to="/application" className="hover:text-blue-400 font-semi-bold">Orders</Link>
        </li>
        
        <li className="flex gap-2 hover:bg-purple-dark p-1 pl-6 rounded">
          <img src={Profile} alt="Home Icon" width="20" height="20" />
          <Link to="/profile" className="hover:text-blue-400 font-semi-bold">Profile</Link>
        </li>

        <li className="flex gap-2  p-1 pl-6 rounded " onClick={logoutuser} style={{marginTop: '90px'}}>
          <img src={Logout} alt="Home Icon" width="20" height="20" />
          <Link to="/login" className="hover:text-blue-400 font-semi-bold">Logout</Link>
        </li>
      </ul>

       
    </div>
  );
}

export default SideNav;
