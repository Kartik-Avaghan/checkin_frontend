import { useEffect , useState} from 'react'
import AdminNav from '../../components/Admin/AdminNav'
import VisitorsToday from '../../components/Admin/VisitorsToday'
import VisitorStats from '../../components/Admin/VisitorStats'

function AdminDashboard() {
  
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  return (
    <div>
      <AdminNav/>
      <div className='flex flex-col items-center justify-center mt-10'>
        <div>
          <label htmlFor="date" className='text-gray-600 font-semibold p-2'>Select Date:</label>
          <input type="date" name="date" id="date" className='border rounded py-2 px-4 border-gray-300 mb-4' defaultValue={date}  onChange={(e) => setDate(e.target.value) }/>
        </div>
        <VisitorStats date={date}/>
        <div className='w-full my-10 p-3 md:my-4 md:p-14'>
          <VisitorsToday date={date}/>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard