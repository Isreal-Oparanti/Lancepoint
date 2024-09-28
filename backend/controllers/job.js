const Job = require('../models/job.js');
const User = require('../models/UserModel.js'); // Assuming you have a User model

exports.createJob = async function (req, res) {
  const { jobTitle, tags, price, description, amount, startDate, endDate, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Find the user by their ID
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new job instance
    const newJob = new Job({
      jobTitle,
      tags,
      price,
      description,
      amount,
      startDate,
      endDate,
      createdBy: userId
    });

    // Save the new job to the database
    const savedJob = await newJob.save();

    // Update the user's jobs array
    user.jobs.push(savedJob._id);
    await user.save();

    // Return a response with the saved job
    res.status(201).json(savedJob);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create job' });
  }
};

exports.getAllJobs = async function (req, res) {
  try {
    // Fetch all jobs from the database
    const jobs = await Job.find();
    
    // Send the jobs as a response
    res.status(200).json(jobs);
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// module.exports = router;

     