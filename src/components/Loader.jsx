import React from 'react'

function Loader() {
  return (
    <div className="flex items-center justify-center h-screen">
        <div class="w-12 h-12 border-5 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
    </div>
  )
}

export default Loader