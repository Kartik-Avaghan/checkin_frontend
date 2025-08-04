import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate , useLocation } from 'react-router';
import Loader from '../../components/Loader';

function Auth() {
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const location = useLocation();

  useEffect(() => {
    
    const token = localStorage.getItem("token");

    if(!token){
      setLoading(false);
      navigate("/login")
      return;
    }
    
    if (token && token.startsWith("Bearer ")) {
      
      fetch("http://localhost:8080/auth/verify-token", {
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
      })
      .then((data) => {
        const role = data.replace(/[\[\]"]+/g, '').trim();
        if( role === "ROLE_ADMIN" || role === "ROLE_SUPER_ADMIN") {
          navigate("/admin/dashboard");
        }
        if(role === "ROLE_STAFF") {
          setIsStaff(true);
        } else {
          setIsStaff(false);
        }
      })
      .catch((error) => {
        console.error("Error verifying token:", error);
        localStorage.removeItem("token");
        navigate("/login");
        setIsStaff(false);
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setIsStaff(false);
      setLoading(false);
    }
  }, []);

  if (loading) return <Loader/>;

  // const isAdminroute = location.pathname.startsWith("/admin");
  // if (isAdminroute && isStaff) {
  //   return <Navigate to="/" />;
  // }

  return isStaff ? <Outlet /> : <Navigate to="/login" />;
}

export default Auth;









