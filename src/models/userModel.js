import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {type: String, required: [true, "Please Provide a username"], unique: true},
    email: {type: String, rquired: [true, "Please Provide an email"], unique: true},
    password: {type: String, required: [true, "Please provide a password"]},
    avatar_id: {type: Number, required: [true, "Please Select an avatar"]},
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },

    forgotPasswordOtp: String,
    forgotPasswordOtpExpiry: Date,
    verifyOtp: String,
    verifyOtpExpiryDate: Date,
})

const User = mongoose.models.users || mongoose.model("users", userSchema)

export default User;