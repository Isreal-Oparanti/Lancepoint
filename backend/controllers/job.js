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

exports.getAJob = async function (req, res) {
  try {
    const { jobIds } = req.body;
    const jobs = await Job.find({ _id: { $in: jobIds } }); // Assuming Job is your job model
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs' });
  }
}

exports.applyForJob = async function (req, res) {
  const { jobId, userId } = req.body;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Add the userId to the appliedUsers array if not already present
    if (!job.applied.includes(userId)) {
      job.applied.push(userId);
    } else {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    await job.save();
    res.status(200).json({ message: 'Application successful', job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.getApplyJobs = async function (req, res) {
  try {
    const userId = req.body.userId; // Get the userId from the route parameters
    // console.log(req.params.userId)
    // id = userId.toString()
  
    // Find all jobs where the applied property includes the userId
    const jobs = await Job.find({applied: userId})
     
     const apply = jobs.map((job) => job._id);
   
    
    return res.status(200).json({
      success: true,
      appliedJobs: apply, // Send back the array of job IDs
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching applied jobs.',
    });
  }
};
  
 

// module.exports = router;

     