import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { SquarePen, Trash2, Search } from "lucide-react";

function Manageuser() {
  const [staff, setStaff] = useState([]);
  const [updateStaff, setUpdateStaff] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetch(`https://localhost:8080/users/`, {
      method: "GET",
      credentials:'include',
      headers: {
        "Content-Type": "application/json",
         Authorization: `${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Response was not ok");
        }
        return response.json();
      })
      .then((data) => setStaff(data))
      .catch((error) => {
        console.log("Fetching Error", error);
      });
  }, []);

  // const handleupdate=(id)=>{
  //   fetch('{$id}'),{
  //     mathod:"POST",
      

  //     }
  //   }

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // Update logic here (API call or state update)
    setEditingUser(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {editingUser === null ? (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">User Management</h2>
              <h3 className="text-sm text-gray-600">
                Manage staff and admin users
              </h3>
            </div>
            <Link to="/checkin">
              <button className="border-2 border-sky-800 bg-sky-800 text-white font-semibold rounded-xl px-4 py-2 hover:bg-white hover:text-sky-800 transition">
                Add Users
              </button>
            </Link>
          </div>

          {/* Filters */}
          <div className="flex justify-center items-center">
            <div className="p-4 rounded-lg  w-full">
              <h2 className="text-lg font-semibold mb-3">Filters</h2>

              <div className="flex justify-between items-center gap-3">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="search"
                    placeholder="Search by name or mobile"
                    className="border rounded-lg pl-10 pr-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <select className="border p-2 rounded-xl m-1">
                  <option value="All Roles">All Roles</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className=" rounded-lg  p-4 mt-4">
            <h1 className="text-2xl font-bold mb-1">Users</h1>
            <h3 className="text-gray-600 mb-4">
              Message your organization's staff and admin users
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Mobile
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {staff.map((s) => (
                    <tr key={s.id} className="border-t border-gray-300">
                      <td className="px-6 py-3">{s.name}</td>
                      <td className="px-6 py-3">{s.mobile}</td>
                      <td className="px-6 py-3">{s.role}</td>
                      <td className="px-6 py-3">
                        <button
                          className="hover:border-sky-800 hover:text-white hover:bg-sky-800 border-2 border-sky-800 p-2 rounded-lg mr-2"
                          onClick={() => handleEdit(s)}
                        >
                          <SquarePen className="w-4 h-4" />
                        </button>
                        <button className="hover:border-sky-800 hover:text-white hover:bg-sky-800 border-2 border-sky-800 p-2 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        // Edit Form
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow mt-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl font-bold">Edit User</h2>
            <h3 className="text-xl text-gray-600">
              Update the user information
            </h3>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-1 text-gray-700 font-medium">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
                placeholder="Enter full name"
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="mobile"
                className="mb-1 text-gray-700 font-medium"
              >
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile"
                value={editingUser.mobile}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, mobile: e.target.value })
                }
                placeholder="Enter mobile number"
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="role" className="mb-1 text-gray-700 font-medium">
                Role
              </label>
              <select
                id="role"
                value={editingUser.role}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, role: e.target.value })
                }
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
              </select>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="border border-gray-400 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-sky-800  border-2 border-sky-800 text-white rounded-lg px-4 py-2 hover:bg-white hover:text-sky-800 "
              >
                Update User
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Manageuser;

// import React, { useState } from 'react'
// import { Link } from 'react-router'
// import { SquarePen } from 'lucide-react';
// import { Trash2 } from 'lucide-react';
// import { Search } from 'lucide-react';

// function Manageuser() {

// const[editingUser,setEditingUser]=useState(null);

// const handleEdit=(user)=>{
//   setEditingUser(user);
// }

//   return (
//    <div className='max-w-5xl mx-auto p-4'>
//   {/* Header */}
//   <div className="flex justify-between items-center mb-6">
//     <div className="flex flex-col">
//       <h2 className="text-2xl font-bold">User Management</h2>
//       <h3 className="text-sm text-gray-600">Manage staff and admin users</h3>
//     </div>
//     <Link to={"/checkin"}>
//     <button className="border-2 border-sky-800 bg-sky-800 text-white font-semibold rounded-xl px-4 py-2 hover:bg-white hover:text-sky-800 transition">
//       Add Users
//     </button>
//     </Link>
//   </div>

// {/* filter */}
//   <div className='flex justify-center items-center'>
//   <div className=" p-4 rounded-lg shadow-sm w-full">
//     <h2 className="text-lg font-semibold mb-3">Filters</h2>

//     <div className="flex justify-between items-center gap-3">
//       <div className="relative w-80">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//         <input
//           type="search"
//           placeholder="Search by name or mobile"
//           className="border rounded-lg pl-10 pr-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>

//       <select className="border p-2 rounded-xl m-1">
//         <option value="All Roles">All Roles</option>
//       </select>
//     </div>
//   </div>
// </div>

//   <div className="bg-gray-50 rounded-lg shadow-sm p-4 mt-4">
//   <h1 className="text-2xl font-bold mb-1">Users</h1>
//   <h3 className="text-gray-600 mb-4">Message your organization's staff and admin users</h3>

//   <div className="overflow-x-auto">
//     <table className="min-w-full table-auto border-collapse">
//       <thead className="bg-gray-100">
//         <tr>
//           <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
//           <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mobile</th>
//           <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
//           <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr className="border-t">
//           <td className="px-6 py-3">John Doe</td>
//           <td className='px-6 py-3'>5879642215</td>
//           <td className="px-6 py-3">Admin</td>
//           <td className="px-6 py-3 ">
//             <button className=" hover:border-sky-800 hover:text-white hover:bg-sky-800 border-2  border-sky-800 p-2 rounded-lg mr-2" onClick={() => handleEdit({ name: "John Doe", mobile: "5879642215", role: "Admin" })}><SquarePen className='w-4 h-4 '  /></button>
//             <button className=" hover:border-sky-800 hover:text-white hover:bg-sky-800 border-2  border-sky-800 p-2 rounded-lg"> <Trash2  className='w-4 h-4 '/></button>
//           </td>
//         </tr>

//       </tbody>
//     </table>
//   </div>
// </div>

// </div>

//   )
// }

// export default Manageuser
