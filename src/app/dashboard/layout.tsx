"use client";

import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { motion, useAnimation } from "framer-motion";  
import { avatars } from '@/app/avatars';
import { checkWindowWidth } from "@/helpers/checkWindowWidth";
import {toast} from "react-hot-toast";
import { useRouter } from 'next/navigation';

export default function ProfileDefault({children}: {children: React.ReactNode}) {
    const [profile, setProfile] = useState(null)
    const [dropdown, setDropdown] = useState(false)
    const [sidebar, setSidebar] = useState(true)
    const [isSmall, setIsSmall] = useState(false)
    const router = useRouter()
    let windowWidth:number = checkWindowWidth()

    // Fetch profile user details
    const fetchProfile = async () => {
        const response = await axios.get("/api/users/me");
        setProfile(response.data);
        console.log(response.data);
    }
    useEffect(() => {
        fetchProfile()
    }, [])

    // Detect Mobile screen
    useEffect(() => {
        if (windowWidth < 500){
            setIsSmall(true)
            setSidebar(false)
        } else {
            setIsSmall(false)
            setSidebar(true)
        }
    }, [windowWidth])

    function toggleSidebar() {
        setSidebar(!sidebar)
    }

    // toggle dropdown
    function toggleDropdown(){
        setDropdown(!dropdown)
    }

    // Sidebar variant
    const sidebarVariant = {
        hidden: {
            x: "-100%"
        },
        visible: {
            x: 0,
            transition: {
                delay: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    }
    // Option variant
    const optionVariant = {
        hidden: {
            x: -10,
            opacity: 0
        },
        visible: {
            x: 0,
            opacity: 1,
        }
    }

    // Logout function
    const logout = async () => {
        try {
            await axios.get("/api/users/logout")
            toast.success("logged out")
            router.push('/login')
        } catch(error: any){
            console.error(error);
            toast.error(error.message)
        }
    }

    return (
        <section>
            <nav className='flex justify-between items-center px-3 lg:hidden bg-black border-b-[2px] border-gray-300 border-solid h-[70px]'>
                <span
                    className="text-white text-4xl left-4 cursor-pointer"
                    onClick={() => toggleSidebar()}
                >
                    <i className="bi bi-filter-left px-2 rounded-md"></i>
                </span>
                <div className="text-gray-100 text-xl">
                    <div className="p-2.5 flex items-center">
                        <div className='w-[40px] h-[40px] rounded-full bg-center bg-cover' style={{ backgroundImage: `url(${(avatars[2]).image})` }}></div>
                        <h1 className="font-poppins font-bold text-gray-200 text-[15px] ml-3">{(profile != null ) && profile['username']}</h1>
                        <div className=' relative'>
                            <i onClick={() => toggleDropdown()} className={(dropdown ? 'bi-chevron-up': 'bi-chevron-down') + ' bi cursor-pointer ml-3 text-[16px]'}></i>
                            {dropdown && 
                                <div
                                    className="absolute bottom-[-40px] right-0 text-left text-sm mt-2 mx-auto text-gray-200 font-bold"
                                >
                                    <h1 onClick={() => logout()} className="cursor-pointer p-2 bg-slate-500 hover:bg-emerald-600 rounded-md mt-1">
                                    Logout
                                    </h1>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </nav>
            {(sidebar && isSmall) && <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition:{delay: 0.5}}} className='fixed top-0 left-0 w-full h-full backdrop-blur-sm'></motion.div>}
            <motion.div
                variants={sidebarVariant}
                initial="hidden"
                animate={sidebar ? "visible": "hidden"}
                className="sidebar fixed top-0 bottom-0 lg:left-0 p-2 w-[300px] overflow-y-auto text-center bg-black"
            >
                <motion.div variants={optionVariant} className="text-gray-100 text-xl">
                    <div className="p-2.5 mt-1 flex items-center">
                    <i className="fa-solid fa-clipboard-list px-2 py-1 rounded-md bg-emerald-600"></i>
                    
                    <h1 className="font-bold text-gray-200 text-[15px] ml-3">Scheduleia</h1>
                    <i
                        className="bi bi-x cursor-pointer ml-28 lg:hidden"
                        onClick={() => toggleSidebar()}
                    ></i>
                    </div>
                    <div className="mb-4 mt-2 bg-gray-600 h-[1px]"></div>
                </motion.div>
                <motion.div variants={optionVariant}
                    className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-emerald-600 text-white"
                >
                    <i className="bi bi-house-door-fill"></i>
                    <span className="text-[15px] ml-4 text-gray-200 font-bold">Home</span>
                </motion.div>
                <motion.div variants={optionVariant}
                    className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-emerald-600 text-white"
                >
                    <i className="fa-solid fa-square-plus"></i>
                    <span className="text-[15px] ml-4 text-gray-200 font-bold">Add todo</span>
                </motion.div>
                <div className="my-4 bg-gray-600 h-[1px] hidden lg:block"></div>
                <motion.div variants={optionVariant} className="text-gray-100 text-xl hidden lg:block">
                    <div className="p-2.5 flex items-center">
                        <div className='w-[40px] h-[40px] rounded-full bg-center bg-cover' style={{ backgroundImage: `url(${(avatars[2]).image})` }}></div>
                        <h1 className="font-poppins font-bold text-gray-200 text-[15px] ml-3">{(profile != null ) && profile['username']}</h1>
                        <div className=' relative'>
                            <i onClick={() => toggleDropdown()} className={(dropdown ? 'bi-chevron-up': 'bi-chevron-down') + ' bi cursor-pointer ml-3 text-[16px]'}></i>
                            {dropdown && 
                                <div
                                    className="absolute bottom-[-40px] right-0 text-left text-sm mt-2 mx-auto text-gray-200 font-bold"
                                >
                                    <h1 className="cursor-pointer p-2 bg-slate-500 hover:bg-emerald-600 rounded-md mt-1">
                                    Logout
                                    </h1>
                                </div>
                            }
                        </div>
                    </div>
                    {/*<div className="my-2 bg-gray-600 h-[1px]"></div>*/}
                </motion.div>
            </motion.div> 

            <div className='lg:ml-[300px]'>
                { children }
            </div>
        </section>
    )
}
