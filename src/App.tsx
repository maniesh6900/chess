import { BrowserRouter, Route, Routes } from 'react-router-dom'

import LandingPage from './screen/LandingPage'
import Game from './screen/Game'


function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />}/>
      <Route path="/game" element={<Game />} />
    </Routes>
  </BrowserRouter>
      
    </>
  )
}

export default App
