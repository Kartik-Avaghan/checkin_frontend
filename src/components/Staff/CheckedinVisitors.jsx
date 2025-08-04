import { useState, useEffect } from "react";
import {
  UserRoundSearch,
  LogOut,
  ChevronDown,
  ChevronUp,
  UserRoundX,
  Search,
  Phone,
} from "lucide-react";
import { useRef } from "react";

function formatTime(timeStr) {
  const date = new Date(timeStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateTime(dateStr) {
  const date = new Date(dateStr);
  return `${date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

const CheckedinVisitors = () => {

  const [visitors, setVisitors] = useState([]);
  const [search, setSearch] = useState("");
  // const [statusFilter, setStatusFilter] = useState('all');
  const [expandedCard, setExpandedCard] = useState(null);
  const inputRef = useRef();
  const [update, setUpdate] = useState();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/visitors/checkedin` ,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        }
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch visitors");
        }
        return response.json();
      })
      .then((data) => setVisitors(data))
      .catch((error) => console.log("Error fetching visitors:", error));
  }, [update]);

  const handleCheckout = (id) => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/visitors/checkout/${id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to checkout");
      }
      return response.json();
    })
    .then((updatedVisitor) => {
      setVisitors((preData) =>
        preData.map((v) => (v.id === updatedVisitor.id ? updatedVisitor : v))
      );
    })
    .catch((error) => console.log("Error during checkout:", error))
    .finally(() => { setUpdate(id); });
  };

  const handleIconClick = () => {
    inputRef.current?.focus();
  };

  const toggleExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  // filter
  const filteredVisitors = visitors.filter((v) => {
    // search
    const matchesSearch =
      v.name?.toLowerCase().includes(search.toLowerCase()) ||
      v.mobile?.toString().includes(search);
      return matchesSearch;

    // status filter
    // const matchesStatus =
    //   statusFilter === 'all' || v.status === statusFilter;
    // return matchesSearch && matchesStatus;

  });

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white mt-6 rounded-xl mb-16">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <UserRoundSearch className="text-blue-600" />
        Visitors List
      </h2>

      {/* Search & Filter */}
      <div className="flex  md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search visitors..."
          className="w-full md:w-1/2 px-4 py-2 rounded-md border border-gray-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          ref={inputRef}
        />
        <button
          onClick={handleIconClick}
          type="button"
          className="ml-2 text-gray-400 hover:text-gray-700 cursor-pointer"
        >
          <Search size={36} strokeWidth={1} />
        </button>

        {/* <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-48 px-4 py-2 rounded-md border border-gray-300 bg-white"
        >
          <option value="all">All Status</option>
          <option value="true">Checked In</option>
          <option value="false">Checked Out</option>
        </select> */}
      </div>

      {/*  Cards */}
      {filteredVisitors.length > 0 ? (
        <div className=" space-y-4">
          {filteredVisitors.map((v) => (
            <div
              key={v.id}
              className="border border-gray-300 rounded-xl p-4 shadow-sm transition hover:shadow-md cursor-pointer"
              onClick={() => toggleExpand(v.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xl font-bold p-2">{v.name}</div>
                  <div className="text-sm text-gray-600 pl-2 flex gap-1 items-center"><Phone size={15}/>+91 {v.mobile}</div>
                </div>
                <div className="flex gap-2 items-center">
                  {/* Check Out Button */}
                  {v.status === true ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheckout(v.id);
                      }}
                      className="mt-2 bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm hover:bg-red-200 flex items-center gap-1 "
                    >
                      <LogOut size={16} />
                      Check Out
                    </button>
                  ) : (
                    <div className="mt-2 text-sm text-gray-600">
                      Checked out at:
                      <strong>{formatTime(v.checkOutTime)}</strong>
                    </div>
                  )}

                  {expandedCard === v.id ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>
              </div>

              <div className="text-sm md:text-lg text-gray-700 p-2">
                {/* Check-in: <strong>{formatDateTime(v.checkInTime)}</strong> */}
                Check-in:
                <strong>
                  {v.checkinDate && v.checkinTime
                    ? formatDateTime(`${v.checkinDate}T${v.checkinTime}`)
                    : "N/A"}
                </strong>
              </div>

              <div className="my-2">
                {v.status === true ? (
                  <span className="bg-green-600 text-white px-3 py-2 text-sm rounded-full">
                    Checked In
                  </span>
                ) : (
                  <span className="bg-gray-200 text-gray-800 px-3 py-2 text-sm rounded-full">
                    Checked Out
                  </span>
                )}
              </div>

              {/* Expanded details */}
              {expandedCard === v.id && (
                <div className="mt-4 text-sm text-gray-600 space-y-1 ">
                  <div className="text-lg">
                    <span className="font-medium text-gray-800 "> Visiting: </span>
                    {v.visiting}
                  </div>
                  <div className="text-lg">
                    <span className="font-medium text-gray-800 mt-2"> Purpose: </span>
                    {v.purpose}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex w-full justify-center text-gray-600 font-semibold text-xl gap-3 mt-20">
          <UserRoundX />
          No Visitor Found
        </div>
      )}
    </div>
  );
};

export default CheckedinVisitors;
