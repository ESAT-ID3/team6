// components/ui/pill/Pill.tsx
import React from "react";
import "./Pill.css";

export interface PillProps {
  value: string;
  header?: string;
  fullWidth?: boolean;
  className?: string;
}

const Pill: React.FC<PillProps> = ({ value, header, fullWidth = false, className = "" }) => {
  const baseClass = `pill ${fullWidth ? "pill--full" : ""} ${className}`.trim();

  return (
    <div className={baseClass}>
      {header && <div className="pill__header">{header}</div>}
      <div className="pill__value">{value}</div>
    </div>
  );
};

export default Pill;
