import './Input.css'
import { useState } from 'react';

type InputProps = {
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
    const { headline, footer, beginningIcon, endingIcon, alternativeEndingIcon, isPassword, placeholder, onChange } = props;
    
    const [usedIcon, setUsedIcon] = useState(endingIcon);
    const [isVisible, setIsVisible] = useState(false);

    const handleVisibilityToggle = () => {
        if (!isPassword) return;
        setIsVisible(!isVisible);
        setUsedIcon(!isVisible ? alternativeEndingIcon : endingIcon);
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
                />
                {usedIcon && (
                    <div className="input-icon" onClick={handleVisibilityToggle} style={{ cursor: isPassword ? 'pointer' : 'default' }}>
                        <img src={isPassword ? usedIcon : endingIcon} alt="end icon" />
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
