import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Home from './Home'
import ProductsList from './Products'
import './App.css'
import Categories from './Categories'

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
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/categories" element={<Categories></Categories>} />
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