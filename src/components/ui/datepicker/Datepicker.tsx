import React, { useEffect, useRef, useState } from "react";
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
  onChange: (formattedDate: string) => void;
}

const Datepicker: React.FC<DatepickerProps> = ({ onChange }) => {
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [month, setMonth] = useState(selectedDate.getMonth());
  const [year, setYear] = useState(selectedDate.getFullYear());
  const ref = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date) => {
    const day = `${date.getDate()}`.padStart(2, "0");
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const renderDays = () => {
    const days = [];
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      days.push(<div className="empty" key={`e-${i}`} />);
    }

    for (let d = 1; d <= lastDate; d++) {
      const isSelected =
        d === selectedDate.getDate() &&
        month === selectedDate.getMonth() &&
        year === selectedDate.getFullYear();
      days.push(
        <div
          key={d}
          className={isSelected ? "selected" : ""}
          onClick={() => {
            const newDate = new Date(year, month, d);
            setSelectedDate(newDate);
            setShow(false);
            onChange(formatDate(newDate));
          }}
        >
          {d}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="container" ref={ref}>
      <input
        type="text"
        readOnly
        placeholder="Seleccione una fecha"
        onClick={() => setShow(true)}
        value={formatDate(selectedDate)}
        className="date-input"
      />
      {show && (
        <div className="datepicker">
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
      )}
    </div>
  );
};

export default Datepicker;
