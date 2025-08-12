import { useEffect, useState, useRef, useMemo } from "react";
import {
  Download,
  File,
  Clock4,
  Phone,
  CircleAlert,
  ChartGantt,
  Users,
  Calendar,
  Funnel,
  Search,
  X,
} from "lucide-react";

import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

import { useToast } from "../../components/ToastProvider";

function UsersReport() {
  const [data, setdata] = useState([]);
  const [startDate, setStartDate] = useState( new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState( new Date().toISOString().split("T")[0]);
  const [addfilters, setAddFilters] = useState(false);
  const [filter, setFilter] = useState("all");
  const [rolefilter , setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [sortConfig , setSortConfig] = useState({key: null , direction: "asc"});

  const { addToast } = useToast();
  const searchInputRef = useRef(null);

  const handleFocusSearch = () => {
    searchInputRef.current?.focus();
  };


  function formatTime(timeString) {
    const date = new Date(timeString);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12

    return `${hours}:${minutes} ${ampm}`;
  }

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/logs/${startDate}/${endDate}`,
    {
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
      console.log(data);
      setdata(data);
    })
    .catch((error) => {
      console.log("Error in fetching User Details", error);
    });
  }, [startDate, endDate]);

  const CSVgenerator = (data) => {
    const array = Array.isArray(data) ? data : [data];
    const excludedFields = ["id", "status", "version"];
    // Filter headers
    const headers = Object.keys(array[0]).filter(
    (key) => !excludedFields.includes(key)
    );

    const csvHeaders = ["S.No", ...headers];
    const csvRows = [
    csvHeaders.join(","), // header row
    ...array.map((row, index) =>
        [index + 1, ...headers.map((field) => `"${row[field]}"`)].join(",")
    ),
    ];
    return csvRows.join("\n");
  };

  const downloadCSV = () => {
    if (filteredData.length === 0) {
    addToast("No Data to Export", "warning");
    return;
    }

    const csv = CSVgenerator(filteredData);
    const blob = new Blob([csv], { type: "text/csv" });
    // create anchor tag for download purpose
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "staff_report.csv";
    link.click();
  };

  const downloadPDF = () => {
    if (filteredData.length === 0) {
      addToast("No Data to Export", "warning");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text("STAFF Report", 14, 20);
    doc.setFontSize(12);
    if (startDate === endDate) {
      doc.text(
        `Date: ${new Date(startDate).toLocaleDateString("en-IN")}`,
        14,
        29
      );
    } else {
      doc.text(
        `From: ${new Date(startDate).toLocaleDateString(
          "en-IN"
        )}   To: ${new Date(endDate).toLocaleDateString("en-IN")}`,
        14,
        29
      );
    }

    autoTable(doc, {
      startY: 35,
      margin: { top: 10, bottom: 10, left: 10, right: 8 },
      head: [
        [
          "S.No",
          "Date",
          "Name",
          "Role",
          "Log In",
          "Log Out",
        ],
      ],
      body: filteredData.map((item, index) => [
        index + 1,
        item.loginTime
          ? new Date(item.checkinDate).toLocaleDateString("in")
          : "-",
        item.username,
        item.role,
        item.loginTime ? formatTime(item.loginTime) : "-",
        item.logoutTime ? formatTime(item.checkoutTime) : "-",
      ]),
      theme: "striped",
    });

    if (startDate === endDate) {
      doc.save(`${new Date(startDate).toLocaleDateString( "en-IN")} - staff_report.pdf`);
    } else {
      doc.save(`${new Date(startDate).toLocaleDateString("en-IN")} - ${new Date(endDate)
        .toLocaleDateString("en-IN")} staff_report.pdf`
      );
    }
  };

  // date validations
  useEffect(() => {
    if (endDate > new Date().toISOString().split("T")[0]) {
      addToast("End date cannot be Greater than Current Date", "warning");
      setEndDate(new Date().toISOString().split("T")[0]); // Reset to current date
    }

    if (endDate < startDate) {
      addToast("End date cannot be before start date", "warning");
      setEndDate(new Date().toISOString().split("T")[0]); // Reset to current date
    }

    if (startDate > endDate) {
      addToast("Start date cannot be after end date", "warning");
      setStartDate(new Date().toISOString().split("T")[0]); // Reset to current date
    }
  }, [endDate, startDate]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);


  const handleSort = (key) => {
    let direction = 'asc';

    if(sortConfig.key == key && sortConfig.direction == "asc"){
      direction = 'desc'
    }

    const sortedData = [...data].sort((a, b) => {
      if(a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if(a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0; 
    });

    setdata(sortedData);
    setSortConfig({key , direction});
  }


  const filteredData = useMemo(() => {
    return data.filter((s) => {
      const search = String(debouncedSearch || "")
        .toLowerCase()
        .trim();

      const name = String(s.username ?? "").toLowerCase();
      const role = String(s.role ?? "").toLowerCase();

      const matchesSearch = name.includes(search) 

      const matchesRole = 
        rolefilter === "all" || (rolefilter === "staff" && role === "staff") || (rolefilter === "admin" && role === "admin");

      const matchesStatus =
        filter === "all" ||
        (filter === "active" && s.logoutTime === null) ||
        (filter === "inactive" && s.logoutTime );

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [data, debouncedSearch, filter, rolefilter]);

  useEffect(() => {
    if (addfilters == false) {
      setSearch("");
      setFilter("all");
    }
  }, [addfilters]);

  return <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div className="flex items-center gap-2 text-blue-500">
          <Users/>
          <h2 className="text-2xl font-bold text-nowrap"> Staff Reports</h2>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center justify-center gap-2 px-3 py-2 flex-wrap">
            <div>
              <label htmlFor="startdate">Start Date: </label>
              <input
                type="date"
                name="startdate"
                id="startdate"
                value={startDate}
                onChange={(e) => setStartDate( e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md ml-2"
              />
            </div>

            <div className="xl:ml-4">
              <label htmlFor="enddate" className="xl:">End Date: </label>
              <input
                type="date"
                name="enddate"
                id="enddate"
                value={endDate}
                onChange={(e) => setEndDate( e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md ml-4 lg:ml-2"
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md text-sm flex items-center gap-2 hover:cursor-pointer"
            onClick={downloadCSV}
          >
            <Download size={16} />
            Download Excel
          </button>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md text-sm flex items-center gap-2 hover:cursor-pointer border-2"
            onClick={downloadPDF}
          >
            <File size={16} />
            Download PDF
          </button>

          <button
            className={`${addfilters ? 'bg-white border-2 border-gray-400 text-black hover:bg-black hover:text-white ' : 'bg-black text-white  hover:bg-gray-700'  } px-4 py-3 rounded-md text-sm flex items-center gap-2 hover:cursor-pointer `}
            onClick={() => setAddFilters(!addfilters)}
          >
            { addfilters ? <X size={16} /> : <Funnel size={16} />}
            { addfilters ? " Remove Filters" :  ' Add Filters'}
          </button>
        </div> 
      </div> 
      
      {addfilters && <div>
        {/*  search & filters*/}
        <div className="flex flex-col items-start space-y-3 mb-6 mt-7 md:mt-10 w-full px-4">
          <div className="flex items-center space-x-1 text-lg font-semibold text-gray-600">
            <Funnel size={18}/>
            <span className=" text-start text-md">Filters</span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 w-full">
            {/* Search Box */}
            <div className="relative w-full sm:max-w-sm">
              <input
                type="text"
                ref={searchInputRef}
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                placeholder="Search By Users name..."
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

            {/*  Dropdown */}
            <div className="flex gap-4 flex-wrap">
              <select value={rolefilter} onChange={((e)=>setRoleFilter(e.target.value))} className="w-full sm:w-auto border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 ">
                <option value="all">All Roles</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>

              <select value={filter} onChange={((e)=>setFilter(e.target.value))} className="w-full sm:w-auto border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 ">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">offline</option>
              </select>

            </div>
          </div>
        </div>
      </div> }
      

      {/* Mobile View */}
      {filteredData.length > 0 ? (
        <div className="lg:hidden space-y-4">
          {filteredData.map((v) => (
            <div
              key={v.id}
              className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between">
                
                <div>
                  <div className="text-lg font-semibold">{v.username}</div>
                  <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">{v.role}</div>
                </div>
                <div className="mt-2 ">
                  {v.logoutTime === null ? (
                    <span className="bg-green-600 text-white text-sm px-3 py-2 rounded-full text-nowrap">
                      Active
                    </span>
                  ) : (
                    <span className="bg-gray-200 text-gray-800 text-sm px-3 py-2 rounded-full text-nowrap">
                      Offline
                    </span>
                  )}
                </div>
              </div>

              <div className="text-sm mt-2 flex items-center gap-1">
                <Calendar size={14}/> {v.loginTime ? new Date(v.loginTime).toLocaleDateString("en-IN") : "-"}
              </div>
              <div className="flex gap-5 items-center mb-2">
                <div className="text-sm mt-2">
                  <strong>Log in:</strong> {v.loginTime ? formatTime(v.loginTime) : "-"}
                </div>
                <div className="text-sm mt-2">
                  <strong>Log out:</strong> {v.logoutTime ? formatTime(v.logoutTime) : "-"}
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="lg:hidden flex items-center justify-center gap-2 mt-40 text-xl text-gray-800 font-medium">
          <CircleAlert /> No Data found
        </div>
      )}

      {/* Desktop View */}
      {filteredData.length > 0 ? (
        <div className="hidden lg:block">
          <div className="overflow-x-auto border border-gray-300 rounded-xl">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700 font-semibold">
                <tr>
                  <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('loginTime')}>
                    <span>{sortConfig.key === "loginTime" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}</span>  date</th>
                  <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('username')}>
                    <span>{sortConfig.key === "username" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}</span>  Name</th>
                  <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('role')}>
                    <span>{sortConfig.key === "role" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}</span> Role</th>
                  <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('loginTime')}>
                    <span>{sortConfig.key === "loginTime" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""} </span> Log in</th>
                  <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('logoutTime')}>
                    <span>{sortConfig.key === "logoutTime" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}</span> Log out</th>
                  <th className="p-3 text-left"> Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((v , index) => (
                  <tr key={v.id} className="border-t border-gray-300">
                    <td className="p-3"> {v.loginTime ? new Date(v.loginTime).toLocaleDateString("en-IN") : "-"} </td>
                    <td className="p-3 font-medium">{v.username}</td>
                    <td className="p-3">{v.role}</td>
                    <td className="p-3">{v.loginTime ? formatTime(v.loginTime): "-"}</td>
                    <td className="p-3">{v.logoutTime? formatTime(v.logoutTime) : "-"}</td>
                    <td className="p-3">
                      {v.logoutTime === null ? (
                        <span className="bg-green-600 text-white px-4 py-1 text-sm rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="bg-gray-200 text-gray-800 px-3 py-1 text-sm rounded-full">
                          Offline
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex items-center justify-center gap-3 mt-50 text-3xl text-gray-800 font-medium">
          <ChartGantt size={30} /> <span> No Data found </span>
        </div>
      )}
    </div>;
}

export default UsersReport;
