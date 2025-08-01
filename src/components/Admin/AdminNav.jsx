import React from "react";
import { useState } from "react";
import { Menu, LogOut, X, Home, FileText, Plus, Users , Power } from "lucide-react";
import { Link, useNavigate } from "react-router";

function AdminNav() {
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();

  function handlelogout() {
    fetch(`http://localhost:8080/users/update/logout/${username}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
    })
    .then((res) => res.json)
    .then((data) => {
      localStorage.removeItem("token");
      navigate('/login')
    })
    .catch((err) => console.log(err))
  }

  return (
    <div className="relative">
      <div className="z-50 p-4 bg-sky-700 flex justify-between">
        <Menu className="text-white hover:cursor-pointer" onClick={() => setToggle(!toggle)} />
        <Power className="text-white cursor-pointer" onClick={() => handlelogout()}/>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed z-99 top-0 left-0 h-full w-64 bg-sky-800 text-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          toggle ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col p-6 space-y-4 text-lg font-medium ">
          <button onClick={() => setToggle(false)} className="mb-6">
            <X className="text-white cursor-pointer" />
          </button>

          <Link
            to={"/admin/dashboard"}
            className="flex items-center gap-2 hover:bg-sky-700 px-4 py-2 rounded-md transition w-full cursor-pointer">
            <Home className="text-white" size={24} />
            <button className="hover:cursor-pointer">Home</button>
          </Link>

          <Link to={"/admin/report"} className="flex items-center gap-2 hover:bg-sky-700 px-4 py-2 rounded-md transition w-full cursor-pointer">
            <FileText className="text-white" size={24} />
            <button  className="hover:cursor-pointer"> Reports </button>
          </Link>
          <Link to={"/admin/users"} className="flex items-center gap-2 hover:bg-sky-700 px-4 py-2 rounded-md transition w-full cursor-pointer">
            <Users className="text-white" size={24} />
            <button className="hover:cursor-pointer"> Manage Users </button>
          </Link>
          <Link to={"/admin/checkin"} className="flex items-center gap-2 hover:bg-sky-700 px-4 py-2 rounded-md transition w-full cursor-pointer">
            <Plus className="text-white" size={24} />
            <button className="hover:cursor-pointer"> Checkin </button>
          </Link>

          <button
            className="mt-auto flex items-center justify-center gap-2 bg-gray-900 hover:bg-white px-4 py-2 rounded-full transition cursor-pointer  hover:text-black"
            onClick={() => {
              handlelogout();
            }}
          >
            Log Out <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminNav;
