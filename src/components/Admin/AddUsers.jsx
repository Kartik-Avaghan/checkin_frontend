import React, { useState } from 'react';

function AddUsers() {
  const [users, setUsers] = useState({
    name: "",
    mobile: "",
    role: "admin" // set default role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsers((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/users/add', {
      method: "POST",
      credentials:'include',
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({...users}),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("User added successfully:", data);
      // reset form
      setUsers({ name: "", mobile: "", role: "admin" });
    })
    .catch((error) => {
      console.log("Error in posting user:", error);
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Add Users</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Staff full name"
            name="name"
            defaultValue={users.name}
            onChange={handleChange}
            required
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            placeholder="Mobile Number"
            name="mobile"
            defaultValue={users.mobile}
            onChange={handleChange}
            required
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            name="role"
            defaultValue={users.role}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>

          <button
            type="submit"
            className="bg-sky-800 border-2 border-sky-800 text-white py-2 rounded-lg hover:bg-white hover:text-sky-800 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddUsers;
