import connect from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'

connect()

export async function POST(request: NextRequest){
    try{
        const reqBody = await request.json()
        const {username, email, password} = reqBody

        // Check if all filed are given
        if (!(email.length > 0 && username.length > 0 && password.length > 0)){
            return NextResponse.json({error: "unfilled fields"}, {status: 400})
        }

        // Check if user already exists
        const user = await User.findOne({email})
        if(user){
            return NextResponse.json({error: 'user already exists'}, {status: 400})
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        // Create a new user
        const newUser = new User({
            username,
            email, 
            password: hashedPassword
        })
        const savedUser = newUser.save()

        // Return a success message
        return NextResponse.json({
            message: "User was successfully added",
            success: true,
            savedUser
        })

    } catch(error: any){
        return NextResponse.json({error: error}, {status: 500})
    }
}