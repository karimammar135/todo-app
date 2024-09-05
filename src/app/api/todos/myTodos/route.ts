import connect from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Todo from "@/models/todoModel";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request: NextRequest){
    try {
        // Find current logged in user
        const tokenData:any = await getDataFromToken(request);
        const user = await User.findOne({email: tokenData.email});
        
        // Get todos filtered to this user
        const todos = await Todo.find({user: user});

        // Return todos
        return NextResponse.json(todos);
    } catch(e: any){
        return NextResponse.json({"error": e.message}, {status: 400})
    }
}