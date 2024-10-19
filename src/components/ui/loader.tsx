"use client";

import React from 'react'
import { HashLoader } from 'react-spinners'

export default function Loader() {
  return (
    <div className='z-50 fixed top-0 left-0 h-full w-full backdrop-blur-[10px] flex flex-col gap-4 justify-center items-center'>
      <HashLoader color="#059669"></HashLoader>
      <span className='text-emerald-600 font-poppins'>Loading.....</span>
    </div>
  )
}
