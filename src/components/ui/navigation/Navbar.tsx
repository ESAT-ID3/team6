import './Navbar.css'
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
        <div>
            <Link to="/dev" className='nav-link'>Dev Mode</Link>
        </div>
        <div>
            <Link to="/" className='nav-link'>Home</Link>
        </div>
    </nav>
  );
}

export default Navbar;