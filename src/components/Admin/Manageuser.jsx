import { useEffect, useState , useRef} from "react";
import { SquarePen, Trash2, Search, UserPlus, Funnel , UserRoundX } from "lucide-react";
import EditUser from "./EditUser";
import DeleteUser from "./DeleteUser";
import AddUsers from "./AddUsers";

function Manageuser() {
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState();
  const [deleteUser, setDelete] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const [edit, setEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const searchInputRef = useRef(null);

  const handleFocusSearch = () => {
    searchInputRef.current?.focus();
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/users/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Response was not ok");
      }
      return response.json();
    })
    .then((data) => setData(data))
    .catch((error) => {
      console.log("Fetching Error", error);
    });
  }, [edit, deleteUser, addUser]);


  function handleEdit(staffid){
    setUserId(staffid);
    setEdit(true);
  }

  function handleDelete(userId){
    setUserId(userId);
    setDelete(true)
  }

  const filteredData= data.filter((s)=>{
    const matchesSearch =
    s.username?.toLowerCase().includes(search.toLowerCase()) ||
    s.mobile?.toString().includes(search);

    const matchesStatus=
    statusFilter ==="all"|| 
    (statusFilter ==="active" && s.status === true)||
    (statusFilter ==="inactive" && s.status !== true);

    return matchesSearch && matchesStatus
  })


  return (

    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <h2 className="text-xl md:text-2xl font-bold w-25 sm:w-fit">User Management</h2>
        </div>

        <button
          className="border-2 border-sky-800 bg-sky-800 text-white text-lg font-semibold rounded-xl px-4 py-2 hover:bg-white hover:text-sky-800 transition flex items-center gap-2 cursor-pointer"
          onClick={() => setAddUser(true)}
        >
          <UserPlus size={20} /> Add Users
        </button>
      </div>

      <div className="flex flex-col items-start space-y-3 mb-6 mt-10 w-full px-4">
        {/* Header */}
        <div className="flex items-center space-x-1 text-lg font-semibold">
          <Funnel className="size-5 text-gray-500"/>
          <span className="text-gray-500 text-start">Filter</span>
        </div>

        {/* search and filters */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 w-full">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-sm">
            <input
              type="text"
              ref={searchInputRef}
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full rounded-md border border-gray-300 px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleFocusSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <Search size={20} />
            </button>
          </div>

          {/* Role Dropdown */}
          <select value={statusFilter} onChange={((e)=>setStatusFilter(e.target.value))} className="w-full sm:w-auto border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 ">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {filteredData.length > 0 ? 
        <div className="rounded-lg p-4 mt-1">
          <div className="overflow-x-auto rounded-lg shadow-sm">
            <table className="min-w-full table-auto border-collaps">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Mobile
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Role
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((s) => (
                  <tr key={s.id} className="border-t border-gray-300">
                    <td className="px-6 py-3">{s.username}</td>
                    <td className="px-6 py-3">{s.mobile}</td>
                    <td className="px-6 py-3 text-nowrap text-center">
                      {s.role == "admin" ? (
                        <span className="bg-blue-100 px-4 py-2 rounded-full">
                          Admin
                        </span>
                      ) : s.role == "super_admin" ? ( <span className="bg-amber-100 px-4 py-2 rounded-full"> Super Admin</span>) : (
                        <span className="px-4 py-2">Staff</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-center">
                      {s.status == true ? (
                        <span className="bg-green-100 px-4 py-2 rounded-full text-center text-green-700 text-nowrap">
                          Active
                        </span>
                      ) : (
                        <span className="bg-red-50 px-4 py-2 rounded-full text-center text-red-700 text-nowrap">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className=" px-2 py-3 flex gap-4 justify-center">
                      {s.role == "super_admin" ? <></> : <div>
                      <button
                        className="hover:border-green-600 hover:text-white hover:bg-green-600 border-2 border-gray-300 p-2 rounded-lg mr-2 cursor-pointer"
                        onClick={() => { handleEdit(s.id); }}
                      >
                        <SquarePen className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="hover:border-red-600 hover:text-white hover:bg-red-600 border-2 border-gray-300 p-2 rounded-lg cursor-pointer transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button> </div> }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> : <div className="flex flex-col items-center justify-center mt-25 text-2xl gap-4 text-gray-700 font-semibold ">
            < UserRoundX size={40} /> No Users Found
        </div>
      }
      
      {addUser && <AddUsers setAddUser={setAddUser}/> }
      { edit && <EditUser id={userId} setEdit={setEdit}/>}
      {deleteUser && <DeleteUser id={userId} setDelete={setDelete}/>}
    </div>
  );
}

export default Manageuser;
