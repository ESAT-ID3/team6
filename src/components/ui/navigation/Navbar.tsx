import './Navbar.css'
import menuIcon from '../../../assets/menu.png'
import { Link } from "react-router-dom";
import AccordionItem from '../../ui/button/Accordion';
import { useState } from 'react';

function Navbar() {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  return (
    <>
      <nav className="nav-highres">
          <div className="nav-item">
              <Link to="/dev" className='nav-link'>Dev Mode</Link>
          </div>
          <div className="nav-item"> 
              <Link to="/" className='nav-link'>Home</Link>
          </div>
          <div className="nav-item"> 
              <Link to="/user" className='nav-link'>Mi Perfil</Link>
          </div>
          <div className="nav-item dropdown">
            <span className="nav-link">Finanzas personales ▼</span>
            <div className="dropdown-menu">
              <Link to="/personal/balance" className="dropdown-link">Balance general</Link>
              <Link to="/personal/transactions" className="dropdown-link">Transacciones</Link>
              <Link to="/personal/stats" className="dropdown-link">Estadísticas</Link>
              <Link to="/personal/budget" className="dropdown-link">Presupuestos</Link>
            </div>
          </div>
          <div className="nav-item dropdown">
            <span className="nav-link">Inversión ▼</span>
            <div className="dropdown-menu">
              <Link to="/finance/portfolio" className="dropdown-link">Mi Cartera</Link>
              <Link to="/finance/market" className="dropdown-link">Mercado Financiero</Link>
              <Link to="/finance/news" className="dropdown-link">Actualidad</Link>
              <Link to="/finance/wiki" className="dropdown-link">Wiki-Finance</Link>
            </div>
          </div>
      </nav>

      <nav className='nav-lowres'>
        <button onClick={() => setIsOffcanvasOpen(true)}><img src={menuIcon} alt="" /></button>
        <div className={`offcanvas ${isOffcanvasOpen ? 'show' : ''}`}>
          <div className='offcanvas-header'>
            <button onClick={() => setIsOffcanvasOpen(false)}><img src={menuIcon} alt="" /></button>
          </div>
          <div className='offcanvas-body'>            
            <Link to="/dev" className='nav-link'>Dev Mode</Link>
            <Link to="/" className='nav-link'>Home</Link>
            <Link to="/user" className='nav-link'>Mi Perfil</Link>
            <AccordionItem title="Finanzas personales">
              <Link to="/personal/balance" className='nav-link'>Balance general</Link><br />
              <Link to="/personal/transactions" className='nav-link'>Transacciones</Link><br />
              <Link to="/personal/stats" className='nav-link'>Estadísticas</Link><br />
              <Link to="/personal/budget" className='nav-link'>Presupuestos</Link>
            </AccordionItem>
            <AccordionItem title="Inversión">
              <Link to="/finance/portfolio" className='nav-link'>Mi Cartera</Link><br />
              <Link to="/finance/market" className='nav-link'>Mercado Financiero</Link><br />
              <Link to="/finance/news" className='nav-link'>Actualidad</Link><br />
              <Link to="/finance/wiki" className='nav-link'>Wiki-Finance</Link>
            </AccordionItem>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;