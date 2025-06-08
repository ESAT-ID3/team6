import { useState, useEffect } from "react";
import "./Budgets.css";
import info from "../../assets/icons/info-empty.png";
import { useUser } from "../../context/UserContext";
import userService from "../../services/firebase/userService";
import Header from "../../components/layout/header/Header";
import Pill from "../../components/ui/pills/Pill";
import DynamicTable from "../../components/ui/tables/DynamicTable";
import Button from "../../components/ui/button/Button";
import BudgetEditionModal from "../../components/ui/budgetEditionModal/BudgetEditionModal";
import PreviousBudgetModal from "../../components/ui/previousBudgetModal/PreviousBudgetModal";

const Budgets = () => {
  const { user } = useUser();
  const [totalSpend, setTotalSpend] = useState(0.0);
  const [totalLimit, setTotalLimit] = useState(0.0);
  const [totalSavings, setTotalSavings] = useState(0.0);

  const [spendCategories, setSpendCategories] = useState<string[]>([]);
  const [previousBudgets, setPreviousBudgets] = useState<any[]>([]);
  const [currentBudget, setCurrentBudget] = useState<{ category: string; limit: number; spend: number; savings: number }[]>([]);
  const [previousBudget, setPreviousBudget] = useState<{ category: string; limit: number; spend: number; savings: number }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const [currentMonthSpend, setCurrentMonthSpend] = useState<{ category: string; spend: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const categories = await userService.getSpendCategories();
      if (categories) setSpendCategories(categories);

      userService.getPreviousBudgets(user?.id).then((budgets) => {
        setPreviousBudgets(budgets || []);
      });

      userService.getCurrentMonthData(user?.id).then((data) => {
        setCurrentMonthSpend(data || []);
      })
    };

    fetchData();
  }, []);

  const handleInfoClick = (budget: any) => {
    let condition = isInfoOpen

    if (!condition) {
      let auxBudget : { category: string; limit: number; spend: number; savings: number }[] = [];
      budget.limits.forEach((limit: any) => {
        auxBudget.push({
          category: limit.category_name,
          limit: limit.category_limit,
          spend: limit.category_spend,
          savings: limit.category_limit - limit.category_spend
        });
      });
      setPreviousBudget(auxBudget);
    } else {
      setPreviousBudget([]);
    }

    setIsInfoOpen(!condition);
  }

  const updateBudget = (updatedBudget: { category: string; limit: number }[]) => {
    const auxBudget = updatedBudget.map((item) => {
        const spendItem = currentMonthSpend.find((s) => s.category === item.category);
        const spend = spendItem ? spendItem.spend : 0;
        const savings = item.limit - spend;

        return {
            category: item.category,
            limit: item.limit,
            spend,
            savings,
        };
    });

    setCurrentBudget(auxBudget);

    const totalSpend = auxBudget.reduce((acc, item) => acc + item.spend, 0);
    const totalLimit = auxBudget.reduce((acc, item) => acc + item.limit, 0);
    const totalSavings = totalLimit - totalSpend;
    
    let now = new Date();

    let data = {
        date: `${now.getMonth() + 1}/${now.getFullYear()}`,
        total_spend: totalSpend,
        total_limit: totalLimit,
        total_savings: totalSavings,
        limits: auxBudget
    }
    
    userService.storeCurrentBudget(user?.id, data).then(() => {
        console.log("Presupuesto actualizado en Firestore");
    });

    setTotalSpend(totalSpend);
    setTotalLimit(totalLimit);
    setTotalSavings(totalSavings);
  };


  return (
    <>
      <Header />
      <main className="budgets">
        <section className="current-budget">
          {currentBudget.length > 0 ? (
                <>
                    <div className="current-budget__pills">
                        <Pill value={String(totalLimit)} header="Límite de gasto" fullWidth={false} />
                        <Pill value={String(totalSpend)} header="Gasto actual" fullWidth={false} />
                        <Pill value={String(totalSavings)} header="Ahorro potencial" fullWidth={false} />
                    </div>
                    <div className="current-budget__table">
                        <DynamicTable
                            labels={["Categoría","Límite","Gasto","Ahorro"]}
                            data={currentBudget}
                        />
                    </div>
                </>
            ) : (
                <div className="current-budget__no-budget">
                    <p>No hay presupuesto actual establecido.</p>
                </div>
            )
          }
          <div className="current-budget__actions">
            <Button
              label="Editar Presupuesto"
              isDisabled={false}
              isFilter={false}
              variant="primary"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </section>
        <section className="budget-history">
          <div className="budget-history__gallery">
            <h5>Presupuestos anteriores</h5>
            {previousBudgets.map((budget, idx) => (
              <div key={idx} className="budget-history__gallery__item">
                <p>{budget.date}</p>
                <p>{budget.total_spend} / {budget.total_limit} €</p>
                <button className="budget-history__gallery__item__info" onClick={() => handleInfoClick(budget)}>
                  <img src={info} alt={`botón de información sobre presupuesto ${budget.date}`} />
                </button>

              </div>
            ))}
          </div>
        </section>
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <BudgetEditionModal
            currentBudget={currentBudget}
            onClose={() => setIsModalOpen(false)}
            categories={spendCategories}
            updateBudget={updateBudget}
          />
        </div>
      )}

      {isInfoOpen && (
        <div className="modal-overlay">
            <PreviousBudgetModal
            previousBudget={previousBudget}
            onClose={() => setIsInfoOpen(false)}
            updateBudget={updateBudget}
            />
        </div>
     )}

    </>
  );
};

export default Budgets;
