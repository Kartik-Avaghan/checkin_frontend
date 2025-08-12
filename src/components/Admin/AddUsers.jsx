import { useEffect, useState } from "react";
import { useToast } from "../ToastProvider";
import Loader from "../Loader";
import { X } from "lucide-react";
import { jwtDecode } from "jwt-decode";

function AddUsers({ setAddUser }) {

  const [users, setUsers] = useState({
    username: "",
    mobile: "",
    password: "",
    role: "staff",
  });

  const[ pass , setPass] = useState("");
  const[ repass , setRePass] = useState(""); 
  const [repasserror , setrePassError] = useState(false)

  const [isLoading, setIsLoading] = useState(false);
  const [superAdmin , setSuperAdmin] = useState(false)

  const { addToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsers((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    if(pass === repass){
      setUsers((prev) => ({
        ...prev,
        password: repass,
      }))
      setrePassError(false)
    } else {
      setrePassError(true)
    }
  },[repass])


  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    let handled = false;

    fetch(`${import.meta.env.VITE_API_BASE_URL}/users/add`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ ...users }),
    })
    .then(async (response) => {
      if (!response.ok) {
        const message = response.text();
        addToast(message , "error");
        handled = true
        throw new Error("Response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      addToast("User added successfully!", "success");
      setUsers({ username: "", mobile: "", password: "", role: "" });
      setAddUser(false)
    })
    .catch((error) => {
      if(!handled){
      console.error("Error in posting user:", error);
      addToast("Could not add user. Please try again.", "error");
      }
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    const token = jwtDecode(localStorage.getItem("token"))
    const role = token.role;
    if(role === "ROLE_SUPER_ADMIN"){
      setSuperAdmin(true);
    } else { setSuperAdmin(false) }
  },[])

  return (
    <div className="fixed z-50 top-0 left-0 w-full">
      <X size={30} className="absolute z-99 sm:text-white right-10 top-8 md:right-25 md:top-10 cursor-pointer" onClick={() => setAddUser(false)}/>
      <div className="flex justify-center items-center min-h-screen">
        {isLoading && <Loader />}
        <div className="flex m-6 z-10  flex-col gap-4 p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-4">Add Users</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
            <label htmlFor="role" className="mt-1 mb-0 pb-0">User Name</label>
            <input
              type="text"
              placeholder="Enter Username"
              name="username"
              value={users.username}
              onChange={handleChange}
              required
              className="border border-gray-400 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            /> </div>

            <div className="flex flex-col gap-2">
            <label htmlFor="role" className="mt-1 mb-0 pb-0">Mobile Number</label>
            <input
              type="tel"
              placeholder="Enter Mobile No."
              name="mobile"
              value={users.mobile}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              className="border border-gray-400 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            /> </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="role" className="mt-1 mb-0 pb-0">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                name="password"
                defaultValue={users.password}
                onChange={(e) => setPass(e.target.value) }
                required
                className="border border-gray-400 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              /> 
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="role" className="mt-1 mb-0 pb-0">Re-Enter Password</label>
              <input
                type="password"
                placeholder="Enter password"
                name="password"
                defaultValue={users.password}
                onChange={(e) => setRePass(e.target.value)}
                required
                className={`border ${repasserror ? "border-red-500" : "border-gray-400"}  rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
              {repasserror && <span className="text-red-600"> Passwords Does not Match</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="role" className="mt-1 mb-0 pb-0">Choose Role</label>
              <select
                name="role"
                value={users.role}
                onChange={handleChange}
                className="border border-gray-400 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="staff">Staff</option>
                {superAdmin && <option value="admin">Admin</option> }
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
