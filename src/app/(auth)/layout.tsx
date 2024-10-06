"use client";

import React, { useState, useEffect, useMemo } from 'react'

import { BackgroundBeams } from "@/components/ui/background-beams";
import { Cover } from '@/components/ui/cover';
import { CardStack } from "@/components/ui/card-stack";
import { cn } from "@/lib/utils";

export default function AuthLayout({children}: {children: React.ReactNode}) {
  const [smallScreen, setSmallScreen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
 
  // Keep track of window's width
  useEffect(() => {
    if (window.innerWidth < 810){
      setSmallScreen(true)
    } else {
      setSmallScreen(false)
    }
  }, [])
  useEffect(() => {
    const handleResize = debounce(():void => {
      if (window.innerWidth < 810){
        setSmallScreen(true)
      } else {
        setSmallScreen(false)
      }
    }, 500)
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Debounce helper function
  const debounce = <T extends (...args: any[]) => any>(
    callback: T,
    waitFor: number
  ) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>): ReturnType<T> => {
      let result: any;
      timeout && clearTimeout(timeout);
      timeout = setTimeout(() => {
        result = callback(...args);
      }, waitFor);
      return result;
    };
  };
  
  // Html action
  return (
    <div className="bg-black grid grid-cols-1 1xl:grid-cols-2 gap-6 min-h-[100vh] 1xl:pr-10 pb-10 1xl:pb-0">
        <div className='flex justify-center items-center order-2 1xl:order-1'>
            {!smallScreen && <div className="z-10 w-[100%] max-w-[550px] 1xl:max-w-[400px] 2xl:max-w-[550px] ml-4 mr-4 1xl:mr-0 1xl:ml-6 1xl:mt-4 1xl:mb-4 rounded-3xl bg-white flex flex-col justify-center items-center gap-5 1xl:gap-5 p-8 sm:p-10">
                {children}
            </div> ||
            <button onClick={() => setShowPopup(true)} className='z-10 p-[16px] bg-emerald-400 hover:bg-emerald-600 text-white font-poppins rounded-2xl'>Get Started <i className="fa-solid fa-arrow-right-to-bracket"></i></button>
            }
        </div>
        <div className='flex flex-col gap-6 justify-center items-center order-1 1xl:order-2'>
            <h1 className="text-4xl md:text-4xl lg:text-5xl leading-loose font-poppins font-semibold max-w-7xl mx-auto text-center mt-6 ml-4 mr-4 1xl:ml-0 1xl:mr-0 relative py-6 bg-clip-text text-white">
              Schedule your day with <span className='z-0'><Cover className='z-0'>Scheduleia</Cover></span>
            </h1>
            <CardStack items={CARDS} />
        </div>
        {showPopup && 
          <div className='fixed top-0 left-0 z-10 h-full w-full backdrop-blur-[10px] flex justify-center items-center'>
            <div className="relative w-[100%] max-w-[550px] ml-4 mr-4 rounded-3xl bg-white flex flex-col justify-center items-center gap-5 p-8 sm:p-10">
              <i onClick={() => setShowPopup(false)} className="fa-regular fa-circle-xmark absolute right-5 top-5 text-black text-3xl"></i>
              {children}
            </div>
          </div>
        }
        <BackgroundBeams />
    </div>
  )
}

// Small utility to highlight the content of specific section of a testimonial content
export const Highlight = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    return (
      <span
        className={cn(
          "font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500 px-1 py-0.5",
          className
        )}
      >
        {children}
      </span>
    );
  };
   
const CARDS = [
    {
      id: 0,
      name: "Brian",
      designation: "School student",
      content: (
        <p>
          Dont Forget to do the homework today before the teacher puts me out of the class 🙏
        </p>
      ),
    },
    {
      id: 1,
      name: "Sara",
      designation: "Software engineer",
      content: (
        <p>
          I have a meeting with the software company at,
          <Highlight>3:15 a.m</Highlight> 
        </p>
      ),
    },
    {
      id: 2,
      name: "Tyler Durden",
      designation: "Manager",
      content: (
        <p>
          Move the container to
          <Highlight>Tyre</Highlight> in order to distribute it to the markets
        </p>
      ),
    },
];