import './Input.css'
import { useState } from 'react';

type InputProps = {
    value?: string;
    headline?: string;
    footer?: string;
    beginningIcon?: string;
    endingIcon?: string;
    alternativeEndingIcon?: string;
    isPassword: boolean;
    placeholder: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = (props: InputProps) => {
    const {value, headline, footer, beginningIcon, endingIcon, alternativeEndingIcon, isPassword, placeholder, onChange } = props;
    const [isVisible, setIsVisible] = useState(false);

    const handleVisibilityToggle = () => {
        if (!isPassword) return;
        setIsVisible(!isVisible);
    }

    return (
        <div className="input-wrapper">
            {headline && (
                <div className='input-headline'>
                    <small>{headline}</small>
                </div>
            )}

            <div className="input-container">
                {beginningIcon && (
                    <div className="input-icon">
                        <img src={beginningIcon} alt="start icon" />
                    </div>
                )}
                <input
                    type={isPassword ? (isVisible ? "text" : "password") : "text"}
                    placeholder={placeholder}
                    onChange={onChange}
                    value={value ? value : ""}
                />
                {isPassword && endingIcon && alternativeEndingIcon && (
                    <div
                        className="input-icon"
                        onClick={handleVisibilityToggle}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src={isVisible ? alternativeEndingIcon : endingIcon} alt="toggle visibility" />
                    </div>
                )}
            </div>

            {footer && (
                <div className='input-footer'>
                    <small>{footer}</small>
                </div>
            )}
        </div>
    );
}

export default Input;
