import React, { useState } from "react";
import "./Datepicker.css";

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

interface DatepickerProps {
  onRangeChange?: (startDate: string, endDate: string) => void;
}

const Datepicker: React.FC<DatepickerProps> = ({ onRangeChange }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const formatDate = (date: Date) => {
    const day = `${date.getDate()}`.padStart(2, "0");
    const monthStr = `${date.getMonth() + 1}`.padStart(2, "0");
    const yearStr = date.getFullYear();
    return `${day}/${monthStr}/${yearStr}`;
  };

  const renderDays = () => {
    const days = [];
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      days.push(<div className="empty" key={`e-${i}`} />);
    }

    for (let d = 1; d <= lastDate; d++) {
      const current = new Date(year, month, d);
      const isSelected =
        current.getTime() === startDate?.getTime() ||
        current.getTime() === endDate?.getTime();

      const isInRange =
        startDate &&
        endDate &&
        current.getTime() > startDate.getTime() &&
        current.getTime() < endDate.getTime();

      const handleClick = () => {
        if (startDate?.getTime() === current.getTime() && !endDate) {
          setStartDate(null);
          onRangeChange?.("", "");
        } else if (endDate?.getTime() === current.getTime()) {
          setEndDate(null);
          onRangeChange?.(formatDate(startDate!), "");
        } else if (!startDate || (startDate && endDate)) {
          setStartDate(current);
          setEndDate(null);
          onRangeChange?.(formatDate(current), "");
        } else if (startDate && current > startDate) {
          setEndDate(current);
          onRangeChange?.(formatDate(startDate), formatDate(current));
        } else {
          setStartDate(current);
          setEndDate(null);
          onRangeChange?.(formatDate(current), "");
        }
      };

      days.push(
        <div
          key={d}
          className={`day ${isSelected ? "selected" : ""} ${
            isInRange ? "in-range" : ""
          }`}
          onClick={handleClick}
        >
          {d}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="datepicker always-visible">
      <div className="datepicker__header">
        {months[month]} {year}
      </div>

      <div className="selectors">
        <select value={month} onChange={(e) => setMonth(+e.target.value)}>
          {months.map((m, i) => (
            <option key={m} value={i}>
              {m}
            </option>
          ))}
        </select>
        <select value={year} onChange={(e) => setYear(+e.target.value)}>
          {Array.from({ length: 101 }, (_, i) => 1950 + i).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="weekdays">
        {["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="days">{renderDays()}</div>
    </div>
  );
};

export default Datepicker;
