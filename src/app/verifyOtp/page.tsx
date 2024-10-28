

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

export default function VerifyEmailPage() {
  const router = useRouter()
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [optValue, setOptValue] = React.useState<string>("")
  const [disabled, setDisabled] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState<string>("")

  // Check when all fields are filled then verify the user
  useEffect(() => {
    if (optValue.length === 6) {
      console.log(Number(optValue))
      if (email.length > 0) {verifyUserEmail(); setDisabled(true)};
    }
  }, [optValue])

  // Verify the user
  const verifyUserEmail = async () => {
    try{
      const response = await axios.post("/api/users/verifyemail", {optValue, email})
      toast.success(response.data.message)
      setIsVerified(true)
      router.push("/dashboard/home")
    } catch(e: any){
      setDisabled(false)
      toast.error(e.response.data.error)
      router.push("/signup")
    }
  }

  // get email
  useEffect(() => {
    setEmail(window.location.search.split('=')[1] || "")
  }, [])

  return (
    <div className='flex justify-center items-center bg-black min-h-[100vh]'>
      {isVerified && <h1 className='text-white'>Your email has been successfully verified! <i className="fa-regular fa-thumbs-up text-emerald-600"></i></h1> ||
       <div className="space-y-2 z-10">
          <InputOTP
            maxLength={6}
            value={optValue}
            onChange={(optValue) => setOptValue(optValue)}
            className={disabled ? "opacity-50" : ""}
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
          <div className="text-center text-sm text-white">
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
  )
}
