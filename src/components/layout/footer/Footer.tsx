import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/legal-notice">Aviso Legal</Link>
        <Link to="/privacy-policy">Política de Privacidad</Link>
      </div>
    </footer>
  );
};

export default Footer;
