import React, { useState } from 'react';
import './Accordion.css'; // Import your CSS file for styling

function Accordion({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="accordion-section">
        <button className={`accordion ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
          {title}
        </button>
        <div className={`panel ${isOpen ? 'open' : ''}`}>
          {children}
        </div>
      </div>
    );
  }

  export default Accordion