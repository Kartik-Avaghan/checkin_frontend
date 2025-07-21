import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router';

function Auth() {
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
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
      }).then((data) => {
        const role = data.replace(/[\[\]"]+/g, '');
        if (role === "ROLE_STAFF") {
          setIsStaff(true);
        } else {
          setIsStaff(false);
        }
      })
      .catch((error) => {
        console.error("Error verifying token:", error);
        setIsStaff(false);
      })
      .finally(() => {
        setLoading(false);
      });

    } else {
      setIsStaff(false);
    }
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return isStaff ? <Outlet /> : <Navigate to="/login" />;
}

export default Auth;










// import React, { useState } from 'react'
// import { Navigate, Outlet } from 'react-router'
// import { useEffect } from 'react'

// function Auth() {
//     const [staff , setIsStaff] = useState(false)

//     useEffect(() => {
        
//     },[staff])

//   return (
//     <div>
//         { staff ? <Outlet/>  : <Navigate to={"/"} />}
//     </div>
//   )
// }

// export default Auth