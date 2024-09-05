
import React from 'react'

export default function ProfilePage({ params }: any) {
  return (
    <div className='bg-black min-h-[100vh]'>
      <h1 className='text-white'>Profile {params.id}</h1>
    </div>
  )
}
