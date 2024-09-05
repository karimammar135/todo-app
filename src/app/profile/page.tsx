"use client";

import React, { useState, useEffect } from 'react'
import { useRouter } from "next/navigation"
import toast from 'react-hot-toast';
import axios from 'axios';
import Link from 'next/link';
import { todo } from 'node:test';
import { get } from 'http';

export default function ProfileDefault() {
  const router = useRouter(); 
  const [user, setUser] = useState(null)
  const [showTodoForm, setShowTodoForm] = useState(false)
  const [newTodo, setNewTodo] = useState({
    title: "",
    content: ""
  })
  const [todos, setTodos] = useState([]);
  const [editTodo, setEditTodo] = useState({
    id: null,
    newContent: ""
  });

  // Get current logged in user
  const getProfile = async () => {
    const response = await axios.get("/api/users/me")
    setUser(response.data)
  }
  useEffect(() => {
    getProfile()
  }, [])

  // Get todos for this user
  const getTodos = async function () {
    const response = await axios.get("/api/todos/myTodos")
    setTodos(response.data)
    console.log(response.data)
  }
  useEffect(() => {
    getTodos()
  }, [])

  // Logout function
  const logout = async () => {
    try {
      await axios.get("/api/users/logout")
      toast.success("logged out")
      router.push('/login')
    } catch(error: any){
      console.error(error);
      toast.error(error.message)
    }
  }

  // Add a new todo
  const addTodo = async () => {
    console.log(`Title:${newTodo.title}, content: ${newTodo.content}`)
    try{
      const response = await axios.post("/api/todos/add", newTodo)
      console.log(response.data)
      getTodos()
    } catch(error: any){
      console.error(error);
      toast.error(error.message)
    }
  }

  // Delete todo
  const deleteTodo = async (todo_id: any) => {
    const response = await axios.delete('/api/todos/delete', {data: {todo_id: todo_id}})
    console.log(response.data)
    getTodos()
  }

  // Mark todo as completed
  const completeTodo = async (todo_id: any) => {
    const response = await axios.put('/api/todos/complete', {todo_id: todo_id})
    console.log(response.data)
    getTodos()
  }

  // Edit Todo
  const editTodoContent = async () => {
    const response = await axios.put("/api/todos/editContent", {todo_id: editTodo.id, newContent: editTodo.newContent})
    console.log(response.data)
    setEditTodo({...editTodo, id: null, newContent: ""})
    getTodos()
  }

  return (
    <section className='bg-white min-h-[100vh] grid grid-cols-sidebarcolumns '>
      <div className='flex flex-col justify-between bg-black'>
        <div className='flex flex-col'>
          <h1 className='text-white'>Profile Page</h1>
          {user && <>
            <span className='text-white'>Username: {user['username']}</span>
            <button onClick={() => setShowTodoForm(true)} className='bg-white rounded w-fit'>Add Todo</button>
          </>}
        </div>
        <button onClick={logout} className='bg-blue-600 text-white w-fit'>Log out</button>
      </div>
      <div className='flex flex-col items-center m-3'>
          {showTodoForm && <div className='flex flex-col justify-center rounded border-2 border-black max-w-[400px] bg-slate-400 h-fit mt-[20px]'>
            <h1>Add Todo</h1>
            <input onChange={(e) => setNewTodo({...newTodo , title: e.target.value})} placeholder='Title' type='text'></input>
            <textarea onChange={(e) => setNewTodo({...newTodo, content: e.target.value})} placeholder="Content"></textarea>
            <button onClick={addTodo} className='bg-slate-900 text-white'>Add</button>
          </div>}
          {user && <div className='mt-[20px] w-[100%] border-sky-900 border-2 border-solid rounded'>
            <ul>
              {todos.map((todo:any, i) => (
                <li key={todo._id} className='flex border-b-2 border-sky-900 border-solid p-3'>
                  <span className=''>{todo.title}</span>
                  {(editTodo.id === todo._id) && 
                  <div className='flex-grow flex flex-col'>
                    <textarea onChange={(e) => setEditTodo({...editTodo, newContent: e.target.value})} className='flex justify-center m-2 border-black border-2 border-solid rounded' placeholder="Content">{todo.content}</textarea>
                    <button onClick={editTodoContent} className='bg-blue-500 hover:bg-blue-700 text-white w-fit ml-3 rounded p-1'>Done</button>
                  </div>
                  || <p className='flex-grow flex justify-center'>{todo.content}</p>}
                  <span className={todo.completed ? 'text-green-600': 'text-red-700'}>{todo.completed && 'Completed' || 'Incompleted'}</span>
                  <div className='flex flex-col'>
                    <button onClick={() => deleteTodo(todo._id)} className='text-white bg-red-500 hover:bg-red-700 pl-3 pr-3'>Delete</button>
                    <button onClick={() => setEditTodo({...editTodo, id: todo._id})} className='text-white bg-slate-500 hover:bg-slate-700 pl-3 pr-3'>Edit</button>
                    {!todo.completed && 
                      <button onClick={() => completeTodo(todo._id)} className='bg-blue-500 hover:bg-blue-600 text-white'>Complete</button>
                    }
                  </div>
                </li>
              ))}
            </ul>
          </div>}
      </div>
    </section>
  )
}
