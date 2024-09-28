const express = require('express');
const { register, login, updateUser} = require('../controllers/AuthController.js');
const { createJob, getAllJobs } = require('../controllers/job.js');
// const  localVariables  = require('../middleware/auth.js')
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/create-jobs', createJob);
router.put('/update', updateUser)
router.get('/get-jobs', getAllJobs);
 
module.exports = router;
    