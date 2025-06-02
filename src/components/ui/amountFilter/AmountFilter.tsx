import React from "react";
import "./AmountFilter.css";

type Props = {
  min: number | "";
  max: number | "";
  onChange: (min: number | "", max: number | "") => void;
};

const AmountFilter = ({ min, max, onChange }: Props) => {
  return (
    <div className="amount-filter">
      <div className="amount-filter__title">Importe</div>
      <div className="amount-filter__inputs">
        <div className="amount-filter__group">
          <span className="amount-filter__text">Máx</span>
          <div className="amount-filter__input-wrapper">
            <input
              type="number"
              placeholder="XXXX,XX"
              value={max}
              onChange={(e) =>
                onChange(
                  min,
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
            <span className="amount-filter__text">€</span>
          </div>
        </div>
        <div className="amount-filter__group">
          <span className="amount-filter__text">Mín</span>
          <div className="amount-filter__input-wrapper">
            <input
              type="number"
              placeholder="XXXX,XX"
              value={min}
              onChange={(e) =>
                onChange(
                  e.target.value === "" ? "" : Number(e.target.value),
                  max
                )
              }
            />
            <span className="amount-filter__text">€</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmountFilter;
