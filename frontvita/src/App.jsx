import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Home from './Home'
import ProductsList from './Products'
import './App.css'
import Categories from './Categories'
import ProtectedRoute from './ProtectedRoute'
import Login from './Login'

// Inner component to use useLocation hook
function AppContent() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)
  const location = useLocation()

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("authToken")

  // Check if current route is login page
  const isLoginPage = location.pathname === "/"

  // Only show header and sidebar if user is logged in
  const showLayout = isLoggedIn && !isLoginPage

  return (
    <div className='grid-container'>
      {showLayout && <Header OpenSidebar={OpenSidebar} />}
      {showLayout && (
        <Sidebar
          openSidebarToggle={openSidebarToggle}
          OpenSidebar={OpenSidebar}
        />
      )}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><ProductsList /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute><div>Customers</div></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute><div>Inventory</div></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><div>Reports</div></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><div>Settings</div></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App