import { useEffect, useState } from "react";
import StaffNav from "../components/Staff/StaffNav";
import AdminNav from "../components/Admin/AdminNav";
import { UserPlus } from "lucide-react";
import { useNavigate , useLocation } from "react-router";
import { jwtDecode } from "jwt-decode";
import { useToast } from "../components/ToastProvider";
import Loader from "../components/Loader";


function Checkin() {

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    visiting: "",
    purpose: "",
    checkedInBy:""
  });
  const [isLoading, setIsLoading] = useState(false);

  let navigate = useNavigate();
  const {addToast} = useToast();

  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };

  useEffect(() => {
    let token = localStorage.getItem("token");
    if(token){
      let tokendata = jwtDecode(token)
      setFormData({checkedInBy: tokendata.sub})
    } else{
      localStorage.removeItem("token");
      navigate("/login")
    }
  },[])

  function handleCheckin(e) {
    e.preventDefault();
    setIsLoading(true);

    fetch("http://localhost:8080/visitors/add", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        ...formData
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to add visitor");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Visitor added:", data);
      setFormData({ name: "", mobile: "", visiting: "", purpose: "" });
      {isAdmin ? navigate("/admin/dashboard") : navigate("/") }
      addToast("Visitor checked in successfully!", "success");
    })
    .catch((error) => {
      console.error("Error adding visitor:", error);
      addToast("Could not check in visitor. Please try again.", "error");
    }).finally(() => {
      setIsLoading(false);
    });
  }

  return (
    <div>
      {isAdmin ? <AdminNav /> : <StaffNav />}
      <div>
        {isLoading &&  <Loader />}
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
            <UserPlus className="text-blue-600" />
            Visitor Check-in
          </h2>

          <form className="space-y-6" onSubmit={handleCheckin}>

            {/* Visitor Name & Mobile */}
            <div className="">
              <label className="block font-medium text-gray-700 mb-1">
                Visitor Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter visitor's full name"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                defaultValue={formData.name}
                onChange={handleChanges}
              />
            </div>

            <div className="">
              <label className="block font-medium text-gray-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobile"
                placeholder="Enter mobile number"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                pattern="[0-9]{10}"
                defaultValue={formData.mobile}
                onChange={handleChanges}
              />
            </div>

            {/* Visiting Person */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Visiting Person *
              </label>
              <select
                className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                name="visiting"
                value={formData.visiting}
                onChange={handleChanges}
              >
                {/* <option>Select the person to visit</option> */}
                <option value="">Select the person to visit</option>
                <option value="Manager">Manager</option>
                <option value="HR">HR</option>
                <option value="Staff A">Staff A</option>
                <option value="Staff B">Staff B</option>
              </select>
            </div>

            {/* Purpose of Visit */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                {" "}
                Purpose of Vist *
              </label>
              <select
                className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                name="purpose"
                value={formData.purpose}
                onChange={handleChanges}
              >
                {/* <option>Select the purpose to visit</option> */}
                <option value="">Select the purpose</option>
                <option value="Meeting">Meeting</option>
                <option value="Interview">Interview</option>
                <option value="Delivery">Delivery</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition text-md"
            >
              <UserPlus size={18} /> Check In Visitor
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Checkin;
