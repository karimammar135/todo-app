"use client";

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import react, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';

import LoginFormLayout from '../loginFormLayout';

export default function SignUp() {
    const router = useRouter();
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: ""
    })
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [loading, setLoading] = useState(false)
    const [incorrectField, setIncorrectField] = useState('')

    const onSignup = async () => {
        try{
            setLoading(true)
            const response = await axios.post('/api/users/signup', user);
            if (response.data.success === false){
                toast.error(response.data.error)
                setIncorrectField(response.data.incorrect_field)
            } else {
                toast.success("Successfully signed up!")
                loginUser()
            }
        } catch(error: any){
            console.log(`Unsuccessful signup..`, error.message)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    // Login User after sign up
    const loginUser = async () => {
        try {
            const response = await axios.post('/api/users/login', user)
            router.push('/profile')
        } catch(error: any){
            console.log("Unsuccessful login", error)
            toast.error(error)
        }
    }

    useEffect(() => {
        if(user.email.length > 0 && user.username.length > 0 && user.password.length > 0){
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [user])

    return (
        <LoginFormLayout action='Signup'>
            <h1 className='text-5xl font-extrabold'>{loading && "processing..." || "Sign up"}</h1>
            <div className='flex flex-col justify-center items-center w-[100%] gap-5'>
                <input onChange={(e) => setUser({...user, email: e.target.value})} onClick={() => {if(incorrectField === 'email'){setIncorrectField('')}}} type='email' placeholder='Email' className={((incorrectField === 'email') ? 'border-2 border-solid border-red-600 rounded-full': '') + ' w-full p-3 border-solid border-2 border-emerald-600 rounded-full outline-emerald-900'}></input>
                <input onChange={(e) => setUser({...user, username: e.target.value})} onClick={() => {if(incorrectField === 'username'){setIncorrectField('')}}} name="username" type="text" placeholder="username" className={((incorrectField === 'username') ? 'border-2 border-solid border-red-600 rounded-full': '') + ' w-full p-3 border-solid border-2 border-emerald-600 rounded-full'} required></input>
                <input onChange={(e) => setUser({...user, password: e.target.value})} name="pass" type="password" placeholder="password" required className='w-full p-3 border-solid border-2 border-emerald-600 rounded-full'></input>
            </div> 
            <button onClick={onSignup} className={`bg-emerald-700 text-white font-bold py-2 px-4 rounded ${buttonDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none': ''}`}>Sign up</button>
            <Link className='text-blue-500 hover:text-blue-800/[0.6]' href="/login">Login in here</Link>
        </LoginFormLayout>
    )
}
