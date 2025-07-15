import { useState } from 'react';
import { UserRoundSearch, LogOut, ChevronDown, ChevronUp } from 'lucide-react';

const initialVisitors = [
  {
    id: 1,
    name: 'John Doe',
    mobile: '+1234567890',
    visiting: 'Sarah Johnson - HR Director',
    purpose: 'Job interview for Senior Developer position',
    checkInTime: '2025-07-15T15:25',
    status: 'checked-in',
    checkOutTime: null,
  },
  {
    id: 2,
    name: 'Alice Smith',
    mobile: '+1987654321',
    visiting: 'Mike Brown - IT Manager',
    purpose: 'Technical consultation meeting',
    checkInTime: '2025-07-15T13:25',
    status: 'checked-out',
    checkOutTime: '2025-07-15T16:25',
  },
  {
    id: 3,
    name: 'Robert Wilson',
    mobile: '+1122334455',
    visiting: 'Lisa Davis - Marketing Head',
    purpose: 'Vendor presentation and product demo',
    checkInTime: '2025-07-15T16:55',
    status: 'checked-in',
    checkOutTime: null,
  },
];

function formatTime(timeStr) {
  const date = new Date(timeStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateTime(dateStr) {
  const date = new Date(dateStr);
  return `${date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })}, ${formatTime(dateStr)}`;
}

const CheckedinVisitors = () => {
  const [visitors, setVisitors] = useState(initialVisitors);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedCard, setExpandedCard] = useState(null);

  const handleCheckout = (id) => {
    setVisitors((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: 'checked-out',
              checkOutTime: new Date().toISOString(),
            }
          : v
      )
    );
  };

  const toggleExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const filteredVisitors = visitors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.mobile.includes(search);
    const matchesStatus =
      statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });


  return (
    <div className="max-w-6xl mx-auto p-4 bg-white mt-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <UserRoundSearch className="text-blue-600" />
        Visitor List
      </h2>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search visitors..."
          className="w-full md:w-1/2 px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-48 px-4 py-2 rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="checked-in">Checked In</option>
          <option value="checked-out">Checked Out</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        { filteredVisitors.length > 0 ? 
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
            <tr>
              <th className="p-3">Visitor</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Visiting</th>
              <th className="p-3">Purpose</th>
              <th className="p-3">Check-in Time</th>
              {/* <th className="p-3">Status</th> */}
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            
            {filteredVisitors.map((v) => (
              <tr key={v.id} className="border-t border-gray-300">
                <td className="p-3 font-semibold">{v.name}</td>
                <td className="p-3">{v.mobile}</td>
                <td className="p-3">{v.visiting}</td>
                <td className="p-3">{v.purpose}</td>
                <td className="p-3">{formatDateTime(v.checkInTime)}</td>
                {/* <td className="p-3 text-nowrap">
                  {v.status === 'checked-in' ? (
                    <span className="bg-green-600 text-white px-3 py-1 text-sm rounded-full">Checked In</span>
                  ) : (
                    <span className="bg-gray-200 text-gray-800 px-3 py-1 text-sm rounded-full">Checked Out</span>
                  )}
                </td> */}
                <td className="p-3">
                  {v.status === 'checked-in' ? (
                    <button
                      onClick={() => handleCheckout(v.id)}
                      className="flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm hover:bg-red-200"
                    >
                      <LogOut size={16} />
                      Check Out
                    </button>
                  ) : (
                    <span className="text-sm text-gray-600">{formatTime(v.checkOutTime)}</span>
                  )}
                </td>
              </tr>
            ))} 
          </tbody>
        </table> : <div className='flex w-full justify-center text-red-500 text-xl'>
          No Result Found</div>}
      </div>

      {/* Mobile Cards */}
      { filteredVisitors.length > 0 ?
      <div className="md:hidden space-y-4">
        { filteredVisitors.map((v) => (
          <div
            key={v.id}
            className="border border-gray-300 rounded-xl p-4 shadow-sm transition hover:shadow-md cursor-pointer"
            onClick={() => toggleExpand(v.id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-bold">{v.name}</div>
                <div className="text-sm text-gray-500">{v.mobile}</div>
              </div>
              <div className="flex gap-2 items-center">
                {v.status === 'checked-in' ? (
                  <span className="bg-green-600 text-white px-3 py-1 text-sm rounded-full">Checked In</span>
                ) : (
                  <span className="bg-gray-200 text-gray-800 px-3 py-1 text-sm rounded-full">Checked Out</span>
                )}
                {expandedCard === v.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>

            <div className="mt-2 text-sm text-gray-700">
              Check-in: <strong>{formatDateTime(v.checkInTime)}</strong>
            </div>

            {/* Check Out Button */}
            {v.status === 'checked-in' ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckout(v.id);
                }}
                className="mt-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm hover:bg-red-200 flex items-center gap-1"
              >
                <LogOut size={16} />
                Check Out
              </button>
            ) : (
              <div className="mt-2 text-sm text-gray-600">
                Checked out at: <strong>{formatTime(v.checkOutTime)}</strong>
              </div>
            )}

            {/* Expanded details */}
            {expandedCard === v.id && (
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <div><span className="font-medium text-gray-800">Visiting:</span> {v.visiting}</div>
                <div><span className="font-medium text-gray-800">Purpose:</span> {v.purpose}</div>
              </div>
            )}
          </div>
        ))}
      </div> : <div className='flex w-full justify-center text-red-500 text-xl'>
        No Result Found
      </div>}
    </div>
  );
};




export default CheckedinVisitors;