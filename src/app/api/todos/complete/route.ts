import connect from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Todo from "@/models/todoModel";

connect();

export async function PUT(request: NextRequest){
    try {
        // Get the requested todo
        const data = await request.json();
        const todo_id = data.todo_id;
        const method = data.method;
        const todo = await Todo.findById(todo_id);

        // Edit todo as completed
        if (method === "incomplete") {
            todo.completed = false;
        } else {
            todo.completed = true;
        }
        todo.save();

        // Return success message
        return NextResponse.json({
            "message": `Todo markes as ${method}`,
        }, {status: 200})

    } catch(e: any){
        return NextResponse.json({"error": e.message}, {status: 400});
    }
}