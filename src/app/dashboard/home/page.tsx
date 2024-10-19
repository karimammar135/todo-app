"use client";
import React, { useState, useEffect, Suspense} from 'react';
import axios from 'axios';
import { TasksGrid } from '@/components/ui/tasks-grid'
import toast from 'react-hot-toast';
import { Skeleton } from "@/components/ui/skeleton"

type TodosType = {_id: number, title: string, content: string, completed: boolean}[]

export default function Home() {
    const [todos, setTodos] = useState<TodosType | undefined>();

    // Get todos for this user
    const getTodos = async function () {
        const response = await axios.get("/api/todos/myTodos")
        setTodos(response.data)
        
    }
    useEffect(() => {
        getTodos()
    }, [])

    // Delete todo
    const deleteTodo = async (todo_id: number) => {
        const response = await axios.delete('/api/todos/delete', {data: {todo_id: todo_id}})
        toast.success(response.data.message)
        getTodos()
    }

    // Mark todo as completed or incompleted
    const completeTodo = async (todo_id: number, method: string) => {
        const response = await axios.put('/api/todos/complete', {todo_id: todo_id, method: method})
        getTodos()
    }

    // Edit Todo
    const editTodoContent = async (editTodo: {id: number, newContent: string}) => {
        const response = await axios.put("/api/todos/editContent", {todo_id: editTodo.id, newContent: editTodo.newContent})
        getTodos()
    }

    return (
        <section>
            {todos === undefined && <TodosSkeleton></TodosSkeleton> ||
            <TasksGrid items={todos} setItems={setTodos} completeTodo={completeTodo} deleteTodo={deleteTodo} editTodoContent={editTodoContent}></TasksGrid>}
        </section>
    )
}

function TodosSkeleton(){
    return (
        <div className='grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10 px-2'>    
            {Array.from({length: 9}).map((_, index) => (
                <Skeleton key={index} className="rounded-2xl h-full min-h-[200px] w-full p-4 z-10" />
            ))}
        </div>
    )
}
