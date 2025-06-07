import { useState, useEffect } from "react";
import "./Budgets.css";
import { useUser } from "../../context/UserContext";
import userService from "../../services/firebase/userService";
import Header from "../../components/layout/header/Header";
import Pill from "../../components/ui/pills/Pill";

const Budgets = () => {
    const { user } = useUser();
    const [spendCategories, setSpendCategories] = useState<string[]>([]);
    const [previousBudgets, setPreviousBudgets] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const categories = await userService.getSpendCategories();
            if (categories) {
                setSpendCategories(categories);
            }

            userService.getPreviousBudgets(user?.id).then((budgets) => {
                setPreviousBudgets(budgets || []);
            });
        };

        fetchData();
    }, []);

    return (
        <>
            <Header></Header>
            <main className="budgets">
                <section className="current-budget">
                    <div className="current-budget__pills">
                        <Pill value="Pill 1" header="Current Limit" fullWidth={false} />
                        <Pill value="Pill 2" header="Current Spend" fullWidth={false} />
                        <Pill value="Pill 3" header="Potential Savings" fullWidth={false} />
                    </div>
                    <div className="current-budget__table">

                    </div>
                    <div className="current-budget__actions">

                    </div>
                </section>
                <section className="budget-history">
                    <div className='budget-history__gallery'>
                        <h5>Presupuestos anteriores</h5>
                        {previousBudgets.map((budget) => (
                            <div className="budget-history__gallery__item">
                                <p>{budget.date}</p>
                                <p>{budget.total_spend} / {budget.total_limit} €</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </>
    )
}

export default Budgets;