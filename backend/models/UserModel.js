// models/UserModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: {
        type: String,
        required: [true, "Please provide your first name"]
    },
    lastname: {
        type: String,
        required: [true, "Please provide your last name"]
    },
    email: {
        type: String,
        required: [true, "Please provide a valid email"],
        unique: [true, "Email already exists"],
        match: [/.+\@.+\..+/, "Please fill a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    description: { // Corrected spelling from 'discription' to 'description'
        type: String,
    },
    skills: [],

    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
}, 
{
    timestamps: true
});

// Pre-save middleware to hash the password before saving
UserSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password along with our new salt
        const hashedPassword = await bcrypt.hash(this.password, salt);
        // Override the cleartext password with the hashed one
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model('User', UserSchema);

// **Ensure this is the export statement**
module.exports = UserModel;
