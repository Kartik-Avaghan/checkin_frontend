import './App.css'

import { BrowserRouter } from 'react-router'
import CustomRouter from './router/CustomRouter'
import ToastProvider from './components/ToastProvider'

function App() {

  return (
    <>
      <ToastProvider>
        <BrowserRouter>
          <CustomRouter/>
        </BrowserRouter>
      </ToastProvider>
    </>
  )
}

export default App
