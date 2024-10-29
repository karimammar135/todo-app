import connect from "@/dbConfig/dbConfig"
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server"
import { getFutureDate } from "@/helpers/getFutureDate"
import bcryptjs from 'bcryptjs'
import { setLoginToken } from "@/helpers/setLoginToken"

connect()

export async function POST(request: NextRequest){
    try{
        const reqBody = await request.json()
        const {optValue, email} = reqBody

        // Get user
        const user = await User.findOne({email: email, verifyOtpExpiryDate: {$gt: getFutureDate(0)}})

        if(!user){
            return NextResponse.json({error: "Invalid email or OTP"}, {status: 400})
        }

        // Verify otp match
        const otpMatch = await bcryptjs.compare(optValue.toString(), user.verifyOtp)
        if (otpMatch){
            user.isVerified = true;
            user.verifyOtp = undefined;
            user.verifyOtpExpiryDate = undefined;
            await user.save()

            // Then login the user automatically
            const response = setLoginToken(user, "User verified successfully")

            return response;
        } else {
            return NextResponse.json({error: "Invalid OTP code"}, {status: 400})
        }
    } catch(error: any){
        return NextResponse.json({error: error.message}, {status: 500})
    }
}