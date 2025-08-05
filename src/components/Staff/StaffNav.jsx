import { useState , useEffect } from 'react';
import { Menu, LogOut, X , Home , FileText, Power} from 'lucide-react';
import { Link , useNavigate } from 'react-router';
import { jwtDecode } from 'jwt-decode';

function StaffNav() {
  const [toggle, setToggle] = useState(false);
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
    <div className="relative">
  
      <div className="z-50 p-4 bg-sky-700  cursor-pointer flex justify-between">
        <Menu className="text-white" onClick={() => setToggle(!toggle)}/>
        <Power className="text-white" onClick={() => handlelogout()}/>
      </div>

      {/* Sidebar */}
      <div className={`fixed z-99 top-0 left-0 h-full w-64 bg-sky-800 text-white shadow-lg transform transition-transform duration-300 ease-in-out ${toggle ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col p-6 space-y-4 text-lg font-medium">

          <button onClick={() => setToggle(false)}><X className="text-white cursor-pointer mb-6" /></button>

          <Link
            to={"/"}
            className="flex items-center gap-2 hover:bg-sky-700 px-4 py-2 rounded-md transition w-full cursor-pointer">
            <Home className="text-white" size={24} />
            <button className="hover:cursor-pointer">Home</button>
          </Link>

          <Link to={"/report"} className="flex items-center gap-2 hover:bg-sky-700 px-4 py-2 rounded-md transition w-full cursor-pointer">
            <FileText className="text-white" size={24} />
            <button  className="hover:cursor-pointer"> Reports </button>
          </Link>

          <button className="mt-auto flex items-center justify-center gap-2 bg-gray-900 hover:bg-white   px-4 py-3 rounded-full transition cursor-pointer hover:text-black"
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
