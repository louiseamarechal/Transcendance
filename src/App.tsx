// librairies
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React from 'react'

// TypeScript
import Homepage from './pages/HomePage.tsx'

// CSS
import './components/style/buttons.css'
import './components/style/color.css'
import './App.css'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
      {/* <Homepage/> */}
    </>
  )
}

export default App