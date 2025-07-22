import React from "react";
import { Link } from "react-router";

function NotFound() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen text-center ">
        <div className="flex flex-col items-center text-2xl font-bold">
            <strong className="text-6xl text-blue-500 font-bold">404</strong>
            <span>Not Found</span>
        </div>
        <Link to="/">
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-blue-600 transition-all">Back to Home</button> </Link>
      </div>
    </div>
  );
}

export default NotFound;
