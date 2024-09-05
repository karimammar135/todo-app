"use client";

import {useEffect, useState} from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast';
import axios from 'axios';
import {useRouter} from 'next/navigation'

export default function SignUp() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: ""
    })
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [loading, setLoading] = useState(false)

    const onLogin = async () => {
        try {
            setLoading(true)
            const response = await axios.post('/api/users/login', user)
            console.log("Successful login", response.data)
            router.push('/profile')
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
        <div className="bg-black flex justify-center items-center min-h-[100vh]">
            <div className="bg-white flex flex-col justify-center items-center gap-[10px] p-[10px]">
                <h1>{loading && "processing..." || "Login"}</h1>
                <input onChange={(e) => setUser({...user, email: e.target.value})} type='email' placeholder='Email'></input>
                <input onChange={(e) => setUser({...user, password: e.target.value})} name="pass" type="password" placeholder="password" required></input>
                <button onClick={onLogin} className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${buttonDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none': ''}`}>Login</button>
                <Link href="/signup">Sign up here</Link>
            </div>
        </div>
    )
}