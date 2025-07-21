import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router';

function Auth() {
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Check saved token
    
    if (token && token.startsWith("Bearer ")) {
      // Here we just check existence, not server verification
      setIsStaff(true);
    } else {
      setIsStaff(false);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Optional loader while checking token
  }

  return isStaff ? <Outlet /> : <Navigate to="/" />;
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