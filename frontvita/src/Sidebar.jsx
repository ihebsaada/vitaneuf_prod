import React from 'react'
import { Link } from 'react-router-dom'
import { BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsListCheck, BsMenuButtonWideFill, BsFillGearFill }
    from 'react-icons/bs'
import vitaneufLogo from './assets/vitalogo.png';

function Sidebar({openSidebarToggle, OpenSidebar}) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <img src={vitaneufLogo} alt="Vitaneuf Logo" className="shop-logo" />
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>

        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
                <Link to="/Home">
                    <BsGrid1X2Fill className='icon'/> Dashboard
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/products">
                    <BsFillArchiveFill className='icon'/> Products
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/categories">
                    <BsFillGrid3X3GapFill className='icon'/> Categories
                </Link>
            </li>
         {/*   <li className='sidebar-list-item'>
                <Link to="/customers">
                    <BsPeopleFill className='icon'/> Customers
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/inventory">
                    <BsListCheck className='icon'/> Inventory
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/reports">
                    <BsMenuButtonWideFill className='icon'/> Reports
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/settings">
                    <BsFillGearFill className='icon'/> Setting
                </Link>
            </li> */}
        </ul>
    </aside>
  )
}

export default Sidebar