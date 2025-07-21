import { useEffect, useState } from "react";
import { CalendarDays, Download, Filter , File , Clock4 , Phone , CircleAlert } from "lucide-react";

import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";



// function formatTime(timeStr) {
//   const date = new Date(timeStr);
//   return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// }

// function formatDateTime(dateStr) {
//   const date = new Date(dateStr);
//   return `${date.toLocaleDateString('en-US', {
//     month: 'short',
//     day: 'numeric',
//   })}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
// }

function formatTime(timeStr) {
  if (!timeStr) return "-"; // handle empty, null, undefined

  const today = new Date().toISOString().split('T')[0]; // "2025-07-21"
  const date = new Date(`${today}T${timeStr}`); // combine date + time

  if (isNaN(date)) return "-"; // invalid input

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return "-";
  const isoString = `${dateStr}T${timeStr}`;
  const date = new Date(isoString);
  return isNaN(date.getTime())
    ? "-"
    : `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
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
  const [staffFilter, setStaffFilter] = useState("all");
  const [data , setdata] = useState([]);
  const [startDate , setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate , setEndDate] = useState(new Date().toISOString().split("T")[0]);
  useEffect(()=>{
    fetch(`http://localhost:8080/visitors/checkedin/${startDate}/${endDate}` , {
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
  },[startDate , endDate, staffFilter]);

  const CSVgenerator = (data) => {
    const array = Array.isArray(data) ? data : [data];
    const excludedFields = ["status", "version"];
    // Filter headers
    const headers = Object.keys(array[0]).filter(
      (key) => !excludedFields.includes(key)
    );
    const csvRows = [
      headers.join(","), // header row
      ...array.map((row) =>
        headers.map((field) => `"${row[field]}"`).join(",")
      ),
    ];
    return csvRows.join("\n");
  };

  const downloadCSV = () => {
    const csv = CSVgenerator(data);
    const blob = new Blob([csv], { type: "text/csv" });
    // create anchor tag for download purpose
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "visitor_report.csv";
    link.click();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Visitor Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [
        [
          "Name",
          "Mobile",
          "Checked In Time",
          "Checked Out Time",
          "Duration",
          "Visiting Person",
          "Purpose",
        ],
      ],
      body: data.map((item) => [
  item.name,
  item.mobile,
  item.checkinTime ? formatDateTime(item.checkinTime) : "-",
  item.checkoutTime ? formatDateTime(item.checkoutTime) : "-",
  item.duration,
  item.visiting,
  item.purpose,
]),
      theme: "striped",
    });

    doc.save("visitor_report.pdf");
  };

  return (



    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Visitor Reports</h2>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2">
            <label htmlFor="startdate">Start Date: </label>
            <input
              type="date"
              name="startdate"
              id="startdate"
              defaultValue={new Date().toISOString().split("T")[0]}
              onChange={(e) => setStartDate( e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md"
            />

            <label htmlFor="enddate" className="md:ml-4">End Date: </label>
            <input
              type="date"
              name="enddate"
              id="enddate"
              defaultValue={new Date().toISOString().split("T")[0]}
              onChange={(e) => setEndDate( e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md"
            />
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
            onClick={downloadCSV}
          >
            <Download size={16} />
            Export CSV
          </button>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
            onClick={downloadPDF}
          >
            <File size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Mobile View */}
      {data.length > 0 ? (
        <div className="lg:hidden space-y-4">
          {data.map((v) => (
            <div
              key={v.id}
              className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between">
                <div>
                  <div className="text-lg font-semibold">{v.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{v.mobile}</div>
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

              <div className="flex gap-5 items-center">
                <div className="text-sm mt-2">
                  <strong>Check-in:</strong> {v.checkinTime ? formatTime(v.checkinTime) : "-"}
                   

                </div>
                <div className="text-sm mt-2">
                  <strong>Check-out:</strong> {v.checkoutTime ? formatTime(v.checkoutTime) : "-"}
                </div>
              </div>

              <div className="text-sm mt-1 flex items-center gap-1">
                <Clock4 size={16} /> Duration: {formatMinutes(v.duration) || "- -"}
              </div>

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
      {data.length > 0 ? (
        <div className="hidden lg:block">
          <div className="overflow-x-auto border border-gray-300 rounded-xl">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700 font-semibold">
                <tr>
                  <th className="p-3 text-left">Visitor</th>
                  <th className="p-3 text-left">Mobile</th>
                  <th className="p-3 text-left">Visiting</th>
                  <th className="p-3 text-left">Purpose</th>
                  <th className="p-3 text-left">Check-in</th>
                  <th className="p-3 text-left">Check-out</th>
                  <th className="p-3 text-left">Duration</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((v) => (
                  <tr key={v.id} className="border-t border-gray-300">
                    <td className="p-3 font-medium">{v.name}</td>
                    <td className="p-3">{v.mobile}</td>
                    <td className="p-3">{v.visiting}</td>
                    <td className="p-3">{v.purpose}</td>
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
          <CircleAlert size={30} /> <span> No Data found </span>
        </div>
      )}
    </div>

      );
}

export default VisitorReport;
