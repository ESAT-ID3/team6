import "./Navbar.css";
import menuIcon from "../../../assets/icons/menu.png";
import { Link, useNavigate } from "react-router-dom";
import AccordionItem from "../../ui/button/Accordion";
import { useState } from "react";
import { useUser } from "../../../context/UserContext";

function Navbar() {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const { user, logOut } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate("/login");
  };

  const isLoggedIn = user !== null;
  const role = user?.role;

  const isSuperUser = role === "admin" || role === "dev";
  const isFullService = role === "full-service";

  const canSeeDev = isSuperUser;
  const canSeePersonal = isSuperUser || isFullService;
  const canSeeInvest = isLoggedIn;

  return (
    <>
      <nav className="nav-highres">
        {canSeeDev && (
          <div className="nav-item">
            <Link to="/dev" className="nav-link">
              Dev Mode
            </Link>
          </div>
        )}
        {isLoggedIn && (
          <>
            {canSeePersonal && (
              <div className="nav-item dropdown">
                <span className="nav-link">Finanzas personales ▼</span>
                <div className="dropdown-menu">
                  <Link to="/personal/balance" className="dropdown-link">
                    Balance general
                  </Link>
                  <Link to="/personal/transactions" className="dropdown-link">
                    Transacciones
                  </Link>
                  <Link to="/personal/stats" className="dropdown-link">
                    Estadísticas
                  </Link>
                  <Link to="/personal/budget" className="dropdown-link">
                    Presupuestos
                  </Link>
                </div>
              </div>
            )}
            {canSeeInvest && (
              <div className="nav-item dropdown">
                <span className="nav-link">Inversión ▼</span>
                <div className="dropdown-menu">
                  {/* <Link to="/finance/portfolio" className="dropdown-link">
                    Mi Cartera
                  </Link> */}
                  <Link to="/finance/market" className="dropdown-link">
                    Mercado Financiero
                  </Link>
                  <Link to="/finance/news" className="dropdown-link">
                    Actualidad
                  </Link>
                  {/* <Link to="/finance/wiki" className="dropdown-link">
                    Wiki-Finance
                  </Link> */}
                </div>
              </div>
            )}
            {/* <div className="nav-item">
              <Link to="/user" className="nav-link">
                Mi Perfil
              </Link>
            </div> */}
            <div className="nav-item">
              <button className="logout-button" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          </>
        )}
      </nav>

      <nav className="nav-lowres">
        <button onClick={() => setIsOffcanvasOpen(true)}>
          <img src={menuIcon} alt="" />
        </button>
        <div className={`offcanvas ${isOffcanvasOpen ? "show" : ""}`}>
          <div className="offcanvas-header">
            <button onClick={() => setIsOffcanvasOpen(false)}>
              <img src={menuIcon} alt="" />
            </button>
          </div>
          <div className="offcanvas-body">
            {canSeeDev && (
              <Link to="/dev" className="nav-link">
                Dev Mode
              </Link>
            )}
            {isLoggedIn && (
              <>
                {/* <Link to="/user" className="nav-link">
                  Mi Perfil
                </Link> */}
                {canSeePersonal && (
                  <AccordionItem title="Finanzas personales">
                    <Link to="/personal/balance" className="nav-link">
                      Balance general
                    </Link>
                    <br />
                    <Link to="/personal/transactions" className="nav-link">
                      Transacciones
                    </Link>
                    <br />
                    <Link to="/personal/stats" className="nav-link">
                      Estadísticas
                    </Link>
                    <br />
                    <Link to="/personal/budget" className="nav-link">
                      Presupuestos
                    </Link>
                  </AccordionItem>
                )}
                {canSeeInvest && (
                  <AccordionItem title="Inversión">
                    {/* <Link to="/finance/portfolio" className="nav-link">
                      Mi Cartera
                    </Link> */}
                    <br />
                    <Link to="/finance/market" className="nav-link">
                      Mercado Financiero
                    </Link>
                    <br />
                    <Link to="/finance/news" className="nav-link">
                      Actualidad
                    </Link>
                    <br />
                    {/* <Link to="/finance/wiki" className="nav-link">
                      Wiki-Finance
                    </Link> */}
                  </AccordionItem>
                )}
              </>
            )}
          </div>

          <div className="offcanvas-footer">
            <Link to="/legalnotice" className="footer-link">
              Aviso legal
            </Link>
            <Link to="/privacypolicy" className="footer-link">
              Política de privacidad
            </Link>
            <button className="logout-mobile" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
