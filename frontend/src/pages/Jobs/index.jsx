import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import SideNav from '../../components/Sidebar';
import axios from 'axios';

function Job() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/get-jobs');
        setJobs(response.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const success = () => {
    alert('Job Created');
  };

  return (
    <div className="flex">
      <SideNav /> 
      <div className="p-6 flex-1 ml-[220px]">
        <Navbar />
        {jobs.length > 0 ? (
          jobs.map((user, id) => (
            <div
              key={id}
              className="bg-primary-dark w-[50%] bg-blur py-8 mx-auto mt-5 rounded-[20px] border-2 border-stone-500"
            >
              <div className="flex flex-col space-y-4 px-8">
                <h2 className="text-xl font-bold text-white">{user.jobTitle}</h2>
                <div className="flex space-x-4">
                  <div className="bg-gray-600 text-white rounded-md px-4 py-1 text-xs capitalize">
                    {user.tags}
                  </div>
                  <div className="bg-green-300 text-green-[.09] rounded-lg px-2 py-1 text-xs capitalize">
                    <span className="text-green-900 font-bold">${user.price}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{user.description}</p>
                <button
                  className="w-20 rounded-full bg-purple-dark hover:bg-blue-700 text-white font-bold py-1 px-3"
                  onClick={success}
                >
                  Apply
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="font-bold text-white">No available gig</div>
        )}
      </div>
    </div>
  );
}

export default Job;
