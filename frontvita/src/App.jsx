import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Home from './Home'
import ProductsList from './Products'
import './App.css'
import Categories from './Categories'
import ProtectedRoute from './ProtectedRoute'
import Login from './Login'

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  return (
    <BrowserRouter>
      <div className='grid-container'>
        <Header OpenSidebar={OpenSidebar} />
        <Sidebar 
          openSidebarToggle={openSidebarToggle} 
          OpenSidebar={OpenSidebar}
        />
        
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<ProtectedRoute> <Home /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><ProductsList /></ProtectedRoute> } />
          <Route path="/categories" element={<ProtectedRoute> <Categories></Categories></ProtectedRoute> } />
          <Route path="/customers" element={<div>Customers</div>} />
          <Route path="/inventory" element={<div>Inventory</div>} />
          <Route path="/reports" element={<div>Reports</div>} />
          <Route path="/settings" element={<div>Settings</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App