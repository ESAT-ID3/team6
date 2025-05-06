import Header from "../components/layout/header/Header";
import Button from "../components/ui/button/Button";

const Landing = () => {
    return (
        <>
            <Header></Header>
            <main>
                <Button label="Acceder" variant="primary" isDisabled={false} isFilter={false}></Button>
            </main>
        </>
    )
    
}

export default Landing;