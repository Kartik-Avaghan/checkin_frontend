import { useEffect, useState, useRef } from "react";
import { Download, File , Clock4 , Phone , CircleAlert , ChartGantt , Users, Calendar, Funnel, Search, X } from "lucide-react";

import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

import { useToast } from "../../components/ToastProvider";

function formatTime(timeStr) {
  if (!timeStr) return "-"; // handle empty, null, undefined

  const today = new Date().toISOString().split('T')[0]; // "current date"
  const date = new Date(`${today}T${timeStr}`); // combine date + time

  if (isNaN(date)) return "-"; // invalid input

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}


function formatMinutes(totalMinutes) {
  if (isNaN(totalMinutes) || totalMinutes < 0) return "-";

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}min`;
  if (minutes === 0) return `${hours}hr`;
  return `${hours}hrs ${minutes}min`;
}


function VisitorReport() {

  const [data , setdata] = useState([]);
  const [startDate , setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate , setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [addfilters , setAddFilters] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search , setSearch] = useState();

  const {addToast} = useToast();
  const searchInputRef = useRef(null);

  const handleFocusSearch = () => {
    searchInputRef.current?.focus();
  };
  
  useEffect(()=>{
    fetch(`${import.meta.env.VITE_API_BASE_URL}/visitors/checkedin/${startDate}/${endDate}` , {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      }
    })
    .then((response)=>{
      if(!response.ok){
        throw new Error("Response was not ok")
      }
      return response.json();
    })
    .then((data)=>{
      console.log(data)
      setdata(data);
    })
    .catch((error)=>{console.log("Error in fetching Visitors", error);});

  },[startDate , endDate]);

  const CSVgenerator = (data) => {
    const array = Array.isArray(data) ? data : [data];
    const excludedFields = ["id" ,"status", "version"];
    // Filter headers
    const headers = Object.keys(array[0]).filter(
      (key) => !excludedFields.includes(key)
    );

    const csvHeaders =  ["S.No" , ...headers];
    const csvRows = [
      csvHeaders.join(","), // header row
      ...array.map((row , index) =>
      [
        index+1,
        ...headers.map((field) => `"${row[field]}"`)
      ].join(",")),
    ];
    return csvRows.join("\n");
  };

  const downloadCSV = () => {
    if (data.length === 0) {
      addToast("No Data to Export", "warning");
      return;
    }

    const csv = CSVgenerator(data);
    const blob = new Blob([csv], { type: "text/csv" });
    // create anchor tag for download purpose
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "visitor_report.csv";
    link.click();
  };


  const downloadPDF = () => {

    if (data.length === 0) {
      addToast("No Data to Export", "warning");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text("Visitors Report", 14, 20);
    doc.setFontSize(12);
    if (startDate === endDate) {
      doc.text(`Date: ${new Date(startDate).toLocaleDateString("IN")}`, 14, 29);
    } else {
      doc.text(`From: ${ new Date(startDate).toLocaleDateString("IN")}   To: ${new Date(endDate).toLocaleDateString("IN")}`, 14, 29);
    }
    
    autoTable(doc, {
      startY: 35,
      margin: { top: 10, bottom: 10, left: 10, right: 8 },
      head: [
        [
          "S.No",
          "Name",
          "Mobile",
          "Check-in Date",
          "Checked In",
          "Checked Out",
          "Duration",
          "Visiting Person",
          "Purpose",
          "Staff Incharge",
        ],
      ],
      body: data.map((item , index) => [
        index + 1,
        item.name,
        item.mobile,
        item.checkinDate ? new Date(item.checkinDate).toLocaleDateString("in") : "-",
        item.checkinTime ? formatTime(item.checkinTime) : "-",
        item.checkoutTime ? formatTime(item.checkoutTime) : "-",
        formatMinutes(item.duration),
        item.visiting,
        item.purpose,
        item.checkedInBy
      ]),
      theme: "striped",
    });
    
    if(startDate === endDate) {
      doc.save(`${new Date(startDate).toLocaleDateString("in")} - visitors_report.pdf`);
    } else{
      doc.save(`${new Date(startDate).toLocaleDateString("in")} - ${new Date(endDate).toLocaleDateString("in")} visitors_report.pdf`);
    }
  };


  // date validations
  useEffect(() => {

    if(endDate > new Date().toISOString().split("T")[0]) {
      addToast("End date cannot be Greater than Current Date", "warning"); 
      setEndDate(new Date().toISOString().split("T")[0]); // Reset to current date
    }

    if(endDate < startDate) {
      addToast("End date cannot be before start date" , "warning");
      setEndDate(new Date().toISOString().split("T")[0]); // Reset to current date
    }

    if(startDate > endDate) {
      addToast("Start date cannot be after end date" , "warning");
      setStartDate(new Date().toISOString().split("T")[0]); // Reset to current date
    }

  },[endDate , startDate]);


  const filteredData = data.filter((s)=>{
    const name = s.name?.toLowerCase() || "";
    const matchesSearch = name.includes((search || "").toLowerCase().trim());

    const matchesStatus=
    filter ==="all"|| 
    (filter ==="active" && s.status === true)||
    (filter ==="inactive" && s.status !== true);

    return matchesSearch && matchesStatus
  })


  


  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div className="flex items-center gap-2 text-blue-600">
          <Users/>
          <h2 className="text-2xl font-bold text-nowrap"> Visitors Reports</h2>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 flex-wrap">
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
            <div>
              <label htmlFor="enddate" className="lg:ml-4">End Date: </label>
              <input
                type="date"
                name="enddate"
                id="enddate"
                value={endDate}
                onChange={(e) => setEndDate( e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md ml-2"
              />
            </div>
          </div>
          {/* <div className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-md">
            <Filter size={16} />
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="text-sm bg-transparent outline-none"
            >
              <option value="all">All Staff Members</option>
              <option value="hr">HR Director</option>
              <option value="it">IT Manager</option>
            </select>
          </div> */}
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 hover:cursor-pointer"
            onClick={downloadCSV}
          >
            <Download size={16} />
            Export CSV
          </button>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 hover:cursor-pointer"
            onClick={downloadPDF}
          >
            <File size={16} />
            Export PDF
          </button>

          <button
            className={`${addfilters ? 'bg-white border-2 border-gray-400 text-black' : 'bg-black text-white' } hover:bg-blue-500  px-4 py-2 rounded-md text-sm flex items-center gap-2 hover:cursor-pointer`}
            onClick={() => setAddFilters(!addfilters)}
          >
            { addfilters ? <X size={16} /> : <Funnel size={16} />}
            { addfilters ? "Remove Filters" :  'Add Filters'}
          </button>
        </div> 
      </div> 
      
      {addfilters && <div>
        {/*  search & filters*/}
        <div className="flex flex-col items-start space-y-3 mb-6 mt-10 w-full px-4">
          <div className="flex items-center space-x-1 text-lg font-semibold">
            <Funnel className="size-5 text-gray-500"/>
            <span className="text-gray-500 text-start">Filters</span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 w-full">
            {/* Search Box */}
            <div className="relative w-full sm:max-w-sm">
              <input
                type="text"
                ref={searchInputRef}
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                placeholder="Search By Visitors name..."
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
            <select value={filter} onChange={((e)=>setFilter(e.target.value))} className="w-full sm:w-auto border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 ">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
                  <div className="text-lg font-semibold">{v.name}</div>
                  <div className="text-sm text-gray-600 mt-1 flex items-center gap-1"><Phone size={12}/> {v.mobile}</div>
                </div>
                <div className="mt-2 ">
                  {v.status === true ? (
                    <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-full text-nowrap">
                      In Office
                    </span>
                  ) : (
                    <span className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full text-nowrap">
                      Checked Out
                    </span>
                  )}
                </div>
              </div>

              <div className="text-sm mt-2 flex items-center gap-1">
                <Calendar size={14}/> {v.checkinDate ? new Date(v.checkinDate).toLocaleDateString("IN") : "-"}
              </div>
              <div className="flex gap-5 items-center mb-2">
                <div className="text-sm mt-2">
                  <strong>Check-in:</strong> {v.checkinTime ? formatTime(v.checkinTime) : "-"}
                </div>
                <div className="text-sm mt-2">
                  <strong>Check-out:</strong> {v.checkoutTime ? formatTime(v.checkoutTime) : "-"}
                </div>
              </div>

              { v.checkoutTime && 
              <div className="text-sm mt-1 flex items-center gap-1">
                <Clock4 size={16} /> Duration: {formatMinutes(v.duration) || "- -"}
              </div> }

              <div className="flex mt-2 text-sm text-gray-700 gap-4 sm:gap-5 flex-wrap">
                <div>
                  <strong>Visiting:</strong> {v.visiting}
                </div>
                <div className="">
                  <strong>Purpose:</strong> {v.purpose}
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
                  <th className="p-3 text-left">Visitor</th>
                  <th className="p-3 text-left">Mobile</th>
                  <th className="p-3 text-left">Visiting</th>
                  <th className="p-3 text-left">Purpose</th>
                  <th className="p-3 text-left">Check-in Date</th>
                  <th className="p-3 text-left">Check-in</th>
                  <th className="p-3 text-left">Check-out</th>
                  <th className="p-3 text-left">Duration</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((v) => (
                  <tr key={v.id} className="border-t border-gray-300">
                    <td className="p-3 font-medium">{v.name}</td>
                    <td className="p-3">{v.mobile}</td>
                    <td className="p-3">{v.visiting}</td>
                    <td className="p-3">{v.purpose}</td>
                    <td className="p-3"> {v.checkinDate ? new Date(v.checkinDate).toLocaleDateString("IN") : "-"} </td>
                    <td className="p-3">{v.checkinTime ? formatTime(v.checkinTime) : "-"}</td>
                    <td className="p-3">{v.checkoutTime ? formatTime(v.checkoutTime) : "-"}</td>
                    <td className="p-3">{formatMinutes(v.duration) || "-"}</td>
                    <td className="p-3">
                      {v.status === true ? (
                        <span className="bg-green-600 text-white px-4 py-1 text-sm rounded-full">
                          In Office
                        </span>
                      ) : (
                        <span className="bg-gray-200 text-gray-800 px-3 py-1 text-sm rounded-full">
                          Checked Out
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
    </div>
  );
}

export default VisitorReport;
