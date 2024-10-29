"use client"
 
import React, {useState, useEffect} from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from 'axios'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/loader'
import Link from 'next/link'

// Form schema
const formSchema = z.object({
    email: z.string().min(6, {message: "Email must be at least 6 characters"}),
    newPassword: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters.")
})

// Reset password component
export default function ResetPassword() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [optValue, setOptValue] = useState<string>("")
    const [disabled, setDisabled] = useState<boolean>(false)
    const [showOtpForm, setShowOtpForm] = useState(false)
    const [formValues, setFormValues] = useState<z.infer<typeof formSchema>>()
    const [error, setError] = useState<boolean>(false)

    // Check when all fields are filled then verify the user
    useEffect(() => {
        if (optValue.length === 6) {
            console.log(Number(optValue))
            setDisabled(true)
            verifyUserEmail(); 
        }
    }, [optValue])

    // Verify the user
    const verifyUserEmail = async () => {
        try{
            const response = await axios.post("/api/users/resetPassword", {email: formValues!.email, newPassword: formValues!.newPassword, confirmPassword: formValues!.confirmPassword, action: "updatePassword", optValue: optValue})
            toast.success(response.data.message)
            router.push("/dashboard/home")
        } catch(e: any){
            setDisabled(false)
            toast.error(e.response.data.error)
            setError(true)
        }
    }

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    })
    
    // 2. Define a submit handler.
    async function sendOTP(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        try{
            setLoading(true)
            setFormValues(values)
            const response = await axios.post("/api/users/resetPassword", {email: values.email, newPassword: values.newPassword, confirmPassword: values.confirmPassword, action: "sendOtp"})
            setLoading(false)
            toast.success(response.data.message)
            setShowOtpForm(true)
        } catch(e: any){
            setLoading(false)
            toast.error(e.response.data.error)
        }
    }
   
    return (
        <>
            {loading && <Loader />}
            {!showOtpForm && 
            <>  
            <Link href="/login" className='absolute left-5 top-5'><i className="fa-solid fa-circle-arrow-left text-black text-3xl cursor-pointer"></i></Link> 
            <Form {...form}>
                <form onSubmit={form.handleSubmit(sendOTP)} className="flex flex-col justify-center items-center w-[100%] gap-4 mt-8">
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormControl>
                                <Input placeholder="Email" {...field} 
                                className="h-[52px] font-poppins bg-[#F1FFF6] text-[#626262] placeholder:text-[#626262] p-3 border-solid border-2 border-emerald-600 rounded-sm outline-emerald-900"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormControl>
                                <Input placeholder="New Password" {...field} 
                                className="h-[52px] font-poppins bg-[#F1FFF6] text-[#626262] placeholder:text-[#626262] p-3 border-solid border-2 border-emerald-600 rounded-sm outline-emerald-900"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormControl>
                                <Input placeholder="Confirm Password" {...field} 
                                className="h-[52px] font-poppins bg-[#F1FFF6] text-[#626262] placeholder:text-[#626262] p-3 border-solid border-2 border-emerald-600 rounded-sm outline-emerald-900"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="w-full h-[50px] font-poppins bg-emerald-700 text-white font-bold py-2 px-4 rounded-sm">Reset password</Button>
                </form>
            </Form></>}
            {showOtpForm &&
                <div className="space-y-2 z-10 my-3">
                    <InputOTP
                        maxLength={6}
                        value={optValue}
                        onChange={(optValue) => setOptValue(optValue)}
                        className={disabled ? "opacity-50" : ""}
                    >
                        <InputOTPGroup>
                        <InputOTPSlot index={0}/>
                        <InputOTPSlot index={1}/>
                        <InputOTPSlot index={2}/>
                        <InputOTPSlot index={3}/>
                        <InputOTPSlot index={4}/>
                        <InputOTPSlot index={5}/>
                        </InputOTPGroup>
                    </InputOTP>
                    <div className={(error ? "text-red-600": "") + " text-center text-sm"}>
                        {optValue === "" ? (
                        <>Enter your one-time password.</>
                        ) : (
                        <>You entered: {optValue}</>
                        )}
                    </div>
                </div>
            }
        </>
    ) 
}
