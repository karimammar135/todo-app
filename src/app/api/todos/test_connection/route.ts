import connect from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Todo from "@/models/todoModel";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request: NextRequest){
    try {
        // Get todos filtered to this user
        const users = await User.find()

        // Return todos
        return NextResponse.json(users);
    } catch(e: any){
        return NextResponse.json({"error connection failed": e.message}, {status: 400})
    }
}