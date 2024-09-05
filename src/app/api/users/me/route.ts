import User from "@/models/userModel";
import connect from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request: NextRequest) {
    try {
        // Get the user according to the id in token data
        const tokenData:any = await getDataFromToken(request);
        const user = await User.findOne({_id: tokenData.id}).select("-password -isAdmin");
        
        // Return the user
        return NextResponse.json(user);

    } catch (error: any){
        return NextResponse.json({"error": error}, {status: 400});
    }
}