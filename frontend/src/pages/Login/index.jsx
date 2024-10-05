import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import signUpImage from "../../assets/2.jpeg";
import Icon from "../../assets/Solflare icon.svg"; 
import { AuthContext } from "../../context/auth";

const Login = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError(''); // 

    if (!email || !password) {
      setError('Please fill in all fields.');
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('https://x-ploit-backend-4.onrender.com/api/login', { email, password });

       
      const { user, token } = response.data;

       
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

       
      setAuth({user: user});

      toast.success('Login Successful!');
      
       
      navigate('/profile');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <>
      
      <div id="container" className="flex flex-col lg:flex-row justify-center w-full min-h-screen">
         
        <div className="flex-1 bg-primary-dark flex flex-col items-center justify-center p-4">
          <div className="bg-opacity-10 mt-10 flex justify-center bg-secondary-dark py-8 mx-auto shadow rounded-lg px-4 w-full max-w-md relative border-2 border-stone-700">
            <form onSubmit={handleFormSubmit} className="flex flex-col justify-center space-y-4 w-full">
              <div className="text-white mt-2 text-center text-xl font-semibold">Login</div>

              {error && <div className="text-red-500 text-center">{error}</div>}

              {/* Email Input */}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none placeholder:text-slate-400 text-slate-300 bg-slate-700 block w-full px-3 py-2 rounded-md shadow-sm"
              />

              {/* Password Input */}
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none placeholder:text-slate-400 text-slate-300 bg-slate-700 block w-full px-3 py-2 rounded-md shadow-sm"
              />

              <button type="submit" className="bg-purple-700 text-white py-2 px-4 w-full text-sm rounded-full hover:bg-purple-800 transition">
                Login
              </button>
            </form>
          </div>

          <div className='text-white mt-4 mx-auto text-center'>
            Don't have an account? <Link to='/' className="text-blue-400 hover:underline">Sign Up</Link>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:flex flex-1">
          <img src={signUpImage} className="object-cover w-full h-full" alt="Login" />
        </div>
      </div>
    </>
  );
};

export default Login;
