import React from "react";
import "./GaugeChart.css";

interface GaugeChartProps {
  label: string;
  value: number;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ label, value }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  // Colores según el valor
  const strokeColor =
    value >= 100
      ? "var(--main-purple)"
      : value <= 0
      ? "#e0e0e0"
      : "url(#gradient)";

  return (
    <div className="gauge-chart">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--main-blue)" />
            <stop offset="100%" stopColor="var(--main-purple)" />
          </linearGradient>
        </defs>

        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="transparent"
          stroke="#eee"
          strokeWidth="15"
        />
        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="transparent"
          stroke={strokeColor}
          strokeWidth="15"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
        <text x="65" y="70" textAnchor="middle" fontSize="20" fill="#222">
          {value}%
        </text>
      </svg>
      <p className="gauge-label">{label}</p>
    </div>
  );
};

export default GaugeChart;
