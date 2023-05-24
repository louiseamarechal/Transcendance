// librairies
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React from 'react'

// TypeScript
import WelcomePage from './pages/WelcomePage.tsx'

// CSS
import './style/components/buttons.css'
import './style/pages/color.css'
import './style/pages/App.css'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
      </Routes>
    </BrowserRouter>
      {/* <Homepage/> */}
    </>
  )
}

export default App