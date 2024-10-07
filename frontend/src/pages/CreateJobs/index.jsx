import React, { useState, useContext } from "react";
import Navbar from "../../components/Navbar";
import SideNav from "../../components/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth";

function CreateGig() {
  const { auth, setAuth } = useContext(AuthContext); // Get auth context
  const navigate = useNavigate();
  console.log(auth);
  const [jobsData, setJobsData] = useState({
    jobTitle: "",
    tags: "",
    price: "",
    description: "",
    amount: "",
    startDate: "",
    endDate: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const dataToSubmit = { ...jobsData, userId: auth.user._id };

    try {
      const response = await fetch(
        "https://x-ploit-backend-4.onrender.com/api/create-jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`, // Optional if auth token is required
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create the job");
      }

      const newJob = await response.json();

      // Update auth state with the new job
      setAuth((prevAuth) => ({
        ...prevAuth,
        user: {
          ...prevAuth.user,
          jobs: [...prevAuth.user.jobs, newJob],
        },
      }));

      // Clear form data
      setJobsData({
        jobTitle: "",
        tags: "",
        price: "",
        description: "",
        amount: "",
        startDate: "",
        endDate: "",
      });

      toast.success("You have successfully created a new Gig");
      navigate("/jobs");
    } catch (error) {
      console.error("Error submitting job:", error);
      toast.error("Failed to create the job. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <SideNav />

      <div className="p-6 flex-1 ml-[220px]">
        <Navbar />
        <div className="bg-primary-dark  sm:w-[60%] lg:w-[50%] bg-blur py-8 mx-auto mt-5 rounded-[20px] border-2 border-stone-500 text-secondary-dark">
          <form
            className="flex flex-col items-center space-y-4 px-4 sm:px-8"
            onSubmit={handleSubmit}
          >
            {/* Job Title Input */}
            <div className="w-full">
              <label htmlFor="jobTitle" className="block mb-2">
                Job Title
              </label>
              <input
                type="text"
                id="jobTitle"
                value={jobsData.jobTitle}
                onChange={(e) =>
                  setJobsData({ ...jobsData, jobTitle: e.target.value })
                }
                className="w-full bg-gray-900 rounded-md border border-gray-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Tags Input */}
            <div className="w-full">
              <label htmlFor="tags" className="block mb-2">
                Add Tag
              </label>
              <input
                type="text"
                id="tags"
                value={jobsData.tags}
                onChange={(e) =>
                  setJobsData({ ...jobsData, tags: e.target.value })
                }
                className="w-full bg-gray-900 rounded-md border border-gray-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Price Input */}
            <div className="w-full">
              <label htmlFor="price" className="block mb-2">
                Price
              </label>
              <input
                type="text"
                id="price"
                value={jobsData.price}
                onChange={(e) =>
                  setJobsData({ ...jobsData, price: e.target.value })
                }
                className="w-full bg-gray-900 rounded-md border border-gray-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Description Input */}
            <div className="w-full">
              <label htmlFor="description" className="block mb-2">
                Job Description
              </label>
              <textarea
                id="description"
                value={jobsData.description}
                onChange={(e) =>
                  setJobsData({ ...jobsData, description: e.target.value })
                }
                className="w-full bg-gray-900 rounded-md border border-gray-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Start Date and End Date Inputs */}
            <div className="w-full flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-full sm:w-1/2">
                <label htmlFor="startDate" className="block mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={jobsData.startDate}
                  onChange={(e) =>
                    setJobsData({ ...jobsData, startDate: e.target.value })
                  }
                  className="w-full bg-gray-900 rounded-md border border-gray-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="w-full sm:w-1/2">
                <label htmlFor="endDate" className="block mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={jobsData.endDate}
                  onChange={(e) =>
                    setJobsData({ ...jobsData, endDate: e.target.value })
                  }
                  className="w-full bg-gray-900 rounded-md border border-gray-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="w-full">
              <h2 className="text-lg font-semi-bold mb-2">Payment</h2>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="w-full sm:w-1/2 flex items-center space-x-2">
                  <label htmlFor="token" className="whitespace-nowrap">
                    Token:
                  </label>
                  <input
                    type="text"
                    id="token"
                    placeholder="Token"
                    value={jobsData.token}
                    onChange={(e) =>
                      setJobsData({ ...jobsData, token: e.target.value })
                    }
                    className="w-full bg-gray-900 rounded-md border border-gray-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="w-full sm:w-1/2 flex items-center space-x-2">
                  <label htmlFor="amount" className="whitespace-nowrap">
                    Amount:
                  </label>
                  <input
                    type="text"
                    id="amount"
                    placeholder="Amount"
                    value={jobsData.amount}
                    onChange={(e) =>
                      setJobsData({ ...jobsData, amount: e.target.value })
                    }
                    className="w-full bg-gray-900 rounded-md border border-gray-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-purple-700 hover:bg-blue-700 font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
            >
              Create Job
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateGig;
