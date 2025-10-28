import { LandingPage } from "./components/LandingPage"
import  Login  from "./components/Login"
import Signup from "./components/Signup"  
import Dashboard from "./components/Dashboard"
import TicketManagement from "./components/TicketManagement"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets" element={<TicketManagement />} />
      </Routes>
    </Router>
  )
}

export default App
