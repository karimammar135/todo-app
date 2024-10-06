"use client";

import {useEffect, useState} from 'react'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import {useRouter} from 'next/navigation';

import Loader from '@/app/loader';

export default function LogIn() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: ""
    })
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [loading, setLoading] = useState(false)
    const [incorrectField, setIncorrectField] = useState('')

    const onLogin = async () => {
        try {
            setLoading(true)
            const response = await axios.post('/api/users/login', user)
            if (response.data.success === false){
                toast.error(response.data.error)
                setIncorrectField(response.data.incorrectField)
            } else {
                toast.success("Successfully logged in!")
                router.push('/profile')
            }
        } catch(error: any){
            console.log("Unsuccessful login", error)
            toast.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0){
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [user])

    return (
        <>
            {loading && <Loader></Loader>}
            <h1 className='text-5xl font-poppins font-extrabold'>Login</h1>
            <div className='flex flex-col justify-center items-center w-[100%] gap-5'>
                <input onChange={(e) => setUser({...user, email: e.target.value})} onClick={() => {if(incorrectField === 'email'){setIncorrectField('')}}} type='email' placeholder='Email' className={((incorrectField === 'email') ? 'border-2 border-solid border-red-600 rounded-full ': '') + 'w-full font-poppins bg-[#F1FFF6] text-[#626262] placeholder:text-[#626262] p-3 border-solid border-2 border-emerald-600 rounded-sm outline-emerald-900'}></input>
                <input onChange={(e) => setUser({...user, password: e.target.value})} onClick={() => {if(incorrectField === 'password'){setIncorrectField('')}}} name="pass" type="password" placeholder="password" className={((incorrectField === 'password') ? 'border-2 border-solid border-red-600 rounded-full ': '') + 'w-full font-poppins bg-[#F1FFF6] text-[#626262] placeholder:text-[#626262] p-3 border-solid border-2 border-emerald-600 rounded-sm'} required></input>
                <button onClick={onLogin} className={`w-full h-[50px] font-poppins bg-emerald-700 text-white font-bold py-2 px-4 rounded-sm ${buttonDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none': ''}`}>Login</button>
            </div>
            <Link className='text-blue-500 hover:text-blue-800/[0.6]' href="/signup">Sign up here</Link>
        </>  
    )
}