import { useState } from "react";
import "./Button.css";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  isDisabled: boolean;
  isFilter: boolean;
  variant: "primary" | "secondary";
  isFullWidth?: boolean;
  active?: boolean;
}

const Button = (props: ButtonProps) => {
  const {
    label,
    onClick = undefined,
    isDisabled,
    isFilter,
    variant,
    isFullWidth = undefined,
    active = false,
  } = props;

  let className = isFilter
    ? `btn ${active ? "btn--primary" : "btn--secondary"}`
    : `btn btn--${variant}`;

  if (isFullWidth) {
    className += " btn--full";
  }

  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  return (
    <button onClick={handleClick} disabled={isDisabled} className={className}>
      {label}
    </button>
  );
};

export default Button;
