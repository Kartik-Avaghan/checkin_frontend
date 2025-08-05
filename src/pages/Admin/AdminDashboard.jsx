import { useEffect , useState} from 'react'
import AdminNav from '../../components/Admin/AdminNav'
import VisitorsToday from '../../components/Admin/VisitorsToday'
import Stats from '../../components/Admin/Stats'
import {useToast} from '../../components/ToastProvider'

function AdminDashboard() {
  
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const { addToast } = useToast();

  useEffect(() => {
    if(date > new Date().toISOString().split("T")[0]) {
      setDate(new Date().toISOString().split("T")[0]); // Reset to current date
      addToast("Date cannot be Greater than Current Date", "warning"); 
    }
  },[date])

  return (
    <div>
      <AdminNav/>
      <div className='flex flex-col items-center justify-center mt-10'>
        <div>
          <label htmlFor="date" className='text-gray-600 font-semibold p-2'>Select Date:</label>
          <input type="date" name="date" id="date" className='border rounded py-2 px-4 border-gray-300 mb-4' value={date}  onChange={(e) => setDate(e.target.value) }/>
        </div>
        <Stats date={date}/>
        <div className='w-full my-6 p-3 md:my-4 md:p-14'>
          <VisitorsToday date={date}/>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard