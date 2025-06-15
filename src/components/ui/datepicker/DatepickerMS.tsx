import React from "react";
import "./DatepickerMS.css";

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
}

const DatepickerMS: React.FC<DatePickerProps> = ({ label, value, onChange }) => {
  return (
    <div className="dp-container">
      <label className="dp-label">{label}</label>
      <input
        type="date"
        className="dp-input"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
      />
    </div>
  );
};

export default DatepickerMS;
