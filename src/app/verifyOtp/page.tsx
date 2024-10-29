

"use client";

import axios from 'axios';
import React, {useState, useEffect} from 'react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { BackgroundBeams } from "@/components/ui/background-beams";
import Loader from "@/components/ui/loader"

export default function VerifyEmailPage() {
  const router = useRouter()
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const [optValue, setOptValue] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [error, setError] = useState<boolean>(false)

  // Check when all fields are filled then verify the user
  useEffect(() => {
    if (optValue.length === 6) {
      console.log(Number(optValue))
      if (email.length > 0) {verifyUserEmail()};
    }
    // Remove error when retyping the otp code
    if (optValue.length < 6){
      setError(false)
    }
  }, [optValue])

  // Verify the user
  const verifyUserEmail = async () => {
    setLoading(true)
    try{
      const response = await axios.post("/api/users/verifyemail", {optValue, email})
      toast.success(response.data.message)
      setIsVerified(true)
      router.push("/dashboard/home")
    } catch(e: any){
      setError(true)
      toast.error(e.response.data.error)
    } finally {
      setLoading(false)
    }
  }

  // get email
  useEffect(() => {
    setEmail(window.location.search.split('=')[1] || "")
  }, [])

  return (
    <>
    {loading && <Loader></Loader>}
    <div className='flex justify-center items-center bg-black min-h-[100vh]'>
      {isVerified && <h1 className='text-white'>Your email has been successfully verified! <i className="fa-regular fa-thumbs-up text-emerald-600"></i></h1> ||
       <div className="space-y-2 z-10">
          <InputOTP
            maxLength={6}
            value={optValue}
            onChange={(optValue) => setOptValue(optValue)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className='text-white'/>
              <InputOTPSlot index={1} className='text-white'/>
              <InputOTPSlot index={2} className='text-white'/>
              <InputOTPSlot index={3} className='text-white'/>
              <InputOTPSlot index={4} className='text-white'/>
              <InputOTPSlot index={5} className='text-white'/>
            </InputOTPGroup>
          </InputOTP>
          <div className={(error ? "text-red-600": "text-white") + " text-center text-sm"}>
            {optValue === "" ? (
              <>Enter your one-time password.</>
            ) : (
              <>You entered: {optValue}</>
            )}
          </div>
        </div>
      }
      <BackgroundBeams />
    </div>
    </>
  )
}
