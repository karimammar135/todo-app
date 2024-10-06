import React from 'react'
import { HashLoader } from 'react-spinners'

export default function Loader() {
  return (
    <div className='absolute top-0 left-0 z-10 h-full w-full backdrop-blur-[10px] flex flex-col gap-4 justify-center items-center'>
      <HashLoader color="#059669"></HashLoader>
      <span className='text-emerald-600 font-poppins'>Loading.....</span>
    </div>
  )
}
