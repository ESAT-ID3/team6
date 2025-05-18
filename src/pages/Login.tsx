import './Login.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/firebase/userService';
import { useUser } from '../context/UserContext';
import Input from '../components/ui/input/Input';
import Button from '../components/ui/button/Button';
import user_icon from '../assets/icons/user.jpg';
import lock_icon from '../assets/icons/lock.jpg';
import visible_icon from '../assets/icons/eye.jpg';
import invisible_icon from '../assets/icons/eye-off.jpg';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dataError, setDataError] = useState(false);
    const { setUser } = useUser();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDataError(false);
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDataError(false);
        setPassword(e.target.value);
    }

    const handleLogin = async () => {
        const data = await userService.logIn(email, password);
        if (data !== null) {
            setDataError(false);
            setUser({
                id: data.id,
                email: data.email,
                password: data.password,
                name: data.name,
                surname: data.surname,
                role: data.role
            });
            if (data.role === 'admin' || data.role === 'dev') {
                navigate("/dev");
            }
        } else {
            setDataError(true);
        }
    }

    return (
        <div className="main-container">
            <div className="login-card">
                <div className="login-card__header">
                    <h2>Dashflow</h2>
                    <p>Tu aplicación de gestión financiera</p>
                </div>
                <div className="login-card__form">
                    <h5>LOGIN</h5>
                    <div className='login-card__form'>
                        <Input
                            placeholder="Introduzca su e-mail"
                            headline='Usuario'
                            beginningIcon={user_icon}
                            isPassword={false}
                            onChange={handleEmailChange}
                        />
                        <Input
                            placeholder="Introduzca su contraseña"
                            headline='Contraseña'
                            footer="Olvidé mi contraseña"
                            beginningIcon={lock_icon}
                            endingIcon={invisible_icon}
                            alternativeEndingIcon={visible_icon}
                            isPassword={true}
                            onChange={handlePasswordChange}
                        />
                        <Button
                            variant="secondary"
                            label="Iniciar sesión"
                            isDisabled={!email || !password}
                            isFilter={false}
                            isFullWidth={true}
                            onClick={handleLogin}
                        />
                    </div>
                    {dataError && (
                        <div className="login-error-message">
                            <small>Correo o contraseña incorrectos</small>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default Login;