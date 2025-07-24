import React from 'react'
import AdminNav from '../../components/Admin/AdminNav'
import { Users, User , LogOut } from 'lucide-react'

function AdminDashboard() {
  return (
    <div>
      <AdminNav/>
      <div className='flex flex-col items-center justify-center mt-10'>


        <div className='flex items-center justify-center gap-8 flex-wrap'>


          <div className='flex justify-between items-center w-75 md:w-100 md:h-25 text-center border-gray-300 border rounded-lg shadow-sm p-6'>
            <div className='font-semibold text-wrap'>
              <h2 className='text-lg md:text-xl text-gray-600'>Total Visitors Today </h2>
              <h2 className='text-2xl md:text-3xl font-bold text-blue-500 mt-1 text-left'>150</h2> 
            </div>
            <div className='flex items-center'>
              <Users size={40} className='text-blue-600'/>
            </div> 
          </div>

          <div className='flex justify-between items-center w-75 md:w-100 md:h-25 text-center border-gray-300 border rounded-lg shadow-sm p-6'>
            <div className='font-semibold text-wrap'>
              <h2 className='text-lg md:text-xl text-gray-600'>Currently In </h2>
              <h2 className='text-2xl md:text-3xl font-bold text-green-500 mt-1 text-left'>15</h2> 
            </div>
            <div className='flex items-center'>
              <User size={40} className='text-green-600'/>
            </div> 
          </div>

          <div className='flex justify-between items-center w-75 md:w-100 md:h-25 text-center border-gray-300 border rounded-lg shadow-sm p-6'>
            <div className='font-semibold text-wrap'>
              <h2 className='text-lg md:text-xl text-gray-600'>Total Checkout Today </h2>
              <h2 className='text-2xl md:text-3xl font-bold text-gray-600 mt-1 text-left'>150</h2> 
            </div>
            <div className='flex items-center'>
              <LogOut size={40} className='text-gray-600'/>
            </div> 
          </div>

        </div>

      </div>
    </div>
  )
}

export default AdminDashboard