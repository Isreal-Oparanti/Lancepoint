import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/auth";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { useOkto } from "okto-sdk-react";
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
  const [showModal, setShowModal] = useState(false);

  const [reviews, setReviews] = useState({});

  const [userDetails, setUserDetails] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [wallets, setWallets] = useState(null);
  const [transferResponse, setTransferResponse] = useState(null);
  const [orderResponse, setOrderResponse] = useState(null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  const {
    getUserDetails,
    getPortfolio,
    createWallet,
    transferTokens,
    orderHistory,
  } = useOkto();

  const [transferData, setTransferData] = useState({
    network_name: "",
    token_address: "",
    quantity: "",
    recipient_address: "",
  });

  const [orderData, setOrderData] = useState({
    order_id: "",
  });

  const fetchUserDetails = async () => {
    try {
      const details = await getUserDetails();
      setUserDetails(details);
      setActiveSection("userDetails");
    } catch (error) {
      setError(`Failed to fetch user details: ${error.message}`);
    }
  };

  const fetchPortfolio = async () => {
    try {
      const portfolio = await getPortfolio();
      setPortfolioData(portfolio);
      setActiveSection("portfolio");
    } catch (error) {
      setError(`Failed to fetch portfolio: ${error.message}`);
    }
  };

  const fetchWallets = async () => {
    try {
      const walletsData = await createWallet();
      console.log(walletsData);
      setWallets(walletsData);
      setActiveSection("wallets");
    } catch (error) {
      setError(`Failed to fetch wallets: ${error.message}`);
    }
  };

  const handleTransferTokens = async (e) => {
    e.preventDefault();
    try {
      const response = await transferTokens(transferData);
      setTransferResponse(response);
      setActiveSection("transferResponse");
    } catch (error) {
      setError(`Failed to transfer tokens: ${error.message}`);
    }
  };

  const handleOrderCheck = async (e) => {
    e.preventDefault();
    try {
      const response = await orderHistory(orderData);
      setOrderResponse(response);
      setActiveSection("orderResponse");
    } catch (error) {
      setError(`Failed to fetch order status: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    setTransferData({ ...transferData, [e.target.name]: e.target.value });
  };

  const handleInputChangeOrders = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

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
                            className="flex justify-between items-center bg-gray-700 p-3 rounded-lg"
                          >
                            <div>
                              {applicant.orders[0] &&
                              applicant.orders[0].completedStatus ? (
                                <div className="flex flex-col mb-3">
                                  <span className="text-green-500 mb-4">
                                    Job Completed
                                  </span>
                                  <div className="flex">
                                    <button className="bg-purple-600 p-1 mr-4 px-3 rounded-full text-white">
                                      <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={applicant.orders[0].jobLink}
                                      >
                                        View Job
                                      </a>
                                    </button>
                                    <button
                                      className="bg-purple-600 px-3 rounded-full text-white"
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
                                    <button
                                      className="ml-4 px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white"
                                      onClick={() => setShowModal(true)}
                                    >
                                      Initiate Transaction
                                    </button>
                                  </div>

                                  {showModal && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
                                      <div className="bg-gray-800 rounded-lg p-6 shadow-lg w-full min-w-[700px]">
                                        <h1 className="text-xl font-bold mb-4">
                                          Initiate Transaction
                                        </h1>

                                        <div className="mb-4 gap-4 flex flex-wrap">
                                          <button
                                            className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-white"
                                            onClick={fetchUserDetails}
                                          >
                                            View User Details
                                          </button>
                                          <button
                                            className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-white"
                                            onClick={fetchPortfolio}
                                          >
                                            View Portfolio
                                          </button>
                                          <button
                                            className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-white"
                                            onClick={fetchWallets}
                                          >
                                            View Wallets
                                          </button>
                                        </div>

                                        {activeSection === "userDetails" &&
                                          userDetails && (
                                            <div>
                                              <h2>User Details:</h2>
                                              <pre>
                                                {JSON.stringify(
                                                  userDetails,
                                                  null,
                                                  2
                                                )}
                                              </pre>
                                            </div>
                                          )}

                                        {activeSection === "portfolio" &&
                                          portfolioData && (
                                            <div>
                                              <h2>Portfolio Data:</h2>
                                              <pre>
                                                {JSON.stringify(
                                                  portfolioData,
                                                  null,
                                                  2
                                                )}
                                              </pre>
                                            </div>
                                          )}

                                        {activeSection === "wallets" &&
                                          wallets && (
                                            <div>
                                              <h2>Wallets:</h2>
                                              <pre>
                                                {JSON.stringify(
                                                  wallets,
                                                  null,
                                                  2
                                                )}
                                              </pre>
                                            </div>
                                          )}

                                        {/* Transfer Tokens Form */}
                                        <h2 className="mt-6 text-lg font-semibold">
                                          Transfer Tokens
                                        </h2>
                                        <form
                                          className="mt-2"
                                          onSubmit={handleTransferTokens}
                                        >
                                          <input
                                            className="w-full p-2 mb-2 rounded bg-gray-600 text-white"
                                            type="text"
                                            name="network_name"
                                            placeholder="Network Name"
                                            value={transferData.network_name}
                                            onChange={handleInputChange}
                                            required
                                          />
                                          <input
                                            className="w-full p-2 mb-2 rounded bg-gray-600 text-white"
                                            type="text"
                                            name="token_address"
                                            placeholder="Token Address"
                                            value={transferData.token_address}
                                            onChange={handleInputChange}
                                            required
                                          />
                                          <input
                                            className="w-full p-2 mb-2 rounded bg-gray-600 text-white"
                                            type="text"
                                            name="quantity"
                                            placeholder="Quantity"
                                            value={transferData.quantity}
                                            onChange={handleInputChange}
                                            required
                                          />
                                          <input
                                            className="w-full p-2 mb-2 rounded bg-gray-600 text-white"
                                            type="text"
                                            name="recipient_address"
                                            placeholder="Recipient Address"
                                            value={
                                              transferData.recipient_address
                                            }
                                            onChange={handleInputChange}
                                            required
                                          />
                                          <button
                                            className="mr-4 bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
                                            type="submit"
                                          >
                                            Transfer Tokens
                                          </button>

                                          <button
                                            className="mt-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
                                            onClick={() => setShowModal(false)}
                                          >
                                            Close
                                          </button>
                                        </form>

                                        {activeSection === "transferResponse" &&
                                          transferResponse && (
                                            <div>
                                              <h2 className="mt-4">
                                                Transfer Response:
                                              </h2>
                                              <pre>
                                                {JSON.stringify(
                                                  transferResponse,
                                                  null,
                                                  2
                                                )}
                                              </pre>
                                            </div>
                                          )}
                                      </div>
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
        </div>
      </div>
    </div>
  );
};

export default YourGigsPage;
