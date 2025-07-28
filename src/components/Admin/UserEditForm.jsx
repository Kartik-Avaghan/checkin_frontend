import React from 'react'
import AdminNav from './AdminNav'

function UserEditForm() {

  
  return (

<div>
  <AdminNav />

  <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow mt-8">
    {/* Header */}
    <div className="flex flex-col items-center mb-6">
      <h2 className="text-2xl font-bold">Edit User</h2>
      <h3 className="text-xl text-gray-600">Update the user information</h3>
    </div>

    {/* Form */}
    <form className="flex flex-col gap-4">
      {/* Full Name */}
      <div className="flex flex-col">
        <label htmlFor="name" className="mb-1 text-gray-700 font-medium">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          placeholder="Enter full name"
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Mobile Number */}
      <div className="flex flex-col">
        <label htmlFor="mobile" className="mb-1 text-gray-700 font-medium">
          Mobile Number
        </label>
        <input
          type="tel"
          id="mobile"
          placeholder="Enter mobile number"
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Role */}
      <div className="flex flex-col">
        <label htmlFor="role" className="mb-1 text-gray-700 font-medium">
          Role
        </label>
        <select
          id="role"
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Staff">Staff</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          className="border border-gray-400 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
        >
          Update User
        </button>
      </div>
    </form>
  </div>
</div>




  
  )
}

export default UserEditForm