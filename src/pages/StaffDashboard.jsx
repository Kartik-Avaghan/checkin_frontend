import { Link } from 'react-router'

import StaffNav from '../components/Staff/StaffNav'
import CheckedinVisitors from '../components/Staff/CheckedinVisitors'



function StaffDashboard() {
  return (
    <div>
        <StaffNav/>

        <CheckedinVisitors/>
        
        <Link to={'/checkin'}>    
            <div className='w-full flex items-center justify-center p-4 fixed bottom-0 z-99'>
                <button  className=' mt-auto w-100 flex items-center justify-center gap-2 bg-sky-700  px-4 py-2 rounded-full transition cursor-pointer text-white hover:bg-black hover:text-white text-lg'> Add Visitor </button>
            </div>
        </Link>
    </div>
  )
}

export default StaffDashboard