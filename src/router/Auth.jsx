import React, { useState } from 'react'
import { Navigate, Outlet } from 'react-router'
import { useEffect } from 'react'

function Auth() {
    const [staff , setIsStaff] = useState(false)

    useEffect(() => {
        
    },[staff])

  return (
    <div>
        { staff ? <Outlet/>  : <Navigate to={"/"} />}
    </div>
  )
}

export default Auth