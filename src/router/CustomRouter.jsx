import { Routes , Route } from 'react-router'

import StaffLogin from '../pages/StaffLogin'
import StaffDashboard from '../pages/StaffDashboard'
import Checkin from '../pages/Checkin'
import Report from '../pages/Report'
import Auth from './Auth'
import NotFound from '../pages/NotFound'
import Dashboard from '../pages/Admin/Dashboard'

function CustomRouter() {
  return (
    <Routes>
      <Route path='/login' element={<StaffLogin/>}/>

      <Route path='/' element={<Auth/>}>
        <Route path='/' element={<StaffDashboard/>} />
        <Route path='checkin' element={<Checkin/>}/>
        <Route path='report' element={<Report/>}/>
      </Route>

      <Route path='*' element={<NotFound/>} />
      <Route path='/dashboard' element={<Dashboard/>}/>
      
    </Routes>
  )
}

export default CustomRouter