import { useState , useEffect } from 'react';
import {useToast} from '../../components/ToastProvider'
import { jwtDecode } from 'jwt-decode';

function EditUser({id , setEdit}) {

  const [formdata, setFormData] = useState({
    username : "",
    mobile: "",
    role: "staff",
  });

  const[superAdmin, setSuperAdmin] = useState(false);

  const {addToast} = useToast();

  useEffect(() => {

    if (!id) {
      addToast("Error Accessing User" , "error");
      setEdit(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
    })
    .then((res) => res.json())
    .then((data) => {
      setFormData({
        username: data.username,
        mobile: data.mobile,
        role: data.role
      }); 
    })
    .catch((err) => {
      console.error(err);
      addToast("Could not Edit User Details, Please try again" , "error")
      setEdit(false);
    });
  }, [id]);


  useEffect(() => {
    const token = jwtDecode(localStorage.getItem("token"))
    const role = token.role;
    if(role === "ROLE_SUPER_ADMIN"){
      setSuperAdmin(true);
    } else { setSuperAdmin(false) }
  },[])


  const handleUpdate = (e) => {
    e.preventDefault();

    fetch(`${import.meta.env.VITE_API_BASE_URL}/users/update/${id}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(formdata),
    })
    .then((response) => {
    if (!response.ok) {
        throw new Error("Response was not ok");
    }
    return response.json();
    })
    .then((data) => {
      addToast("User Details updated SuccessFully" , "success")
      setEdit(false)
    })
    .catch((error) => {
      console.log("Error updating user:", error);
      addToast("Error Updating User Details" , "error")
      setEdit(false);
    });
  };

  const handlechange = (e) => {
    const {name , value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name] : value
    }));
  }


  return (
    <div className='fixed z-50 top-0 left-0 w-full h-full'>
      <div className='flex justify-center items-center h-screen'>
        <div className="m-2 sm:m-2 p-6 w-75 md:w-100 lg:w-125 bg-white rounded-lg shadow mt-8 relative z-50">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl font-bold">Edit User</h2>
            <h3 className="text-xl text-gray-600">Update the user information</h3>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
            <div className="flex flex-col">
              <label htmlFor="username" className="mb-1 text-gray-700">
                User Name
              </label>
              <input
                type="text"
                id="username"
                name='username'
                value={formdata.username || ""}
                onChange={handlechange}
                placeholder="Enter full name"
                className="border border-gray-400 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="mobile" className="mb-1 text-gray-700">
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile"
                name='mobile'
                value={formdata.mobile || ""}
                onChange={handlechange}
                placeholder="Enter mobile number"
                className="border border-gray-400 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col ">
              <label htmlFor="role" className="mb-1 text-gray-700">
                Role
              </label>
              <select
                id="role"
                name='role'
                value={formdata.role || ""}
                onChange={handlechange}
                className="border border-gray-400 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
              >
                <option value="staff">Staff</option>
                {superAdmin && <option value="admin">Admin</option> }
              </select>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => setEdit(false)}
                className="border border-gray-400 text-gray-700 rounded-lg px-4 py-2 hover:bg-red-600 hover:text-white cursor-pointer font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-sky-800 border-2 border-sky-800 text-white rounded-lg px-4 py-2 hover:bg-white hover:text-sky-800 cursor-pointer font-semibold transition-all"
              >
                Update User
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className='w-[100vw] h-[100vh] bg-black/80 absolute top-0 z-1'
      onClick={() => setEdit(false)}></div>
    </div>
  )
}

export default EditUser