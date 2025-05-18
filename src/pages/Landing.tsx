import { useNavigate } from "react-router-dom";
import Header from "../components/layout/header/Header";
import Button from "../components/ui/button/Button";

const Landing = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    }

    return (
        <>
            <Header></Header>
            <main>
                <Button label="Acceder" variant="primary" isDisabled={false} isFilter={false} onClick={handleLogin}></Button>
            </main>
        </>
    )
    
}

export default Landing;