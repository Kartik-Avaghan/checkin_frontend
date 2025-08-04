import { useState, useEffect } from "react";
import { Users, User, Clock , UserCog } from "lucide-react";
import { Link } from "react-router";

function Stats({ date }) {
  const [stats, setStats] = useState({});
  const [activestaff , setActiveStaff] = useState();

  function formatMinutes(totalMinutes) {
    if (isNaN(totalMinutes) || totalMinutes < 0) return "-";

    const hours = Math.floor(totalMinutes / 60);
    const calcminutes = totalMinutes % 60;
    const minutes = parseInt(calcminutes);
    if (hours === 0) return `${minutes}min`;
    if (minutes === 0) return `${hours}hr`;
    return `${hours}hrs ${minutes}min`;
  }

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    fetch(`http://localhost:8080/visitors/stats/${date}`, {
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
      .then((data) => {
        setStats(data);
      })
      .catch((error) => {
        console.log("Error in fetching Visitors", error);
      });

      fetch(`http://localhost:8080/users/count/active`, {
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
      .then((data) => {
        setActiveStaff(data);
      })
      .catch((error) => {
        console.log("Error in fetching Visitors", error);
      });

  }, [date]);

  return (
    <div className="flex items-center justify-center gap-8 flex-wrap p-8">
      <div className="flex justify-between items-center w-75 md:w-100 md:h-25 text-center border-gray-300 border rounded-lg shadow-sm p-6">
        <div className="font-semibold text-wrap">
          <h2 className="text-lg md:text-xl text-gray-600">
            Total Visitors
          </h2>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-500 mt-1 text-left">
            {stats.totalVisitors}
          </h2>
        </div>
        <div className="flex items-center">
          <Users size={40} className="text-blue-600" />
        </div>
      </div>

      <div className="flex justify-between items-center w-75 md:w-100 md:h-25 text-center border-gray-300 border rounded-lg shadow-sm p-6">
        <div className="font-semibold text-wrap">
          <h2 className="text-lg md:text-xl text-gray-600">Currently In </h2>
          <h2 className="text-2xl md:text-3xl font-bold text-green-500 mt-1 text-left">
            {stats.checkedInVisitors}
          </h2>
        </div>
        <div className="flex items-center">
          <User size={40} className="text-green-600" />
        </div>
      </div>

      <div className="flex justify-between items-center w-75 md:w-100 md:h-25 text-center border-gray-300 border rounded-lg shadow-sm p-6">
        <div className="font-semibold text-wrap">
          <h2 className="text-lg md:text-xl text-gray-600">
            Average Duration{" "}
          </h2>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-600 mt-1 text-left">
            {formatMinutes(stats.avgDuration)}
          </h2>
        </div>
        <div className="flex items-center">
          <Clock size={40} className="text-gray-600" />
        </div>
      </div>

      <Link to={"/admin/users"}>
      <div className="flex justify-between items-center w-75 md:w-100 md:h-25 text-center border-gray-300 border rounded-lg shadow-sm p-6">
        <div className="font-semibold text-wrap">
          <h2 className="text-lg md:text-xl text-gray-600">
            Active Staff
          </h2>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mt-1 text-left">
            {activestaff ? activestaff - 1 : 0}
          </h2>
        </div>
        <div className="flex items-center">
          <UserCog size={40} className="text-blue-600" />
        </div>
      </div>  </Link>

    </div>
  );
}

export default Stats;
