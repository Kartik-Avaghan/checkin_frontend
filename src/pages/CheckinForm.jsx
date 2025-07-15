import React, { useState } from 'react'
import StaffNav from '../components/Staff/StaffNav'
import { UserPlus, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';

function CheckinForm() {

    let [name , setname] = useState()
    let [mobile , setmobile] = useState()
    let [visitng , setvisiting] = useState()
    let [purpose , setpurpose] = useState()

    let navigate = useNavigate();

    function handleCheckin(){
        navigate('/dashboard')
    }
  return (
    <div>
        <StaffNav/>
        <div>
             <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
                    <UserPlus className="text-blue-600" />
                    Visitor Check-in
                </h2>

                <form className="space-y-6">
                    {/* Visitor Name & Mobile */}
                 
                    <div className="">
                        <label className="block font-medium text-gray-700 mb-1">Visitor Name *</label>
                        <input
                        type="text"
                        placeholder="Enter visitor's full name"
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        onChange={(e) => setname(e.target.value)}
                        />
                    </div>
                  
                    <div className="">
                        <label className="block font-medium text-gray-700 mb-1">Mobile Number *</label>
                        <input
                        type="tel"
                        placeholder="Enter mobile number"
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        onChange={(e) => setmobile(e.target.value)}
                        />
                    </div>

                    {/* Visiting Person */}
                    <div>
                    <label className="block font-medium text-gray-700 mb-1">Visiting Person *</label>
                    <select className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" required 
                    onChange={(e) => setvisiting(e.target.value)}>
                        <option>Select the person to visit</option>
                        

                    </select>
                    </div>

                    {/* Purpose of Visit */}
                    <div>
                    <label className="block font-medium text-gray-700 mb-1"> Purpose of Vist *</label>
                    <select className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" required
                    onChange={(e) => setpurpose(e.target.value)}>
                        <option>Select the purpose to visit</option>
                        

                    </select>
                    </div>


                    {/* Submit Button */}
                    <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition text-md" 
                    onClick={() => handleCheckin()}>
                        <UserPlus size={18} /> Check In Visitor
                    </button>
                </form>
                </div>
        </div>
    </div>
  )
}

export default CheckinForm