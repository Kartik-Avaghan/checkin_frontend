import React from 'react'
import { Routes , Route } from 'react-router'

import StaffLogin from '../pages/StaffLogin'
import StaffDashboard from '../pages/StaffDashboard'
import CheckinForm from '../pages/CheckinForm'
import Report from '../pages/Report'

function CustomRouter() {
  return (
    <Routes>
      <Route path='/' element={<StaffLogin/>}></Route>
      <Route path='/dashboard' element={<StaffDashboard/>} />
      <Route path='/checkin' element={<CheckinForm/>}/>
      <Route path='/report' element={<Report/>}/>

    </Routes>
  )
}

export default CustomRouter