import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {type: String, required: [true, "Please Provide a username"], unique: true},
    email: {type: String, rquired: [true, "Please Provide an email"], unique: true},
    password: {type: String, required: [true, "Please provide a password"]},

    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },

    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiryDate: Date,
})

const User = mongoose.models.users || mongoose.model("users", userSchema)

export default User;