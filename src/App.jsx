import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter } from 'react-router'
import CustomRouter from './router/CustomRouter'

function App() {

  return (
    <>
      <BrowserRouter>
        <CustomRouter/>
      </BrowserRouter>
    </>
  )
}

export default App
