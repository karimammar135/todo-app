import connect from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Todo from "@/models/todoModel";

connect();

export async function DELETE(request: NextRequest){
    try{
        // Get the requested todo
        const data = await request.json();
        const todo_id = data.todo_id;

        // Delete todo
        await Todo.deleteOne({_id: todo_id}).then((result) => {
            console.log(result);
        });

        // Return success message
        return NextResponse.json({"message": "todo deleted!"}, {status: 200});
    } catch(e: any){
        return NextResponse.json({"error": e.message}, {status: 400});
    }
}