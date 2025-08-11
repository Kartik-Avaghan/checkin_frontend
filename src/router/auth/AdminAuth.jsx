import { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router';
import Loader from '../../components/Loader';

function AdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    
    const token = localStorage.getItem("token");

    if(!token){
      setLoading(false);
      navigate("/login")
      return;
    }
    
    if (token && token.startsWith("Bearer ")) {
      
      fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/verify-token`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }})
      .then((response) => {
        if (!response.ok) {
          throw new Error("Not authorized");
        }
        return response.text();
      }).then((data) => {
        const role = data.replace(/[\[\]"]+/g, '').trim();
        if( role === "ROLE_ADMIN" || role === "ROLE_SUPER_ADMIN") {
          setIsAdmin(true);
        } 
      })
      .catch((error) => {
        console.error("Error verifying token:", error);
        localStorage.removeItem("token");
        navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setIsAdmin(false);
      setLoading(false);
    }
  }, []);

  if (loading) return <Loader/>;

  return isAdmin ? <Outlet /> : <Navigate to="/login" />;
}

export default AdminAuth