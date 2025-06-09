import React from "react";
import "./BackLink.css";

type Props = {
  onClick: () => void;
  label?: string;
};

const BackLink = ({ onClick, label = "Atrás" }: Props) => {
  return (
    <button className="back-link" onClick={onClick}>
      <span className="arrow">←</span>
      <span>{label}</span>
    </button>
  );
};

export default BackLink;
