import React from 'react'
import AdminNav from '../../components/Admin/AdminNav'
import Manageuser from '../../components/Admin/Manageuser'
import UserEditForm from '../../components/Admin/UserEditForm'

function Dashboard() {
  return (
    <div>
        
        <AdminNav/>
        <Manageuser/>
        
    </div>
  )
}

export default Dashboard