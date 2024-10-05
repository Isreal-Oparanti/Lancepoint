import React, { useState, useEffect, useContext } from 'react'; 
import Navbar from '../../components/Navbar';
import SideNav from '../../components/Sidebar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format, differenceInWeeks, differenceInDays } from 'date-fns';
import { AuthContext } from '../../context/auth'; 

function Job() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]); 
  const { auth } = useContext(AuthContext); 
  const userId = auth.user._id
  console.log(userId)
  useEffect(() => {
 
    const fetchJobsAndApplied = async () => {
       
      try {
        const [jobsResponse, appliedResponse] = await Promise.all([
          axios.get('https://x-ploit-backend-4.onrender.com/api/get-jobs'),
          axios.post(`https://x-ploit-backend-4.onrender.com/api/get-apply-jobs`, { userId })
        ]);
        
        setJobs(jobsResponse.data);
        setAppliedJobs(appliedResponse.data.appliedJobs); // Assuming the API returns an array of applied job IDs
      } catch (error) {
        console.error(error);
      }
    };

    fetchJobsAndApplied();
  }, [auth.user._id]);

  // Function to apply for a job
  const applyForJob = async (jobId) => {
    try {
      const userId = auth.user._id; // Get the logged-in user's ID

      const response = await axios.post('https://x-ploit-backend-4.onrender.com/api/apply', {
        jobId,
        userId,
      });

      if (response.status === 200) {
        toast.success('You have successfully applied for the job!');
        setAppliedJobs((prev) => [...prev, jobId]); 
      } else {
        toast.error('There was an issue applying for the job.');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message); // Display the specific error message from the server
      } else {
        console.error(error);
        toast.error('An error occurred while applying.');
      }
    }
  };
console.log(appliedJobs)
   
  const formatDateAndDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const weeks = differenceInWeeks(end, start);
    const days = differenceInDays(end, start);

    let duration = weeks > 0 ? `${weeks} week${weeks > 1 ? 's' : ''}` : `${days} day${days > 1 ? 's' : ''}`;
    const formattedStartDate = format(start, 'MM/dd/yyyy');
    const formattedEndDate = format(end, 'MM/dd/yyyy');

    return { duration, formattedStartDate, formattedEndDate };
  };

  return (
    <div className="flex min-h-screen">
      <SideNav />
      <div className="p-6 flex-1 ml-[220px]">
        <Navbar />
 

    
        {jobs.length > 0 ? (
          jobs.map((job, id) => {
            const { duration, formattedStartDate, formattedEndDate } = formatDateAndDuration(job.startDate, job.endDate);

            const hasApplied = appliedJobs.includes(job._id); // Check if the user has applied for this job

            return (
              <div
                key={id}
                className="bg-primary-dark w-full lg:w-[50%] bg-blur py-8 mx-auto mt-5 rounded-lg border-2 border-stone-500"
              >
                <div className="flex flex-col space-y-4 px-8">
                  <h2 className="text-xl font-bold text-white">{job.jobTitle}</h2>

                  <div className="flex flex-wrap gap-4">
                    <div className="bg-gray-600 text-white rounded-md px-4 py-1 text-xs capitalize">
                      {job.tags}
                    </div>
                    <div className="bg-green-300 text-green-[.09] rounded-lg px-2 py-1 text-xs capitalize">
                      <span className="text-green-900 font-bold">${job.price}</span>
                    </div>
                    <div className="bg-gray-600 text-white rounded-md px-4 py-1 text-xs">
                      {duration} ({formattedStartDate} - {formattedEndDate})
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm">{job.description}</p>

                  {hasApplied ? (
                    <button
                      
                      className="w-full lg:w-20 rounded bg-gray-500 text-white font-bold py-1 px-3"
                      
                      onClick={() => applyForJob(job._id)}
                    >
                      Applied
                    </button>
                  ) : (
                    <button
                      className="w-full lg:w-20 rounded bg-purple-dark hover:bg-blue-700 text-white font-bold py-1 px-3"
                      onClick={() => applyForJob(job._id)}
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="font-bold text-white">No available gig</div>
        )}
      </div>
    </div>
  );
}

export default Job;
