// controllers/AuthController.js
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel.js');
const jwt = require('jsonwebtoken');

/** Middleware for verifying user */

// Registering a new user
exports.register = async function (req, res) {
  try {
    const { firstname, lastname, email, password, description } = req.body;

    console.log(req.body);
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    // Check for existing email
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Please use a unique email." });
    }

    // Create a new user instance with plain password
    const user = new UserModel({
      firstname,
      lastname,
      email,
      password, // Password will be hashed by pre-save middleware
      description
    });

    // Save the user to the database (password will be hashed automatically)
    const result = await user.save();

    // Prepare user data to send in response (exclude password)
    const userData = {
      _id: result._id,
      firstname: result.firstname,
      lastname: result.lastname,
      email: result.email,
      description: result.description,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    };

    res.status(201).json({ msg: "User Registered Successfully", user: userData });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

// Login Users
exports.login = async function (req, res) {
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User does not exist.' });
    }

    // Compare password using the comparePassword method
    const passwordIsValid = await user.comparePassword(password);

    if (!passwordIsValid) {
      return res.status(400).json({ error: 'Wrong password.' });
    }

    // // Generate JWT token
    // const token = jwt.sign(
    //   {
    //     userId: user._id,
    //     email: user.email
    //   },
    //   process.env.JWT_SECRET,
    //   { expiresIn: '24h' }
    // );

    return res.status(200).json({ message: "Login Successful",  user: user});
  } catch (error) {
    return res.status(500).json({ error: 'Login failed.', message: error.message });
  }
};


 

// Update user information
exports.updateUser = async (req, res) => {
  try {
    // Assuming userId is sent in the request
    const {userId, skills, description } = req.body;
    
    // Find the user by their ID
    const user = await UserModel.findById(userId);
     
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    if (skills) {
      user.skills = skills;
    }
    console.log(description)
    if (description) {
      console.log('hi')
      user.description = description;
    }

    // Save updated user data
    const updatedUser = await user.save();
    console.log(updatedUser)
    // Send updated user info back to the frontend
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
