// librairies
// import { Routes, Route } from 'react-router-dom'
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
      {/* <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes> */}
      <Homepage/>
    </>
  )
}

export default App