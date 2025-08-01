import { useState , useEffect } from 'react';
import {useToast} from '../../components/ToastProvider'

function EditUser({staffid , setEdit}) {

  const [formdata, setFormData] = useState({
    username : "",
    mobile: "",
    role: "",
  });

  const {addToast} = useToast();

  useEffect(() => {
    if (!staffid) {
      setEdit(false);
      return;
    }

    fetch(`http://localhost:8080/users/${staffid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
    })
    .then((res) => res.json())
    .then((data) => setFormData({
      username: data.username,
      mobile: data.mobile,
      role: data.role
    }))
    .catch((err) => {
      console.error(err);
      setEdit(false); // Optional: close on error
    });
  }, [staffid]);


  const handleUpdate = (e) => {
    e.preventDefault();

    fetch(`http://localhost:8080/users/update/${staffid}`, {
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
      addToast("User Details updated" , "success")
      setEdit(false)
    })
    .catch((error) => {
    console.log("Error updating user:", error);
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
    <div className='absolute z-50 top-0 left-0 w-full'>
      <div className='flex justify-center items-center h-screen'>
      <div className="m-8 sm:m-2 p-6 w-75 md:w-100 lg:w-125 bg-white rounded-lg shadow mt-8 relative z-50">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold">Edit User</h2>
          <h3 className="text-xl text-gray-600">Update the user information</h3>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
          <div className="flex flex-col">
            <label htmlFor="username" className="mb-1 text-gray-700 font-medium">
              User Name
            </label>
            <input
              type="text"
              id="username"
              name='username'
              value={formdata.username || ""}
              onChange={handlechange}
              placeholder="Enter full name"
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="mobile" className="mb-1 text-gray-700 font-medium">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              name='mobile'
              value={formdata.mobile || ""}
              onChange={handlechange}
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
              name='role'
              value={formdata.role || ""}
              onChange={handlechange}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => setEdit(false)}
              className="border border-gray-400 text-gray-700 rounded-lg px-4 py-2 hover:bg-red-600 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-sky-800 border-2 border-sky-800 text-white rounded-lg px-4 py-2 hover:bg-white hover:text-sky-800 cursor-pointer"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
    <div className='w-[100vw] h-[100vh] bg-black/80 absolute top-0 z-1' onClick={() => setEdit(false)}></div>
    </div>
  )
}

export default EditUser