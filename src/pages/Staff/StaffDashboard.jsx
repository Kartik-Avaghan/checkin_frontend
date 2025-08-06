import { Link } from 'react-router'
import { Plus , LogOut , Calendar , Clock} from 'lucide-react'
import StaffNav from '../../components/Staff/StaffNav'
import { useState , useEffect } from 'react'

function StaffDashboard() {

  const [currentTime, setCurrentTime] = useState(new Date());
    
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval); 
  }, []);

  return (
    <div>
      <StaffNav/>

      <div className='w-full h-[70vh] flex flex-col gap-8 items-center justify-start mt-6'>

        <div className='flex flex-wrap p-2'>
          <h6 className='flex items-center gap-2 text-sm text-zinc-500'><Calendar size={16}/> {currentTime.toLocaleString('en-IN', {dateStyle: 'medium', timeStyle: 'short', })} </h6>
        </div>

        <Link to={"/checkin"}>
          <button className='bg-blue-500 text-white w-50 h-50 rounded-full shadow-lg shadow-blue-300 flex flex-col items-center justify-center gap-2 cursor-pointer'> <Plus size={50} /> Checkin </button>
        </Link>

        <Link to={"/checkout"}>
          <button className='bg-red-500 text-white w-50 h-50 rounded-full shadow-lg shadow-red-300 flex flex-col items-center justify-center gap-2 cursor-pointer'> <LogOut size={50} /> Check Out </button>
        </Link>
        <h6 className='text-sm text-center text-zinc-400'>Developed By Thincknext</h6>
      </div>
      
    </div>
  )
}

export default StaffDashboard