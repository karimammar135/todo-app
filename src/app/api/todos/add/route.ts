import connect from "@/dbConfig/dbConfig"
import { NextRequest, NextResponse } from "next/server";
import Todo from "@/models/todoModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";

connect();

export async function POST(request: NextRequest){
    try{
        // Extract submitted data
        const reqBody = await request.json();
        const {title, content} = reqBody;

        // Find current logged in user
        const tokenData:any = await getDataFromToken(request);
        const user = await User.findOne({email: tokenData.email});

        // Check if all fields are filled
        if (title.length === 0 || content.length === 0){
            return NextResponse.json({"error": "Fill all required fields"}, {status: 400})
        }

        // Create a new todo
        const newTodo = new Todo({title, content, user});
        const savedTodo = newTodo.save();

        // Return success message
        return NextResponse.json({
            message: "Successafully saved new todo",
            user: `${user}`,
            success: true,
            savedTodo
        })

    } catch(e: any){
        return NextResponse.json({error: e.message}, {status: 400})
    }
}