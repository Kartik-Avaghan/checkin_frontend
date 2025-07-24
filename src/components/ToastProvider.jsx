import { Ban , CircleAlert } from 'lucide-react';
import { createContext , useContext , useState } from 'react'

const ToastContext = createContext();

export default function ToastProvider({children}) {

  const [toast , setToast] = useState([]);

  const addToast = (message , type) => {
    const id = Date.now();
    setToast([...toast, {id , message , type}]);
    setTimeout(() => {
      // Remove the toast after 3 seconds
      setToast((prev) => prev.filter((t) => t.id !== id)); 
    }, 3000);
  }

  function SetIcon(type){
    if(type === "success") {
      return <></>;
    } else if(type === "error") {
      return <Ban/>;
    } else {
      return <CircleAlert/>;
    }
  }

  return (
    <ToastContext.Provider value={{addToast}}>
      {children}

      <div className='fixed top-15 right-5 z-50 space-y-2'>
        { toast.map((toast) => (
          <div key={toast.id} className={`px-4 py-2 flex gap-2 shadow-sm rounded-md text-white font-semibold ${toast.type === "success" ? "bg-green-500" : toast.type === "error" ? "bg-red-500" : toast.type === "warning" ? "bg-yellow-500" :"bg-gray-700"}`}>
           {SetIcon(toast.type)} {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext);
