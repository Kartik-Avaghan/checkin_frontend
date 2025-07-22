import React from 'react'

function Loader() {
  return (
    <div className="flex absolute top-0 items-center justify-center h-screen opacity-75 bg-white w-full">
      <div class="w-12 h-12 border-5 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
    </div>
  )
}

export default Loader