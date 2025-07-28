import { Link } from 'react-router'
import { Plus } from 'lucide-react'
import StaffNav from '../../components/Staff/StaffNav'
import CheckedinVisitors from '../../components/Staff/CheckedinVisitors'

function CheckedInVisitors() {
  return (
    <div>
        <StaffNav/>
        <CheckedinVisitors/>

        <Link to={'/checkin'}>    
            <div className='w-full flex items-center justify-center p-4 fixed bottom-0 z-50'>
              <button  className='font-semibold mt-auto w-100 flex items-center justify-center gap-2 bg-sky-700  px-4 py-3 rounded-full transition cursor-pointer text-white hover:bg-black hover:text-white text-lg'> <Plus/>  Add Visitor </button>
            </div>
        </Link>

    </div>
  )
}

export default CheckedInVisitors