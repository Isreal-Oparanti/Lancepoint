import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SideNav from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/auth";
import { useOkto } from "okto-sdk-react";

const Profile = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [oktoUserDetails, setOktoUserDetails] = useState(null); // State for Okto user details
  const [editMode, setEditMode] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [copyButtonText, setCopyButtonText] = useState("Copy");

  const isOwnerProfile = !id || id === auth?.user?._id;
  const profileId = id ? id : auth.user._id;

  const [updatedSkills, setUpdatedSkills] = useState([]);
  const [description, setDescription] = useState("");

  const { getUserDetails } = useOkto();

  useEffect(() => {
    // Fetch profile from your backend
    const fetchUserProfile = async () => {
      try {
        const response = await axios.post(
          "https://x-ploit-backend-4.onrender.com/api/get-profile",
          { profileId }
        );
        const userData = response.data;
        setUserProfile(userData);
        setUpdatedSkills(userData.skills || []);
        setDescription(userData.description || "");
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();

    // Fetch Okto user details
    const fetchOktoUserDetails = async () => {
      try {
        const details = await getUserDetails();
        setOktoUserDetails(details);
      } catch (error) {
        console.error("Failed to fetch Okto user details:", error);
      }
    };

    fetchOktoUserDetails();
  }, [profileId, getUserDetails]);

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== "" && !updatedSkills.includes(newSkill)) {
      setUpdatedSkills([...updatedSkills, newSkill]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const filteredSkills = updatedSkills.filter(
      (skill) => skill !== skillToRemove
    );
    setUpdatedSkills(filteredSkills);
  };

  const handleSave = async () => {
    try {
      const updatedUser = {
        userId: profileId,
        skills: updatedSkills,
        description,
      };

      const response = await axios.put(
        "https://x-ploit-backend-4.onrender.com/api/update",
        updatedUser
      );
      const newData = response.data;

      if (isOwnerProfile) {
        setAuth({ user: newData });
        localStorage.setItem("user", JSON.stringify(newData));
      }

      setEditMode(false);
    } catch (error) {
      console.error("Error saving user information:", error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(userProfile.wallet);
      setCopyButtonText("Copied!");
      setTimeout(() => setCopyButtonText("Copy"), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="flex min-h-screen text-gray-300 mb-4">
      {/* <SideNav /> */}

      <div className="p-6 flex-1 md:ml-[12rem] lg:ml-[12rem]">
        <Navbar />

        <div className="w-[80%] mx-auto lg:ml-20 border-1 rounded-xl p-6 bg-primary-dark text-white mt-5">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Profile</h1>
            {isOwnerProfile && (
              <button
                onClick={handleEditClick}
                className="text-white py-2 px-4 rounded-lg transition"
              >
                {editMode ? (
                  <i className="fa-solid text-xl fa-times"></i>
                ) : (
                  <i className="fa-solid text-xl fa-edit"></i>
                )}
              </button>
            )}
          </div>

          {userProfile ? (
            <div className="flex flex-col space-y-4 p-4 rounded-lg shadow">
              <h2 className="text-2xl font-semibold capitalize">
                {userProfile.firstname + " " + userProfile.lastname}
              </h2>
              <p>
                <span className="font-semibold">Email: </span>
                <span className="text-gray-200">{userProfile.email}</span>
              </p>
              <p>
                <span className="font-semibold">Wallet Address:</span>{" "}
                <span className="text-green-500 break-words font-[monospace] text-sm">
                  {userProfile.wallet}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="ml-2 bg-transparent border-2 border-green-600 rounded-xl text-white text-xs px-2 py-1 transition"
                >
                  {copyButtonText}
                </button>
              </p>

              {/* {oktoUserDetails && (
                <div>
                  <h3 className="text-xl font-semibold">Okto User Details:</h3>
                  <pre>{JSON.stringify(oktoUserDetails, null, 2)}</pre>
                </div>
              )} */}

              <div className="mt-4">
                <h3 className="text-xl font-semibold">Description</h3>
                {!editMode ? (
                  <p>{description || "No description added yet"}</p>
                ) : (
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded-md"
                    placeholder="Add a description"
                    rows={3}
                  />
                )}
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-semibold">Skills</h3>
                {!editMode ? (
                  <div className="flex flex-wrap gap-4">
                    {updatedSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-purple-600 mt-4 px-2 py-1 rounded text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="bg-gray-800 text-white px-3 py-1 text-sm outline-none rounded-md"
                      placeholder="Add a skill"
                    />
                    <button
                      onClick={handleAddSkill}
                      className="ml-2 bg-blue-600 px-2 font-bold text-white rounded-lg hover:bg-blue-500 transition"
                    >
                      +
                    </button>

                    <div className="flex flex-wrap gap-3 mt-4">
                      {updatedSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-purple-600 px-2 rounded text-sm"
                        >
                          {skill}
                          <button
                            className="ml-2 text-red-500"
                            onClick={() => handleRemoveSkill(skill)}
                          >
                            x
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {editMode && (
                <button
                  onClick={handleSave}
                  className="mt-4 bg-green-600 px-3 py-1 text-white rounded-lg hover:bg-green-500 transition"
                >
                  Save
                </button>
              )}
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
