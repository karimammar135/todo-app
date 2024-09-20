import connect from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from "jsonwebtoken"

connect();

export async function POST(request: NextRequest){
    try{
        const reqBody = await request.json()
        const {email, password} = reqBody

        // Check if user exists
        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({error: "Unavailable user", incorrectField: 'email', success: false}, {status: 200})
        } 

        // Make sure password is correct
        const validPassword = await bcryptjs.compare(password, user.password)
        if (!validPassword) {
            return NextResponse.json({error: "Incorrect password", incorrectField: 'password', success: false}, {status: 200})
        }

        // Create token
        const tokenData = {
            id: user._id,
            email: user.email,
            username: user.username
        }
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})

        // Create response
        const response = NextResponse.json({
            message: "Successfuly logged in",
            success: true
        })
        // Set cookies
        response.cookies.set("token", token, {
            httpOnly: true,
        })

        return response;
    } catch(error: any){
        return NextResponse.json({error: "unsuccessfull login"}, {status: 500})
    }
}