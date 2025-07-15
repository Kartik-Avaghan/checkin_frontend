import React from 'react'
import { Routes , Route } from 'react-router'

import StaffLogin from '../pages/StaffLogin'
import StaffDashboard from '../pages/StaffDashboard'

function CustomRouter() {
  return (
    <Routes>
        <Route path='/' element={<StaffLogin/>}></Route>
        <Route path='/dashboard' element={<StaffDashboard/>} />
    </Routes>
  )
}

export default CustomRouter