import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/auth";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";
import { ConnectEmbed } from "thirdweb/react";
import { client } from "../../client";
import { createWallet } from "thirdweb/wallets";
import { Toaster } from "react-hot-toast";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
} from "@solana/web3.js";

import Transactions from "../../components/transaction";

const YourGigsPage = ({ authToken, handleLogout }) => {
   
  const { auth } = useContext(AuthContext);
  const [userJobs, setUserJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState({});
  const [accordionOpen, setAccordionOpen] = useState({});
  const [userOrders, setUserOrders] = useState([]);
  const [a, setA] = useState(true);
  const [pending, setPending] = useState(false);

  const [reviews, setReviews] = useState({});

  const [showWormhole, setShowWormhole] = useState(false);
  const [showConnectEmbed, setShowConnectEmbed] = useState(false);

  const handleRatingChange = (rating, applicantId) => {
    setReviews((prev) => ({
      ...prev,
      [applicantId]: { ...prev[applicantId], rating },
    }));
  };

  const handleFeedbackChange = (feedback, applicantId) => {
    setReviews((prev) => ({
      ...prev,
      [applicantId]: { ...prev[applicantId], feedback },
    }));
  };

  const wallet = [
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
  ];

  const handleSubmitReview = async (e, applicantId) => {
    e.preventDefault();
    const review = reviews[applicantId];

    try {
      await axios.post(
        `https://x-ploit-backend-4.onrender.com/api/save-review`,
        {
          applicantId,
          rating: review.rating,
          feedback: review.feedback,
        }
      );
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review.");
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobIds = auth.user.jobs || [];
        if (jobIds.length > 0) {
          const response = await axios.post(
            "https://x-ploit-backend-4.onrender.com/api/get-job",
            { jobIds }
          );
          setUserJobs(response.data.jobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [auth.user.jobs]);

  const fetchApplicants = async (job) => {
    if (!applicants[job._id]) {
      try {
        const response = await axios.post(
          "https://x-ploit-backend-4.onrender.com/api/get-user",
          {
            applicantIds: job.applied,
          }
        );
        setApplicants((prev) => ({
          ...prev,
          [job._id]: response.data.applicants,
        }));
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    }
  };
  console.log(applicants);

  const toggleAccordion = (jobId) => {
    setAccordionOpen((prev) => ({ ...prev, [jobId]: !prev[jobId] }));
    if (!applicants[jobId]) {
      fetchApplicants(userJobs.find((job) => job._id === jobId));
    }
  };

  const toggleApplication = async (applicantId, jobId, accepted) => {
    isOrderStarted(jobId); // assuming this checks order status
    try {
      if (!accepted) {
        // Start order (accept application)
        await axios.post(
          "https://x-ploit-backend-4.onrender.com/api/accept-application",
          {
            applicantId,
            jobId,
          }
        );
        toast.success("Application accepted!");
        setPending(true);

        // Add order to user orders
        setUserOrders((prevOrders) => [
          ...prevOrders,
          { id: jobId, completedStatus: false },
        ]);
      } else {
        // Cancel order (cancel application)
        await axios.post(
          "https://x-ploit-backend-4.onrender.com/api/cancel-application",
          {
            applicantId,
            jobId,
          }
        );
        toast.success("Application canceled!");
        setPending(false);

        // Remove order from user orders
        setUserOrders((prevOrders) =>
          prevOrders.filter((order) => order.id.toString() !== jobId)
        );
      }

      // Update applicant's accepted status
      setApplicants((prev) => ({
        ...prev,
        [jobId]: prev[jobId].map((applicant) =>
          applicant._id === applicantId
            ? { ...applicant, accepted: !accepted }
            : applicant
        ),
      }));
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const isOrderStarted = (jobId) => {
    setA(userOrders.some((order) => order.id === jobId));
    console.log(a);
  };

  const modalRef = useRef(null);

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowConnectEmbed(false);
    }
  };

  useEffect(() => {
    // Attach the event listener
    document.addEventListener("mousedown", handleOutsideClick);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="min-h-screen flex text-white">
      <div className="p-6 flex-1 md:ml-[12rem] lg:ml-[12rem]">
        <Navbar />

        <div className="p-6">
          <h1 className="text-3xl font-semibold mb-6">Your Gigs</h1>

          {loading ? (
            <p className="text-gray-400">Loading your gigs...</p>
          ) : userJobs.length === 0 ? (
            <p className="text-gray-400">You haven't created any gigs yet.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userJobs.map((job, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-300"
                  style={{ height: "auto !important" }}
                >
                  <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className={`bg-${
                        job.status === "started" ? "blue" : "green"
                      }-500 text-white px-2 py-1 rounded`}
                    >
                      {job.status}
                    </span>
                    <span className="text-gray-400">
                      {job.applied.length} applied
                    </span>
                  </div>
                  <p className="font-bold text-xl">{job.jobTitle}</p>
                  <button className="text-gray-400 p-1 rounded bg-purple-900">
                    {job.tags}
                  </button>
                  <p className="text-gray-400 mb-4">{job.description}</p>
                  <div className="text-sm text-yellow-400">
                    Amount: ${job.amount}
                  </div>
                  <div className="text-sm text-blue-400">
                    Start Date: {job.startDate}
                  </div>
                  <div className="text-sm text-red-400">
                    End Date: {job.endDate}
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => toggleAccordion(job._id)}
                      className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white"
                    >
                      {accordionOpen[job._id]
                        ? "Hide Applicants"
                        : "View Applicants"}
                    </button>
                  </div>

                  {accordionOpen[job._id] && (
                    <div className="mt-4 space-y-4">
                      {applicants[job._id] ? (
                        applicants[job._id].map((applicant) => (
                          <div
                            key={applicant._id}
                            className="flex justify-between items-center bg-gray-700 p-3 rounded-lg "
                          >
                            <div>
                              {/* {console.log(} */}
                              {/* {pending &&  } */}
                              {applicant.orders[0] &&
                              applicant.orders[0].completedStatus ? (
                                <div className="flex flex-col mb-3 ">
                                  {applicant.orders[0].completedStatus ? (
                                    <span className="text-green-500 mb-4">
                                      Job Completed
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        toggleApplication(
                                          applicant._id,
                                          job._id,
                                          applicant.accepted
                                        )
                                      }
                                      className={`px-3 mb-5 py-1 rounded text-white ${
                                        applicant.accepted
                                          ? "bg-red-500 hover:bg-red-600"
                                          : "bg-green-500 hover:bg-green-600"
                                      }`}
                                    >
                                      {applicant.accepted
                                        ? "Cancel Order"
                                        : "Start Order"}
                                    </button>
                                  )}

                                  <div className="flex">
                                    <button className="bg-purple-600 p-1 mr-4  px-3  rounded-full text-white">
                                      <a
                                        target="_blank"
                                        href={applicant.orders[0].jobLink}
                                      >
                                        View Job
                                      </a>
                                    </button>

                                    {/* Review Button */}
                                    <button
                                      className="bg-purple-600    px-3  rounded-full text-white"
                                      onClick={() =>
                                        setAccordionOpen((prev) => ({
                                          ...prev,
                                          [applicant._id]: !prev[applicant._id],
                                        }))
                                      }
                                    >
                                      {accordionOpen[applicant._id]
                                        ? "Hide Review"
                                        : "Write Review"}
                                    </button>
                                  </div>
                                  <div className="flex justify-center mt-8">
                                    <button
                                      onClick={() =>
                                        setShowWormhole((prev) => !prev)
                                      }
                                      className="px-4 py-2 rounded text-sm bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                      Convert Asset With Wormhole
                                    </button>
                                    <button
                                      onClick={() =>
                                        setShowConnectEmbed((prev) => !prev)
                                      }
                                      className="ml-4 px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                      Initiate Transaction
                                    </button>
                                  </div>
                                  {/* Review Form (Shown when expanded) */}
                                  {accordionOpen[applicant._id] && (
                                    <div className="bg-gray-700 p-4 rounded-lg">
                                      <form
                                        onSubmit={(e) =>
                                          handleSubmitReview(e, applicant._id)
                                        }
                                      >
                                        {/* Rating Section */}
                                        <div className="mb-4">
                                          <label className="block text-white mb-2">
                                            Rating:
                                          </label>
                                          <div className="flex space-x-2">
                                            {[1, 2, 3, 4, 5].map((rating) => (
                                              <label
                                                key={rating}
                                                className="text-white"
                                              >
                                                <input
                                                  type="radio"
                                                  name={`rating-${applicant._id}`}
                                                  value={rating}
                                                  onChange={() =>
                                                    handleRatingChange(
                                                      rating,
                                                      applicant._id
                                                    )
                                                  }
                                                />
                                                {rating} ⭐
                                              </label>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Performance Feedback */}
                                        <div className="mb-4">
                                          <label className="block text-white mb-2">
                                            Freelancer Performance:
                                          </label>
                                          <textarea
                                            className="w-full p-2 rounded bg-gray-600 text-white"
                                            placeholder="Describe the freelancer's performance"
                                            value={applicant.feedback}
                                            onChange={(e) =>
                                              handleFeedbackChange(
                                                e.target.value,
                                                applicant._id
                                              )
                                            }
                                          />
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                          type="submit"
                                          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
                                        >
                                          Submit Review
                                        </button>
                                      </form>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <p className="font-bold bg-secondary-dark rounded mb-6 p-2 text-gray-100">
                                  Pending
                                </p>
                              )}

                              <p className="font-semibold mb-2">
                                {applicant.firstname} {applicant.lastname}
                              </p>
                              <a
                                href={`/profile/${applicant._id}`}
                                className="text-blue-500"
                              >
                                View Profile
                              </a>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400">No applicants found.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {showWormhole && (
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mt-6">
              <h2 className="text-xl font-bold mb-4"> Connect with Wormhole</h2>
              <WormholeConnect />

              <Toaster />
            </div>
          )}
          {/* Connect Embed Display */}
          {showConnectEmbed && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="rounded-lg p-6 shadow-lg bg-white mt-6 flex justify-center items-center flex-col w-full max-w-[400px] ">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                  onClick={() => setShowConnectEmbed(false)}
                >
                  &times;
                </button>
                <Transactions closeModal={() => setShowConnectEmbed(false)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YourGigsPage;
