import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/dbConfig/dbConfig"
import { sendEmail } from "@/helpers/generateOtp"
import { emailTypes } from "@/app/enums";
import { getFutureDate } from "@/helpers/getFutureDate"
import bcryptjs from "bcryptjs"
import jwt from 'jsonwebtoken'

connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const {email, newPassword, confirmPassword, action, optValue} = reqBody;

        // Verify Password matching
        if (!(newPassword === confirmPassword)) {
            return NextResponse.json({error: "Password confirmation isn't applicable", success: false}, {status: 400})
        }

        // If sending OTP is the action
        if(action === "sendOtp") {
            // Get the user
            const user = await User.findOne({email});
            if (!user){
                return NextResponse.json({error: "Invalid user", success: false}, {status: 400});
            }
            // Send the email
            console.log(user.email, emailTypes.resetPassword, user.id);
            const emailResponse = await sendEmail(user.email, emailTypes.resetPassword, user.id)
            return NextResponse.json({
                emailResponse: emailResponse, 
                message: "OTP verification code has been send to your email",
                success: true
            });
        } 
        // If method is to Update new password
        else if(action === "updatePassword") {
            // Get the user
            const user = await User.findOne({email: email, forgotPasswordOtpExpiry: {$gt: getFutureDate(0)}});
            if (!user){
                return NextResponse.json({error: "OTP has expired", success: false}, {status: 400});
            }
            // Verify otp match
            const otpMatch = await bcryptjs.compare(optValue.toString(), user.forgotPasswordOtp)
            console.log(otpMatch)
            // If otp doesn't matche throw an error
            if (!otpMatch){
                user.forgotPasswordOtp = undefined
                user.forgotPasswordOtpExpiry = undefined
                await user.save()
                return NextResponse.json({error: "OTP mismatch"}, {status: 400})
            } else {
                // Update password
                const salt = await bcryptjs.genSalt(10)
                const newHashedPassword = await bcryptjs.hash(newPassword, salt)
                user.password = newHashedPassword
                user.forgotPasswordOtp = undefined
                user.forgotPasswordOtpExpiry = undefined
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
                    message: "Password was successfully updated", 
                    success: true
                })
                // Set cookies
                response.cookies.set("token", token, {
                    httpOnly: true,
                })

                return response;
            }
            // return NextResponse.json({message: "Password was successfully updated", success: true})
        }

        return NextResponse.json({message: "okay1"});
    } catch(e: any) {
        throw new Error(e)
    }
}