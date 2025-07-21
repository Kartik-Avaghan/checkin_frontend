import React from 'react'
import { Routes , Route } from 'react-router'

import StaffLogin from '../pages/StaffLogin'
import StaffDashboard from '../pages/StaffDashboard'
import CheckinForm from '../pages/CheckinForm'
import Report from '../pages/Report'
import Auth from './Auth'

function CustomRouter() {
  return (
    <Routes>
      <Route path='/' element={<StaffLogin/>}/>


      {/* <Route element={<Auth/>}> */}
      <Route path='/dashboard' element={<StaffDashboard/>} />
      <Route path='/checkin' element={<CheckinForm/>}/>
      <Route path='/report' element={<Report/>}/>
      <Route path='/staff' element={<Auth/>}/>
        
      {/* </Route> */}
      
    </Routes>
  )
}

export default CustomRouter