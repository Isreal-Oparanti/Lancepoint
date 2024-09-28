import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import SideNav from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/auth";

const Profile = () => {
  const { auth, setAuth } = useContext(AuthContext); // Fetch user info from auth context
  const [editMode, setEditMode] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [updatedSkills, setUpdatedSkills] = useState(auth.user.skills || []);
  const [description, setDescription] = useState(auth.user.description || ""); // Initialize description state
  const userId = auth.user._id
  useEffect(() => {
    // Ensure that the updated skills and description are synced with the user info in auth context
    if (auth?.user.skills) {
      setUpdatedSkills(auth.user.skills);
    }
    if (auth?.description) {
      setDescription(auth.user.description);
    }
  }, [auth]);

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== "") {
      setUpdatedSkills([...updatedSkills, newSkill]);
      setNewSkill("");
    }
  };

  const handleSave = async () => {
    try {
      const updatedUser = {userId, skills: updatedSkills, description}; // Add description to updated user info

      // Save updated user info to the server
      const response = await axios.put("http://localhost:5000/api/update", updatedUser);

      const newData = response.data;
        console.log(newData)
      // Update the auth context with updated user info
      setAuth({user: newData});

      // Update the local storage with updated user info
      localStorage.setItem('user', JSON.stringify(newData));

      // Exit edit mode
      setEditMode(false);
    } catch (error) {
      console.error("Error saving user information:", error);
    }
  };

  return (
    <div className='flex min-h-screen'>
        <SideNav />
     
      <div className='p-6 flex-1 ml-[220px]'>
       
      <Navbar />
        <div className="w-[80%] ml-20 border-1 rounded-xl p-6 bg-primary-dark text-white mt-5">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Profile</h1>
            <button onClick={handleEditClick} className="bg-purple-dark text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition">
              {editMode ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className="p-4 rounded-lg shadow ">
            <h2 className="text-2xl font-semibold">{auth.user.firstname + " " + auth.user.lastname }</h2>
            <p>{auth.user.email}</p>

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
              <h3 className="text-xl font-semibold">Skills </h3>
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
                      <span key={index} className="bg-purple-600 px-2  rounded text-sm">{skill}</span>
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
