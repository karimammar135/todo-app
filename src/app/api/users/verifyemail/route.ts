import connect from "@/dbConfig/dbConfig"
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server"
import { getFutureDate } from "@/helpers/getFutureDate"
import bcryptjs from 'bcryptjs'
import jwt from "jsonwebtoken"

connect()

export async function POST(request: NextRequest){
    try{
        const reqBody = await request.json()
        const {optValue, email} = reqBody
        console.log(optValue, email)

        const user = await User.findOne({email: email, verifyOtpExpiryDate: {$gt: getFutureDate(0)}})

        if(!user){
            return NextResponse.json({error: "Invalid email or OTP"}, {status: 400})
        }

        const otpMatch = await bcryptjs.compare(optValue.toString(), user.verifyOtp)
        console.log(otpMatch)
        if (otpMatch){
            user.isVerified = true;
            user.verifyOtp = undefined;
            user.verifyOtpExpiryDate = undefined;
            await user.save()

            // Then sign up the user(login automatically)
            // Create token
            const tokenData = {
                id: user._id,
                email: user.email,
                username: user.username
            }
            const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})

            // Create response
            const response = NextResponse.json({
                message: "User verified successfully",
                success: true
            })
            // Set cookies
            response.cookies.set("token", token, {
                httpOnly: true,
            })

            return response;
        } else {
            await User.deleteOne(user)
            return NextResponse.json({error: "Invalid OTP code"}, {status: 400})
        }
    } catch(error: any){
        return NextResponse.json({error: error.message}, {status: 500})
    }
}