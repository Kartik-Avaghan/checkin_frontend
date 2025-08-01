import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useToast } from "../ToastProvider";
import Loader from "../Loader";
import { X } from "lucide-react";

function AddUsers({ setAddUser }) {
  const [users, setUsers] = useState({
    username: "",
    mobile: "",
    password: "",
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
      body: JSON.stringify({ ...users }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setUsers({ username: "", mobile: "", password: "", role: "" });
        addToast("User added successfully!", "success");
        setAddUser(false)
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
    <div className="fixed z-50 top-0 left-0 w-full">
      <X size={30} className="absolute z-2 text-white right-5 top-4 md:right-50 md:top-10 cursor-pointer" onClick={() => setAddUser(false)}/>
      <div className="flex justify-center items-center min-h-screen">
        {isLoading && <Loader />}
        <div className="flex m-6 z-10  flex-col gap-4 p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-4">Add Users</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter Username"
              name="username"
              value={users.username}
              onChange={handleChange}
              required
              className="border border-gray-400 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="tel"
              placeholder="Enter Mobile Number"
              name="mobile"
              value={users.mobile}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              className="border border-gray-400 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="password"
              placeholder="Enter password"
              name="password"
              value={users.password}
              onChange={handleChange}
              required
              className="border border-gray-400 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />


            <div className="flex flex-col gap-2">
            <label htmlFor="role" className="mt-1 mb-0 pb-0">Choose Role</label>
            <select
              name="role"
              value={users.role}
              onChange={handleChange}
              className="border border-gray-400 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>

            </div>

            <button
              type="submit"
              className="bg-sky-800 border-2 border-sky-800 text-white font-semibold py-3 rounded-lg hover:bg-white hover:text-sky-800 transition cursor-pointer"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <div
        className="w-[100vw] h-[100vh] bg-black/80 fixed top-0 z-1 cursor-pointer"
        onClick={() => setAddUser(false)}
      ></div>
    </div>
  );
}

export default AddUsers;
