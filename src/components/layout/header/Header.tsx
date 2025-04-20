import './Header.css'
import Navbar from "../../ui/navigation/Navbar"

const Header = () => {
    return (
        <header>
            <div className='header-contents'>
                <h4>Dashflow</h4>
            </div>
            <div className='header-contents'>
                <Navbar />
            </div>
        </header>
    )
}

export default Header;