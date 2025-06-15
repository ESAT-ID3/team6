import React, { useState, useRef, useEffect } from "react";
import "./DropdownMenu.css";

type DropdownMenuProps = {
  label: string;
  options: string[];
  onSelect: (value: string) => void;
  selected?: string; // opcional
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  label,
  options,
  onSelect,
  selected: controlledSelected,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState<string | undefined>(controlledSelected);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sincroniza con el valor del padre si está presente
  useEffect(() => {
    if (controlledSelected !== undefined) {
      setInternalSelected(controlledSelected);
    }
  }, [controlledSelected]);

  // Cerrar el dropdown si se clickea fuera
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
    if (controlledSelected === undefined) {
      setInternalSelected(option); // solo actualiza si es no controlado
    }
    onSelect(option);
    setIsOpen(false);
  };

  const selectedToShow = controlledSelected !== undefined ? controlledSelected : internalSelected;

  return (
    <div className="dm-container" ref={containerRef}>
      <button
        type="button"
        className="dm-button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedToShow || label}
        <span className={`dm-arrow ${isOpen ? "open" : ""}`} />
      </button>
      {isOpen && (
        <ul className="dm-options" role="listbox" tabIndex={-1}>
          {options.map((option) => (
            <li
              key={option}
              className={`dm-option ${
                selectedToShow === option ? "selected" : ""
              }`}
              onClick={() => handleOptionClick(option)}
              role="option"
              aria-selected={selectedToShow === option}
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
