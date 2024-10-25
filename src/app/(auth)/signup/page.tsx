"use client";

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';

import Loader from '@/components/ui/loader';
import { avatars } from "@/app/avatars";

export default function SignUp() {
    const router = useRouter();
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        avatar_id: 0,
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
                console.log(response.data)
                // loginUser()
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
            router.push('/dashboard/home')
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

    // Select avatar
    const selectAvatar = (id: number):void => {
        console.log(`select this avatar ${id}`)
        setUser({
            ...user,
            avatar_id: id,
        })
    }

    return (
        <>
            {loading && <Loader></Loader>}
            <h1 className='text-5xl font-extrabold'>Sign up</h1>
            <div className='flex flex-col justify-center items-center w-[100%] gap-5'>
                <div className='flex flex-col items-center gap-2'>
                    <span className={(incorrectField === 'avatar') ? 'text-red-600' : 'text-neutral-400'}>Select avatar:</span>
                    <div className="flex flex-row items-center justify-center w-full">
                        <AnimatedTooltip items={avatars} selectAvatar={selectAvatar} selectedAvatar={user.avatar_id}/>
                    </div>
                </div>
                <input onChange={(e) => setUser({...user, email: e.target.value})} onClick={() => {if(incorrectField === 'email'){setIncorrectField('')}}} type='email' placeholder='Email' className={((incorrectField === 'email') ? 'border-2 border-solid border-red-600 rounded-full': '') + ' w-full font-poppins bg-[#F1FFF6] text-[#626262] placeholder:text-[#626262] p-3 border-solid border-2 border-emerald-600 rounded-sm outline-emerald-900'}></input>
                <input onChange={(e) => setUser({...user, username: e.target.value})} onClick={() => {if(incorrectField === 'username'){setIncorrectField('')}}} name="username" type="text" placeholder="username" className={((incorrectField === 'username') ? 'border-2 border-solid border-red-600 rounded-full': '') + ' w-full font-poppins bg-[#F1FFF6] text-[#626262] placeholder:text-[#626262] p-3 border-solid border-2 border-emerald-600 rounded-sm outline-emerald-900'} required></input>
                <input onChange={(e) => setUser({...user, password: e.target.value})} name="pass" type="password" placeholder="password" required className='w-full font-poppins bg-[#F1FFF6] text-[#626262] placeholder:text-[#626262] p-3 border-solid border-2 border-emerald-600 rounded-sm outline-emerald-900'></input>
            </div> 
            <button onClick={onSignup} className={`w-full h-[50px] font-poppins bg-emerald-700 text-white font-bold py-2 px-4 rounded-sm ${buttonDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none': ''}`}>Sign up</button>
            <Link className='text-blue-500 hover:text-blue-800/[0.6]' href="/login">Login in here</Link>
        </>
    )
}

