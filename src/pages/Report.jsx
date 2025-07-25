import AdminNav from '../components/Admin/AdminNav';
import StaffNav from '../components/Staff/StaffNav'
import VisitorReport from '../components/Staff/VisitorReport'
import { useLocation } from 'react-router'

function Report() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div>
      {isAdmin ? <AdminNav/> : <StaffNav/>}
      <VisitorReport/>
    </div>
  )
}

export default Report