"use client";

import axios from 'axios';
import React, {useState, useEffect} from 'react'

export default function VerifyEmailPage() {
  const [token, setToken] = useState<string>("")
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  // Verify the user
  const verifyUserEmail = async () => {
    try{
      await axios.post("/api/users/verifyemail", {token})
      setIsVerified(true)
    } catch(e: any){
      setError(true)
      console.log(e.response.data)
    }
  }

  // Run verification method
  useEffect(() => {
    if (token.length > 0) verifyUserEmail();
  }, [token])

  useEffect(() => {
    setToken(window.location.search.split('=')[1] || "")
  }, [])

  
  console.log(token)

  return (
    <div>
      {token}
      {isVerified && <h1>Your user email is verified</h1>}
    </div>
  )
}
