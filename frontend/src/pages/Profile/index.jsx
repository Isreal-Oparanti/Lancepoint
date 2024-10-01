import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SideNav from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/auth";

const Profile = () => {
  const { auth, setAuth } = useContext(AuthContext); 
  const { id } = useParams(); 
  const [userProfile, setUserProfile] = useState(null); 
  const [editMode, setEditMode] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  
  const isOwnerProfile = !id || id === auth?.user?._id;
  const profileId = id ? id : auth.user._id;

   
  const [updatedSkills, setUpdatedSkills] = useState([]);
  const [description, setDescription] = useState("");
   useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/get-profile',  { profileId });
        const userData = response.data;
        setUserProfile(userData);
        setUpdatedSkills(userData.skills || []);
        setDescription(userData.description || "");
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [profileId]);

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
    const filteredSkills = updatedSkills.filter((skill) => skill !== skillToRemove);
    setUpdatedSkills(filteredSkills); 
  };

  const handleSave = async () => {
    try {
      const updatedUser = { userId: profileId, skills: updatedSkills, description }; 

       
      const response = await axios.put("http://localhost:5000/api/update", updatedUser);
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

  return (
    <div className="flex min-h-screen">
      <SideNav />

      <div className="p-6 flex-1 ml-[220px]">
        <Navbar />

        <div className="w-[80%] ml-20 border-1 rounded-xl p-6 bg-primary-dark text-white mt-5">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Profile</h1>
            {isOwnerProfile && (
              <button onClick={handleEditClick} className="bg-purple-dark text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition">
                {editMode ? "Cancel" : "Edit"}
              </button>
            )}
          </div>

          {userProfile ? (
            <div className="p-4 rounded-lg shadow">
              <h2 className="text-2xl font-semibold">{userProfile.firstname + " " + userProfile.lastname}</h2>
              <p>{userProfile.email}</p>

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
                  <div className="flex flex-wrap gap-2">
                    {updatedSkills.map((skill, index) => (
                      <span key={index} className="bg-purple-600 px-2 py-1 rounded text-sm">{skill}</span>
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
                    <button onClick={handleAddSkill} className="ml-2 bg-blue-600 px-2 font-bold text-white rounded-lg hover:bg-blue-500 transition">
                      +
                    </button>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {updatedSkills.map((skill, index) => (
                        <span key={index} className="bg-purple-600 px-2 rounded text-sm">
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
                <button onClick={handleSave} className="mt-4 bg-green-600 px-3 py-1 text-white rounded-lg hover:bg-green-500 transition">
                  Save
                </button>
              )}

                          </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
        {/* Reviews Section */}
        {auth.user.reviews && auth.user.reviews.length > 0 && <p className="font-bold ml-20 text-white mt-5 text-2xl">Proof of Work</p>}
        {auth.user.reviews && auth.user.reviews.length > 0 && (
                
                <div className="w-[80%] ml-20 border-1 rounded-xl p-6 bg-primary-dark text-white mt-2">
                  <h3 className="text-xl font-semibold">Reviews</h3>
                  {auth.user.reviews.map((review, index) => (
                    <div key={index} className="mt-3 border-b border-gray-600 pb-2">
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-400 font-bold">{review.rating} ⭐</span>
                        <span className="text-sm text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-white">{review.feedback || "No feedback provided"}</p>
                    </div>
                  ))}
                </div>
              )}

      </div>
    </div>
  );
};

export default Profile;
