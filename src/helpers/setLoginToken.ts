
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export const setLoginToken = (user: any, message: string) => {
    console.log(user)
    // Create token
    const tokenData = {
        id: user._id,
        email: user.email,
        username: user.username
    }
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})

    // Create response
    const response = NextResponse.json({
        message: message,
        success: true
    })
    // Set cookies
    response.cookies.set("token", token, {
        httpOnly: true,
    })

    return response;
}