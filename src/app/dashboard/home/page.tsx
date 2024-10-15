"use client";
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { TasksGrid } from '@/components/ui/tasks-grid'

export default function Home() {
    const [todos, setTodos] = useState([]);

    // Get todos for this user
    const getTodos = async function () {
        const response = await axios.get("/api/todos/myTodos")
        setTodos(response.data)
        console.log(response.data.length)
    }
    useEffect(() => {
        getTodos()
    }, [])

    // Delete todo
    const deleteTodo = async (todo_id: number) => {
        const response = await axios.delete('/api/todos/delete', {data: {todo_id: todo_id}})
        console.log(response.data)
        getTodos()
    }

    // Mark todo as completed or incompleted
    const completeTodo = async (todo_id: number, method: string) => {
        const response = await axios.put('/api/todos/complete', {todo_id: todo_id, method: method})
        console.log(response.data)
        getTodos()
    }

    // Edit Todo
    const editTodoContent = async (editTodo: {id: number, newContent: string}) => {
        const response = await axios.put("/api/todos/editContent", {todo_id: editTodo.id, newContent: editTodo.newContent})
        console.log(response.data)
        getTodos()
    }

    return (
        <section>
            <TasksGrid items={todos} completeTodo={completeTodo} deleteTodo={deleteTodo} editTodoContent={editTodoContent}></TasksGrid>
        </section>
    )
}
