import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  clusterApiUrl,
  Keypair,
} from "@solana/web3.js";
import { ConnectEmbed } from "thirdweb/react";
import { client } from "../../client";
import { createWallet } from "thirdweb/wallets";

const ApplicationPage = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [orderJob, setOrderJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobId, setJobId] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [jobLink, setJobLink] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");

  // State to control component visibility
  const [showWormhole, setShowWormhole] = useState(false);
  const [showConnectEmbed, setShowConnectEmbed] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          "https://x-ploit-backend-4.onrender.com/api/get-profile",
          { profileId: auth?.user?._id }
        );
        const userData = response.data;
        if (userData.wallet) {
          setWalletAddress(userData.wallet);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    if (auth?.user?._id) {
      fetchUserData();
    }
  }, [auth]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://x-ploit-backend-4.onrender.com/api/get-profile",
          {
            profileId: auth?.user?._id,
          }
        );
        const userData = response.data;
        if (userData.wallet) {
          setWalletAddress(userData.wallet);
        }
        console.log(userData, "user data");
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    if (auth?.user?._id) {
      fetchData();
    }
  }, [auth]);

  useEffect(() => {
    const fetchOrderJob = async () => {
      try {
        const order = auth.user.orders.find((order) => !order.completedStatus);
        if (order) {
          setJobId(order.id);
          const response = await axios.post(
            "https://x-ploit-backend-4.onrender.com/api/get-job",
            { jobIds: [order.id] }
          );
          if (response.data.jobs && response.data.jobs.length > 0) {
            setOrderJob(response.data.jobs[0]);
          }
        }
        console.log(order, "jjobs");
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
      const updatedOrders = auth.user.orders.map((order) =>
        order.id === jobId
          ? { ...order, completedStatus: true, jobLink }
          : order
      );

      await axios.post(
        "https://x-ploit-backend-4.onrender.com/api/update-order",
        {
          userId: auth.user._id,
          orders: updatedOrders,
        }
      );

      setAuth((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          orders: updatedOrders,
        },
      }));

      setIsSubmitted(true);
      toast.success("Job submitted successfully!");
    } catch (error) {
      console.error("Error submitting the job:", error);
      toast.error("Failed to submit the job.");
    }
  };

  const wallet = [
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
  ];

  return (
    <div className="min-h-screen flex text-white">
      <div className="p-6 flex-1 md:ml-[12rem] lg:ml-[12rem]">
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
              <h2 className="text-xl font-bold mb-2 text-2xl">
                {orderJob.jobTitle}
              </h2>

              <div className="flex items-center justify-between text-sm"></div>
              <p className="text-lg mb-4 ">{orderJob.description}</p>
              <div className="text-sm text-yellow-400">
                Amount: ${orderJob.amount}
              </div>
              <div className="text-sm text-blue-400">
                Start Date: {orderJob.startDate}
              </div>
              <div className="text-sm text-red-400">
                End Date: {orderJob.endDate}
              </div>

              {isExpanded && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">
                    Link to the Job:
                  </label>
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
                  onClick={() =>
                    isExpanded ? handleSubmit() : setIsExpanded(true)
                  }
                  className={`px-4 py-2 rounded text-white ${
                    isSubmitted
                      ? "bg-gray-500"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                  disabled={isSubmitted}
                >
                  {isSubmitted
                    ? "Job Submitted"
                    : isExpanded
                    ? "Submit Job"
                    : "Submit Order"}
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
