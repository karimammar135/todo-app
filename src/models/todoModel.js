import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a title"]
    }, 
    content: {
        type: String,
        required: [true, "please provide content"]
    },
    completed: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "please provide valid user"]
    },
})

const Todo = mongoose.models.todos || mongoose.model("todos", todoSchema)

export default Todo;