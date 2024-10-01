import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

const ApplicationPage = () => {
  const { auth, setAuth } = useContext(AuthContext);  // Access user info and update function
  const [orderJob, setOrderJob] = useState(null);     // State to store the fetched job
  const [loading, setLoading] = useState(true);       // Loading state
  const [jobId, setJobId] = useState("");             // State to store job ID
  const [isExpanded, setIsExpanded] = useState(false);  // Track if job is expanded
  const [jobLink, setJobLink] = useState("");         // State to store input link
  const [isSubmitted, setIsSubmitted] = useState(false);  // Track if job has been submitted

  // Fetch the job from auth.user.order and display it
  useEffect(() => {
    const fetchOrderJob = async () => {
      try {
        // Assuming there's only one order in auth.user.order for this example
        const order = auth.user.orders.find(order => !order.completedStatus);
        if (order) {
          setJobId(order.id);
          const response = await axios.post("http://localhost:5000/api/get-job", { jobIds: [order.id] });
          if (response.data.jobs && response.data.jobs.length > 0) {
            setOrderJob(response.data.jobs[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        toast.error("Failed to load the job.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderJob();
  }, [auth.user.orders]);

  const handleSubmit = async () => {
    if (!jobLink) {
      toast.error("Please enter the job link.");
      return;
    }

    try {
      // Update the completedStatus to true and save the jobLink
      const updatedOrders = auth.user.orders.map(order =>
        order.id === jobId ? { ...order, completedStatus: true, jobLink } : order
      );

      // Send the update request to the backend
      await axios.post("http://localhost:5000/api/update-order", {
        userId: auth.user._id,
        orders: updatedOrders,
      });

      // Update auth context with the new orders
      setAuth((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          orders: updatedOrders,
        },
      }));

      setIsSubmitted(true);  // Mark the job as submitted
      toast.success("Job submitted successfully!");
    } catch (error) {
      console.error("Error submitting the job:", error);
      toast.error("Failed to submit the job.");
    }
  };

  return (
    <div className="min-h-screen flex text-white">
      <Sidebar />

      <div className="p-6 flex-1 ml-[220px]">
        <Navbar />

        <div className="p-6">
          <h1 className="text-3xl font-semibold mb-6">Your Current Order</h1>

          {loading ? (
            <p className="text-gray-400">Loading your order...</p>
          ) : orderJob ? (
            <div className="bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
              <span className="bg-green-500 text-white px-1 py-1 rounded">
                {orderJob.status}
              </span>
              <h2 className="text-xl font-bold mb-2 text-2xl">{orderJob.jobTitle}</h2>
              
              <div className="flex items-center justify-between text-sm">
                {/* Additional Job Info */}
              </div>
              <p className="text-lg mb-4 ">{orderJob.description}</p>
              <div className="text-sm text-yellow-400">Amount: ${orderJob.amount}</div>
              <div className="text-sm text-blue-400">Start Date: {orderJob.startDate}</div>
              <div className="text-sm text-red-400">End Date: {orderJob.endDate}</div>

              {/* Toggle input on button click */}
              {isExpanded && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Link to the Job:</label>
                  <input
                    type="text"
                    value={jobLink}
                    onChange={(e) => setJobLink(e.target.value)}
                    className="bg-gray-700 text-white p-2 rounded-lg w-full"
                    placeholder="Enter job link"
                  />
                </div>
              )}

              <div className="mt-4">
                <button
                  onClick={() => (isExpanded ? handleSubmit() : setIsExpanded(true))}
                  className={`px-4 py-2 rounded text-white ${isSubmitted ? "bg-gray-500" : "bg-purple-600 hover:bg-purple-700"}`}
                  disabled={isSubmitted}
                >
                  {isSubmitted ? "Job Submitted" : isExpanded ? "Submit Job" : "Submit Order"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">You have no active orders.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage;
