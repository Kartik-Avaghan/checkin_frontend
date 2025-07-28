import { Routes , Route } from 'react-router'

import Login from '../pages/Login'
import StaffDashboard from '../pages/Staff/StaffDashboard'
import Checkin from '../pages/Checkin'
import CheckedInVisitors from '../pages/Staff/CheckedInVisitors'
import Report from '../pages/Report'


import Auth from './auth/Auth'
import NotFound from '../pages/NotFound'
import Dashboard from '../pages/Admin/AdminDashboard'

import AdminAuth from './auth/AdminAuth'
import AdminDashboard from '../pages/Admin/AdminDashboard'
import ManageUsers from '../pages/Admin/ManageUsers'
import AddForm from '../pages/Admin/AddForm'

function CustomRouter() {
  return (
    <Routes>
      <Route path='/login' element={<Login/>}/>

      <Route path='/' element={<Auth/>}>
        <Route path='/' element={<StaffDashboard/>} />
        <Route path='checkin' element={<Checkin/>}/>
        <Route path='report' element={<Report/>}/>
        <Route path='checkout' element={<CheckedInVisitors/>}/>

      </Route>

      <Route path='/admin' element={<AdminAuth/>}>
        <Route path='dashboard' element={ <AdminDashboard/>} />
        <Route path='checkin' element={<Checkin/>}/>
        <Route path='report' element={<Report/>}/>
        <Route path='users' element={<ManageUsers/>} />
        <Route path='/add' element={<AddForm/>} />
      </Route>

      <Route path='*' element={<NotFound/>} />

      
      
    </Routes>
  )
}

export default CustomRouter