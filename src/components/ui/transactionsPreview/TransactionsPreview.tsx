import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import userService from "../../../services/firebase/userService";
import TransactionCard from "../transactionCard/TransactionCard";
import Button from "../button/Button";
import "./TransactionsPreview.css";
import { useNavigate } from "react-router-dom";

type Transaction = {
  id: string;
  icon: string;
  concept: string;
  amount: number;
  date: string;
  category: string;
};

const TransactionsPreview = () => {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      const userData = await userService.getBankInfo(user.id);
      const banks_info = userData?.bank_accounts;

      if (banks_info) {
        let parsed: Transaction[] = [];
        banks_info.forEach((bank: any) => {
          const aux = bank.data.map((item: any) => ({
            id: `${bank.bank_name}_${item.id}`,
            concept: item.business ?? "Sin concepto",
            amount: item.amount,
            date: item.date,
            icon: item.icon,
            category: item.category,
          }));
          parsed = [...parsed, ...aux];
        });

        parsed.sort((a, b) => {
          const [dayA, monthA, yearA] = a.date.split("/").map(Number);
          const [dayB, monthB, yearB] = b.date.split("/").map(Number);
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);
          return dateB.getTime() - dateA.getTime();
        });

        setTransactions(parsed.slice(0, 10));
      }
    };

    fetchTransactions();
  }, [user]);

  return (
    <div className="transactions-preview-container">
      <h2>Últimas transacciones</h2>
      <div className="transactions-list">
        {transactions.map((t) => (
          <TransactionCard
            key={t.id}
            icon={t.icon}
            concept={t.concept}
            date={t.date}
            amount={t.amount}
          />
        ))}
      </div>
      <div className="button-container">
        <Button
          label="Ver más"
          variant="secondary"
          isFullWidth={false}
          isDisabled={false}
          isFilter={false}
          onClick={() => navigate("/personal/transactions")}
        />
      </div>
    </div>
  );
};

export default TransactionsPreview;
