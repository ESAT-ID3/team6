import { useState } from 'react';
import './Button.css'

interface ButtonProps {
    label: string;
    onClick?: () => void;
    isDisabled: boolean;
    isFilter: boolean;
    variant: 'primary' | 'secondary';
    isFullWidth?: boolean;
}

const Button = (props : ButtonProps) => {
    const { label, onClick = undefined, isDisabled, isFilter, variant, isFullWidth = undefined } = props;
    const [active, setActive] = useState(false);

    let className = isFilter ? (active ? `btn btn--primary` : `btn btn--secondary`) : `btn btn--${variant}`;

    if (isFullWidth) {
        className += ' btn--full';
    }

    const handleClick = () => {
        if (!isDisabled) {
            if (isFilter) {
                setActive(!active);
            }
            if (onClick) {
                onClick();
            }
        }
    }

    return (
        <button onClick={handleClick} disabled={isDisabled} className={className}>{label}</button>
    )
}

export default Button