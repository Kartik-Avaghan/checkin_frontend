import React from 'react'
import { Routes , Route } from 'react-router'

import StaffLogin from '../pages/StaffLogin'
import StaffDashboard from '../pages/StaffDashboard'
import CheckinForm from '../pages/CheckinForm'

function CustomRouter() {
  return (
    <Routes>
        <Route path='/' element={<StaffLogin/>}></Route>
        <Route path='/dashboard' element={<StaffDashboard/>} />
        <Route path='/checkin' element={<CheckinForm/>}/>
    </Routes>
  )
}

export default CustomRouter