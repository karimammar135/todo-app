"use client";

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import react, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';

export default function SignUp() {
    const router = useRouter();
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: ""
    })
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSignup = async () => {
        console.log('submitted')
        try{
            setLoading(true)
            const response = await axios.post('/api/users/signup', user);
            console.log("Signup success", response.data);
            router.push('/login')
        } catch(error: any){
            console.log("Unsuccessful signup..", error.message)
            toast.error(error.message)
        } finally {
            setLoading(false)
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
        <div className="bg-black flex justify-center items-center min-h-[100vh]">
            <div className="bg-white flex flex-col justify-center items-center gap-[10px] p-[10px]">
                <h1>{loading && "processing..." || "Sign up"}</h1>
                <input onChange={(e) => setUser({...user, email: e.target.value})} type='email' placeholder='Email'></input>
                <input onChange={(e) => setUser({...user, username: e.target.value})} name="username" type="text" placeholder="username" required></input>
                <input onChange={(e) => setUser({...user, password: e.target.value})} name="pass" type="password" placeholder="password" required></input>
                <button onClick={onSignup} className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${buttonDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none': ''}`}>Sign up</button>
                <Link href="/login">Login in here</Link>
            </div>
        </div>
    )
}
