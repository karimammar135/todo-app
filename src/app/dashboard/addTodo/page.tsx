"use client";

import React, { useState } from 'react'

import toast from 'react-hot-toast'
import axios from 'axios'

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
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Add todo page",
    description: "Add as much todos as you want.",
};
 
const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters.",}),
  content: z.string().min(10, {message: "Task's content must at least be of 10 characters",}),
})

export default function AddTodo() {
    const [newTodo, setNewTodo] = useState({
        title: "",
        content: ""
    })

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: "",
        },
    })
 
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        try{
            const response = await axios.post("/api/todos/add", values)
            console.log(response.data) 
            toast.success(response.data.message)
            form.reset({title: "", content: "",})
        } catch(error: any){
            console.error(error);
            toast.error(error.message)
        }
    }

    return (
        <section className='flex justify-center'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mx-4 my-4 flex-grow space-y-4">
                    <h1 className="font-bold">Add New Todo</h1>
                    <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Task title</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea placeholder="Add content that supports your task" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <Button type="submit">Add</Button>
                </form>
            </Form>
        </section>
    )
}
