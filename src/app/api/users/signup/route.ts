import connect from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from '@/helpers/generateOtp'
import { emailTypes } from '@/app/enums'

connect()

export async function POST(request: NextRequest){
    try{
        const reqBody = await request.json()
        const {username, email, password, avatar_id} = reqBody

        // Check if all filed are given
        if (!(email.length > 0 && username.length > 0 && password.length > 0)){
            return NextResponse.json({error: "unfilled fields"}, {status: 400})
        }
        // Password must be at least of 6 characters
        if (password.length < 6){
            return NextResponse.json({error: "Password must be of 6 characters at least"}, {status: 400})
        }
        if (email.length < 6){
            return NextResponse.json({error: "Email must be of 6 characters at least"}, {status: 400})
        }

        // Check if user already exists
        const user = await User.findOne({email})
        if(user){
            if (!user.isVerified){
                await User.deleteOne(user)
            } else {
                return NextResponse.json({error: 'user already exists', success: false, incorrect_field: "email"}, {status: 400})
            }
        } 
        const username_user = await User.findOne({username: username})
        if (username_user){
            return NextResponse.json({error: 'Username already taken', success: false, incorrect_field: "username"}, {status: 400})
        } if (avatar_id < 0) {
            return NextResponse.json({error: 'Select an avatar', success: false, incorrect_field: "avatar"}, {status: 400});
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        // Create a new user
        const newUser = new User({
            username,
            email, 
            password: hashedPassword,
            avatar_id
        })
        const savedUser = await newUser.save()

        // Send verification email
        const emailresponse = await sendEmail(email, emailTypes.verify, savedUser.id)

        // Return a success message
        return NextResponse.json({
            message: "User was successfully added",
            emailresponse: emailresponse,
            success: true,
            savedUser
        })

    } catch(error: any){
        return NextResponse.json({error: error}, {status: 500})
    }
}