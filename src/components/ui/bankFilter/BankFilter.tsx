import React from "react";
import "./BankFilter.css";

type Props = {
  banks: string[];
  selected: string;
  onChange: (bank: string) => void;
};

const BankFilter = ({ banks, selected, onChange }: Props) => {
  return (
    <div className="bank-filter">
      <label>Entidad bancaria</label>
      <div className="bank-filter__buttons">
        {banks.map((bank) => (
          <button
            key={bank}
            className={`bank-filter__button ${
              selected === bank ? "active" : ""
            }`}
            onClick={() => {
              if (selected === bank) {
                // Si ya está seleccionado, lo deselecciona
                onChange("");
              } else {
                // Si es otro, lo selecciona
                onChange(bank);
              }
            }}
          >
            {bank}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BankFilter;
