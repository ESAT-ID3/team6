import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Header from "../components/layout/header/Header";
import Button from "../components/ui/button/Button";

const Landing = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    }

    return (
        <>
            <Header></Header>
            <main>
                {user ? (
                    <div className="welcome-message">
                        <h1>Bienvenido de nuevo, {user.name}!</h1>
                        <p>Estamos felices de que estés aquí.</p>   
                    </div>
                ) : (
                    <Button label="Acceder" variant="primary" isDisabled={false} isFilter={false} onClick={handleLogin}></Button>
                )}
            </main>
        </>
    )
    
}

export default Landing;