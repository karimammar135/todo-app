import connect from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Todo from "@/models/todoModel";

connect();

export async function PUT(request: NextRequest){
    try {
        // Get the requested todo
        const { todo_id, newContent } = await request.json();
        const todo = await Todo.findById(todo_id);

        // Edit todo content
        todo.content = newContent;
        todo.save();

        // Return success message
        return NextResponse.json({
            "message": "Todo content edited successfuly",
            todo,
        }, {status: 200})

    } catch(e: any){
        return NextResponse.json({"error": e.message}, {status: 400});
    }
}