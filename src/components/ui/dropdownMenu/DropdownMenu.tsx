import React, { useState, useRef, useEffect } from "react";
import "./DropdownMenu.css";

type DropdownMenuProps = {
  label: string;
  options: string[];
  onSelect: (value: string) => void;
  selected?: string;
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  label,
  options,
  onSelect,
  selected: controlledSelected,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // Estado interno para el valor seleccionado
  const [selected, setSelected] = useState<string | undefined>(controlledSelected);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sincronizar si el padre cambia el selected
  useEffect(() => {
    setSelected(controlledSelected);
  }, [controlledSelected]);

  // Cerrar dropdown al clicar fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option: string) => {
    setSelected(option);       // Actualizo internamente
    onSelect(option);          // Notifico al padre
    setIsOpen(false);
  };

  return (
    <div className="dm-container" ref={containerRef}>
      <button
        type="button"
        className="dm-button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selected || label}
        <span className={`dm-arrow ${isOpen ? "open" : ""}`} />
      </button>
      {isOpen && (
        <ul className="dm-options" role="listbox" tabIndex={-1}>
          {options.map((option) => (
            <li
              key={option}
              className={`dm-option ${
                selected === option ? "selected" : ""
              }`}
              onClick={() => handleOptionClick(option)}
              role="option"
              aria-selected={selected === option}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleOptionClick(option);
                }
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
