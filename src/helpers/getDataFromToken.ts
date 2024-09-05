import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

export function getDataFromToken(request: NextRequest){
    try {
        // Get cookies token
        const token = request.cookies.get("token")?.value || ""
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!);

        return decodedToken;
    } catch (error: any) {
        throw new Error(error.models)
    }
}