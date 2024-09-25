import { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom"
import signUpImage from "../../assets/2.jpeg" 
import signUpImage1 from "../../assets/1.jpeg" 
const SignUp = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send request to backend
      const response = await axios.post('/api/signup', { username });
      console.log('Signup successful:', response.data);
      // Handle successful signup response here
    } catch (error) {
      console.error('Signup failed:', error.response.data);
      // Handle signup failure here
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) { // Check if Metamask is installed
      try {
        // Request access to the user's MetaMask account
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Metamask is connected, handle further actions here
        console.log('Metamask connected');
      } catch (error) {
        console.error('Error connecting Metamask:', error);
        // Handle error
      }
    } else {
      console.error('Metamask not installed');
      // Handle Metamask not installed
    }
  };

  return (
    <>
      <div id="container" className="flex flex-row justify-center w-full ">
        <div className="flex-1  bg-primary-dark">
          <p className="font-bold text-white mt-4 p-2 font-bold text-xl">WorkChain</p>
      <div className="bg-opacity-10 mt-10 flex justify-center bg-secondary-dark bg-blur  py-8 mx-auto shadow rounded-[20px] px-4 w-[45%] relative border-2 border-stone-700">
      <form onSubmit={handleFormSubmit} className="flex flex-col justify-center space-y-4 rounded-lg w-full mt-2">
        <div className="text-white mt-7 text-center">Sign Up</div>
        
        {/* First Name and Last Name */}
        <div className="flex gap-4">
          <div className="mt-1 w-full">
            <input
              type="text"
              name="firstname"
              placeholder="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="appearance-none placeholder:text-slate-400 text-slate-300 bg-slate-700 block w-full px-3 py-2 rounded-xlg rounded-md shadow-sm placeholder-gray-400 w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mt-1 w-full">
            <input
              type="text"
              name="lastname"
              placeholder="lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="appearance-none placeholder:text-slate-400 text-slate-300 bg-slate-700 block w-full px-3 py-2 rounded-xlg rounded-md shadow-sm placeholder-gray-400 w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
    
        {/* Email Input */}
        <div className="mt-1 w-full">
          <input
            type="email"
            name="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none placeholder:text-slate-400 text-slate-300 bg-slate-700 block w-full px-3 py-2 rounded-xlg rounded-md shadow-sm placeholder-gray-400 w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
    
        {/* Password Input */}
        <div className="mt-1 w-full">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none placeholder:text-slate-400 text-slate-300 bg-slate-700 block w-full px-3 py-2 rounded-xlg rounded-md shadow-sm placeholder-gray-400 w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
    
        {/* Connect Wallet */}
        <div className="text-white ">Connect Wallet</div>
        <div className="flex justify-center">
          <button onClick={connectWallet} className="bg-white py-1 px-3 w-full text-xs rounded-full">Soiflare</button>
        </div>
    
        {/* Sign Up Button */}
        <div className="flex justify-center">
          <button type="submit" className="bg-purple-dark text-white py-1 px-3 w-full text-sm rounded-full">
            <Link to={'/login'}>Sign Up</Link>
          </button>
        </div>

      </form>
      
    </div>
    <div className='text-white mt-1 mx-auto text-center'>Already have an account?  <Link to={'/login'}> LOGIN</Link></div>
        </div>
        <div className="Signupimage flex-1 bg-green-100">
        {/* dkfjdkljfladjfljk */}
          {/* <img src={signUpImage1}  className="h-full -z-10 absolute" alt="signUpImage1" /> */}
          <img src={signUpImage}  className="h-full w-full z-20" alt="signUpImage" />
        </div>
      </div>
    </>
  );
};

export default SignUp;
