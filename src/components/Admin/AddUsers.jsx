import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useToast } from "../ToastProvider";
import Loader from "../Loader";

function AddUsers() {
  const [users, setUsers] = useState({
    username: "",
    mobile: "",
    password:"",
    role: "staff",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsers((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    fetch("http://localhost:8080/users/add", {
      method: "POST",
      credentials: "include",
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
        setUsers({ username: "", mobile: "",password:"", role: "" });
        addToast("User added successfully!", "success");
      })
      .catch((error) => {
        console.error("Error in posting user:", error);
        addToast("Could not add user. Please try again.", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {isLoading && <Loader />}
      <div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Add Users</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Staff full name"
            name="username"
            value={users.username}
            onChange={handleChange}
            required
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="tel"
            placeholder="Mobile Number"
            name="mobile"
            value={users.mobile}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="password"
            name="password"
            value={users.password}
            onChange={handleChange}
            required
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            name="role"
            value={users.role}
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
