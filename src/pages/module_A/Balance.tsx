import { useState, useEffect } from "react";
import Header from "../../components/layout/header/Header";
import StatisticsPreview from "../../components/ui/statisticsPreview/StatisticsPreview";
import TransactionsPreview from "../../components/ui/transactionsPreview/TransactionsPreview";
import MonthlyStatusPreview from "../../components/ui/monthlyStatusPreview/MonthlyStatusPreview";
import userService from "../../services/firebase/userService";
import { useUser } from "../../context/UserContext";
import "./Balance.css";
import Button from "../../components/ui/button/Button";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/layout/footer/Footer";

interface CategoryStatus {
  category: string;
  percent: number;
}

const Balance = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [monthlyData, setMonthlyData] = useState<CategoryStatus[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const currentData = await userService.getCurrentMonthData(user.id);
      const budgetData = await userService.getCurrentBudget(user.id);
      const balance = await userService.getTotalBalance(user.id);
      setTotalBalance(balance);

      if (currentData && budgetData) {
        const calculated = budgetData.map((budget) => {
          const spent =
            currentData.find((item) => item.category === budget.category)
              ?.spend || 0;
          const percent =
            budget.limit === 0
              ? 0
              : Math.min((spent / budget.limit) * 100, 100);
          return {
            category: budget.category,
            percent: Math.round(percent),
          };
        });
        setMonthlyData(calculated);
      }
    };

    fetchData();
  }, [user]);

  return (
    <>
      <Header />
      <div className="balance-container">
        <div className="balance-grid">
          <div className="balance-left">
            <div className="total-balance-card">
              <p>Saldo total:</p>
              <h1>{totalBalance.toFixed(2)}€</h1>
            </div>
            <div className="transactions-section">
              <TransactionsPreview />
              <div className="mobile-buttons">
                <Button
                  label="Ver estadísticas"
                  variant="secondary"
                  isDisabled={false}
                  isFilter={false}
                  isFullWidth={false}
                  onClick={() => navigate("/personal/stats")}
                />
                <Button
                  label="Ver presupuestos"
                  variant="secondary"
                  isDisabled={false}
                  isFilter={false}
                  isFullWidth={false}
                  onClick={() => navigate("/personal/budget")}
                />
              </div>
            </div>
          </div>

          <div className="balance-right">
            <div className="statistics-section">
              <StatisticsPreview />
            </div>

            <div className="budget-section">
              <MonthlyStatusPreview data={monthlyData} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Balance;
