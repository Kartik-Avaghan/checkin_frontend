import React, { useState } from 'react';
import { Menu, LogOut, X } from 'lucide-react';
import { Link } from 'react-router';

function StaffNav() {
  const [toggle, setToggle] = useState(false);

  function handlelogout(){

  }

  return (
    <div className="relative">
  
      <div className="z-50 p-4 bg-sky-700  cursor-pointer">
        <Menu className="text-white" onClick={() => setToggle(!toggle)}/>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-sky-800 text-white shadow-lg transform transition-transform duration-300 ease-in-out ${toggle ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col p-6 space-y-4 text-lg font-medium">
          <button onClick={() => setToggle(false)}><X className="text-white cursor-pointer" /></button>

          <Link to={"/dashboard"}>
          <button className="hover:bg-sky-700 px-4 py-2 rounded-md transition w-full cursor-pointer">Home</button> </Link>
          <button className="hover:bg-sky-700 px-4 py-2 rounded-md transition w-full cursor-pointer">Reports</button>
          <button className="hover:bg-sky-700 px-4 py-2 rounded-md transition w-full cursor-pointer">Visitors List</button>

          <button className="mt-auto flex items-center justify-center gap-2 bg-gray-900 hover:bg-white px-4 py-2 rounded-full transition cursor-pointer  hover:text-black"
            onClick={() => {handlelogout()}}
          >
            Log Out <LogOut size={18} />
          </button>

        </div>
      </div>

    </div>
  );
}

export default StaffNav;
