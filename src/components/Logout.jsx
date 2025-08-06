import { useNavigate } from 'react-router';
import { TriangleAlert , LogOut} from "lucide-react";
import {useToast} from '../components/ToastProvider'
import { jwtDecode } from 'jwt-decode';
import { useState , useEffect } from 'react';

function Logout({setLogOut}) {

    const [username , setusername] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        let token = localStorage.getItem("token");
        if(token){
            let tokendata = jwtDecode(token)
            setusername(tokendata.sub)
        } else{
            localStorage.removeItem("token");
            navigate("/login")
        }
    },[])

    function handlelogout(){

        fetch(`${import.meta.env.VITE_API_BASE_URL}/users/update/logout/${username}`, {
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
    <div>
      <div className="fixed inset-0 z-10 w-screen left-0 bg-black/80">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg ">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10 text-red-800">
                  <LogOut size={16} />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-base font-semibold text-gray-900">
                    Logout
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to Logout
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={() => handlelogout()}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto cursor-pointer"
              >
                Logout
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() =>setLogOut(false) }
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='w-screen h-full absolute top-0 left-0 z-1 cursor-pointer overflow-hidden'
      onClick={() => setDelete(false)}></div>
    </div>
  )
}

export default Logout