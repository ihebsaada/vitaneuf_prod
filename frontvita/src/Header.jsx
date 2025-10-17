import React from 'react'
import 
 {BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify}
 from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

import { useState, useEffect } from 'react'
import logo from "./assets/vitalogo.png"; 
 
function Header({OpenSidebar}) {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem('authToken')));
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'authToken') {
        setLoggedIn(Boolean(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);
 
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/", { replace: true });
  };

  return (
    <header className='header'>
        <div className='menu-icon'>
            <BsJustify className='icon' onClick={OpenSidebar}/>
        </div>
        <div className='header-left'>
         
        </div>
        <div className='header-right'>
        <img src={logo}></img>
          
        </div>
        <div> 
   <button
        className='logout-button btn '
        onClick={handleLogout}
       style={{
          cursor: 'pointer',
          backgroundColor: '#8bfed0ff', // light gray background
          border: 'none',
          padding: '8px 12px',
          borderRadius: 6
        }}
        type="button"
      >
        Logout
      </button>
      </div>
    </header>
  )
}

export default Header