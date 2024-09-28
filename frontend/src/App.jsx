import { useState, useEffect, useContext } from 'react'
// import Navbar from './components/Navbar'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Post from './pages/Discuss'
// import Vendor from './pages/Vendors'
// import Profile from './pages/Profile'
import Login from './pages/Login'
import SignUp from './pages/SignUp';
import Home from './pages/HomePage';
import CreateGig from './pages/CreateJobs';
import Jobs from './pages/Jobs';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './pages/Profile';
 //** */ auth Middleware ///
 

function App() {
  // const { auth, setAuth } = useContext(AuthContext);
  // const { profile, setProfile } = useContext(ProfileContext);
  // const user = JSON.parse(localStorage.getItem('user'))
  
  // const fetchUserInfo = async () => {
  //   try {
  //     const response = await axios.get(`${server}/user/get-user/${user._id}`);
  //     const data = response.data;
  //     console.log(data)
  //     setAuth({ ...auth, user: data})
  //     localStorage.setItem('user', JSON.stringify(data));
  //   } catch (error) {
  //     console.error('Error fetching user profile:', error);
  //   }
  // };
  
  // useEffect(() => {
     
  //     fetchUserInfo();
  //     fetchUserProfile()
   
  // }, []);

  
  return (
    <div className="App">
      {/* <div className='blur' style={{top: '-18%', right: '0'}}></div>
      <div className='blur' style={{top: '36%', left: '-8rem'}}></div>         */}
        <Router>
          
          <Routes>
             <Route path="/" element={<SignUp/>} />
             <Route path="/login" element={<Login/>} />
             <Route path="/home" element={<Home/>} />
             <Route path="/createjobs" element={<CreateGig/>} />
             <Route path="/jobs" element={<Jobs/>} />
             <Route path="/profile" element={<Profile/>} />
          </Routes>
          
        </Router>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />

    </div>
  )
}

export default App
