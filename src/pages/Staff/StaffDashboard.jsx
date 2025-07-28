import { Link } from 'react-router'
import { Plus , CirclePlus , LogOut} from 'lucide-react'
import StaffNav from '../../components/Staff/StaffNav'
import CheckedinVisitors from '../../components/Staff/CheckedinVisitors'


function StaffDashboard() {
  return (
    <div>
      <StaffNav/>

      <div className='w-full h-[90vh] flex flex-col gap-20 items-center justify-center'>
        <Link to={"/checkin"}>
          <button className='bg-blue-500 text-white w-50 h-50 rounded-full shadow-lg shadow-blue-300 flex flex-col items-center justify-center gap-2 cursor-pointer'> <Plus size={50} /> Checkin </button>
        </Link>

        <Link to={"/checkout"}>
          <button className='bg-red-500 text-white w-50 h-50 rounded-full shadow-lg shadow-red-300 flex flex-col items-center justify-center gap-2 cursor-pointer'> <LogOut size={50} /> Check Out </button>
        </Link>
      </div>
        
    </div>
  )
}

export default StaffDashboard