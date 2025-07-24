import { useState , useEffect } from "react"
import { CircleAlert , ChartGantt , Phone, Clock4} from "lucide-react";

function VisitorsToday({date}) {

    const [data , setdata] = useState([]);
    
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



    useEffect(()=>{
        const today = new Date().toISOString().split('T')[0];
        fetch(`http://localhost:8080/visitors/checkedin/${date}` , {
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

    },[date]);

    return (
        <div>
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

                <div className="flex gap-5 items-center">
                    <div className="text-sm mt-2">
                    <strong>Check-in:</strong> {v.checkinTime ? formatTime(v.checkinTime) : "-"}
                    </div>
                    <div className="text-sm mt-2">
                    <strong>Check-out:</strong> {v.checkoutTime ? formatTime(v.checkoutTime) : "-"}
                    </div>
                </div>

                { v.checkoutTime && 
                <div className="text-sm mt-1 flex items-center gap-1">
                    <Clock4 size={16} /> Duration: {v.checkoutTime ? formatMinutes(v.duration) : "-" }
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
                        <td className="p-3">{v.checkinTime ? formatTime(v.checkinTime) : "- -"}</td>
                        <td className="p-3">{v.checkoutTime ? formatTime(v.checkoutTime) : "- -"}</td>
                        <td className="p-3">{v.checkoutTime ? formatMinutes(v.duration) : "- -"}</td>
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
    )
}

export default VisitorsToday