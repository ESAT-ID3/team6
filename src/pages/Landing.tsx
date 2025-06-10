import React, { useEffect } from "react";
import "./Landing.css"; // Assuming you have a CSS file for styles
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Landing: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();
  useEffect(() => {
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const navMenu = document.querySelector(".nav-menu");

    const handleMenuToggle = () => {
      navMenu?.classList.toggle("active");
      mobileMenuBtn?.classList.toggle("active");
    };

    mobileMenuBtn?.addEventListener("click", handleMenuToggle);

    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(
        (e.currentTarget as HTMLAnchorElement).getAttribute("href") || ""
        );
        if (target) {
        target.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
        }
    });
    });

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    document
      .querySelectorAll(
        ".feature-card, .benefits-text, .benefits-visual, .download-content"
      )
      .forEach((el) => {
        observer.observe(el);
      });

    const handleScroll = () => {
      const navbar = document.querySelector(".navbar");
      if (window.scrollY > 50) {
        navbar?.classList.add("scrolled");
      } else {
        navbar?.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    window.addEventListener("load", () => {
      document.body.classList.add("loaded");
    });

    return () => {
      mobileMenuBtn?.removeEventListener("click", handleMenuToggle);
      window.removeEventListener("scroll", handleScroll);
      // Removing listeners for anchors and observer not trivial; omitted for brevity
    };
  }, []);

  return (
    <div className="landing-page">
      <header className="navbar">
        <div className="nav-container">
          <div className="logo">
            <div className="logo-icon">💳</div>
            <span>DashFlow</span>
          </div>
          <nav className="nav-menu">
            <a href="#features">Características</a>
            <a href="#benefits">Beneficios</a>
            <a href="#download">Descargar</a>
          </nav>
          <div className="nav-actions">
            <button className="login-btn" onClick={() => navigate("/login")}>Iniciar Sesión</button>
            <a href="#download" className="cta-btn">
              Descargar App
            </a>
            <button className="mobile-menu-btn" aria-label="Menú">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>
      <section className="hero">
        <div className="hero-background-effects">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              La mejor forma de <span className="gradient-text">gestionar</span>{" "}
              tus <span className="gradient-text">finanzas</span>
            </h1>
            <p className="hero-subtitle">
              Controla tus gastos, ahorra inteligentemente y alcanza tus metas
              financieras con la app bancaria más avanzada del mercado.
            </p>
            <div className="hero-actions">
              <a href="#download" className="cta-btn primary">
                <span>Descargar Gratis</span>
                <span className="btn-shine"></span>
              </a>
              <button className="play-btn">
                <span className="play-icon">▶</span> Ver Demo
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">500K+</span>
                <span className="stat-label">Usuarios activos</span>
              </div>
              <div className="stat">
                <span className="stat-number">€2.5B+</span>
                <span className="stat-label">Gestionado</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.9★</span>
                <span className="stat-label">Rating</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="phone-mockup">
              <div className="phone-screen">
                <div className="app-ui">
                  <div className="status-bar">
                    <span>9:41</span>
                    <span>🔋100%</span>
                  </div>
                  <div className="app-header">
                    <h3>Mi Cuenta</h3>
                    <div className="balance">€2,450.00</div>
                  </div>
                  <div className="quick-actions">
                    <div className="action-btn">📤 Enviar</div>
                    <div className="action-btn">📥 Recibir</div>
                    <div className="action-btn">💳 Pagar</div>
                  </div>
                  <div className="transactions">
                    <div className="transaction">
                      <div className="transaction-icon">🛒</div>
                      <div className="transaction-details">
                        <div className="transaction-info">
                          <span className="transaction-name">Supermercado</span>
                          <span className="transaction-date">Hoy, 14:30</span>
                        </div>
                        <span className="transaction-amount negative">
                          -€45.20
                        </span>
                      </div>
                    </div>
                    <div className="transaction">
                      <div className="transaction-icon">💰</div>
                      <div className="transaction-details">
                        <div className="transaction-info">
                          <span className="transaction-name">Salario</span>
                          <span className="transaction-date">Ayer, 09:00</span>
                        </div>
                        <span className="transaction-amount positive">
                          +€2,500.00
                        </span>
                      </div>
                    </div>
                    <div className="transaction">
                      <div className="transaction-icon">☕</div>
                      <div className="transaction-details">
                        <div className="transaction-info">
                          <span className="transaction-name">Starbucks</span>
                          <span className="transaction-date">Ayer, 08:15</span>
                        </div>
                        <span className="transaction-amount negative">
                          -€4.50
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="floating-cards">
              <div className="floating-card card-1">
                <div className="card-content">
                  <span className="card-label">💰 Ahorro Mensual</span>
                  <span className="card-value">+€350</span>
                </div>
              </div>
              <div className="floating-card card-2">
                <div className="card-content">
                  <span className="card-label">💸 Gastos</span>
                  <span className="card-value">-€1,200</span>
                </div>
              </div>
              <div className="floating-card card-3">
                <div className="card-content">
                  <span className="card-label">📈 Inversiones</span>
                  <span className="card-value">+€125</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2>Características que te encantarán</h2>
            <p>Todo lo que necesitas para gestionar tu dinero de forma inteligente</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Análisis Inteligente</h3>
              <p>Obtén insights detallados sobre tus hábitos de gasto con IA avanzada</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Seguridad Total</h3>
              <p>Protección bancaria de nivel militar con encriptación de extremo a extremo</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Transferencias Instantáneas</h3>
              <p>Envía y recibe dinero al instante sin comisiones ocultas</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Metas de Ahorro</h3>
              <p>Define objetivos y recibe consejos personalizados para alcanzarlos</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Tarjetas Virtuales</h3>
              <p>Crea tarjetas virtuales para compras online seguras</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>App Multiplataforma</h3>
              <p>Accede desde cualquier dispositivo con sincronización automática</p>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="benefits">
        <div className="container">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2>Las ventajas están al alcance de tu mano</h2>
              <p>El poder de distribuir tu dinero entre múltiples cuentas mientras solo gestionas una.</p>
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">✓</div>
                  <span>Sin comisiones por mantenimiento</span>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">✓</div>
                  <span>Hasta 2.53% APR en ahorros</span>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">✓</div>
                  <span>Soporte 24/7 en español</span>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">✓</div>
                  <span>Cashback en todas tus compras</span>
                </div>
              </div>
              <a href="#download" className="cta-btn secondary">
                <span>Comenzar Ahora</span>
                <span className="btn-shine"></span>
              </a>
            </div>
            <div className="benefits-visual">
              <div className="dashboard-preview">
                <div className="dashboard-header">
                  <h3>Panel de Control</h3>
                  <span className="notification">3</span>
                </div>
                <div className="balance-cards">
                  <div className="balance-card primary">
                    <span className="card-title">Cuenta Principal</span>
                    <span className="card-balance">€2,450.00</span>
                    <div className="card-trend">📈 +2.5%</div>
                  </div>
                  <div className="balance-card secondary">
                    <span className="card-title">Ahorros</span>
                    <span className="card-balance">€5,230.50</span>
                    <div className="card-trend">📈 +1.8%</div>
                  </div>
                </div>
                <div className="chart-container">
                  <div className="chart-bar" style={{ height: "60%" }}></div>
                  <div className="chart-bar" style={{ height: "80%" }}></div>
                  <div className="chart-bar" style={{ height: "40%" }}></div>
                  <div className="chart-bar" style={{ height: "90%" }}></div>
                  <div className="chart-bar" style={{ height: "70%" }}></div>
                  <div className="chart-bar" style={{ height: "55%" }}></div>
                  <div className="chart-bar" style={{ height: "85%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="download" className="download">
        <div className="container">
          <div className="download-content">
            <h2>Mejora tu gestión financiera hoy</h2>
            <p>
              Haz crecer tu dinero con hasta 2.53% APR pagado diariamente en tus
              ahorros y ahorra sin comisiones ni penalizaciones.
            </p>
            <div className="download-options">
              <a href="#" className="download-btn ios">
                <div className="download-icon">📱</div>
                <div className="download-text">
                  <span>Descargar en</span>
                  <strong>App Store</strong>
                </div>
              </a>
              <a href="#" className="download-btn android">
                <div className="download-icon">🤖</div>
                <div className="download-text">
                  <span>Consíguelo en</span>
                  <strong>Google Play</strong>
                </div>
              </a>
            </div>
            <div className="trust-indicators">
              <div className="trust-item">
                <span className="trust-icon">🔐</span>
                <span>Banco de España</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🛡️</span>
                <span>SSL Seguro</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🏆</span>
                <span>Premio Fintech 2024</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
