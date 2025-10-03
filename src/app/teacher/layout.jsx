"use client"

import Sidebar from '@/components/teacher_compo/Sidebar'
import React from 'react'

function layout({children}) {
  return (
    <div className='flex '>
        <Sidebar/>
        <div className=" flex w-full ">
        {children}
        </div>
    </div>
  )
}

export default layout