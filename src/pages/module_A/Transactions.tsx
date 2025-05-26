import React, { useState, useEffect } from "react";
import "./Transactions.css";
import api from "../../services/firebase/firebaseTransactions";
import { useUser } from '../../context/UserContext';
import userService from "../../services/firebase/userService";
import Button from "../../components/ui/button/Button";
import Header from "../../components/layout/header/Header";
import TransactionCard from "../../components/ui/transactionCard/TransactionCard";

type Transaction = {
  id: string;
  icon: string;
  concept: string;
  amount: number;
  date: string;
};

const Transactions = () => {
  const { user } = useUser();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"income" | "expense">("income");

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      const userData = await userService.getBankInfo(user.id);
      const banks_info = userData?.bank_accounts;

      if (banks_info) {
        let parsed: any[] = [];
        banks_info.forEach((bank: any) => {
          let aux = bank.data.map((item: any) => ({
            id: `${bank.bank_name}_${item.id}`,
            concept: item.business ?? "Sin concepto",
            amount: item.amount,
            date: item.date,
            icon: item.icon,
          }));
          parsed = [...parsed, ...aux];
        });

        console.log(parsed);
        setTransactions(parsed);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    let result = [...transactions];

    if (tab === "income") result = result.filter((t) => t.amount > 0);
    if (tab === "expense") result = result.filter((t) => t.amount < 0);

    if (search) {
      result = result.filter((t) =>
        t.concept.toLowerCase().includes(search.toLowerCase())
      );
    }

    result.sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split("/").map(Number);
      const [dayB, monthB, yearB] = b.date.split("/").map(Number);

      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);

      return dateB.getTime() - dateA.getTime();
    });

    setFiltered(result);
  }, [tab, search, transactions]);

  console.log(filtered);

  return (
    <>
      <Header />
      <div className="transactions__wrapper">
        <div className="transactions__layout">
          {/* Columna izquierda */}
          <aside className="transactions__sidebar">
            <div className="transactions__sidebar-content">
              <h1 className="transactions__title">Transacciones</h1>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="transactions__search"
              />
            </div>
          </aside>

          {/* Columna derecha */}
          <main className="transactions__main">
            <div className="transactions__tabs">
              <Button
                label="Ingresos"
                variant="secondary"
                isFilter={true}
                isDisabled={false}
                isFullWidth={false}
                isActive={tab === "income"}
                onClick={() => setTab("income")}
              />
              <Button
                label="Gastos"
                variant="primary"
                isFilter={true}
                isDisabled={false}
                isFullWidth={false}
                isActive={tab === "expense"}
                onClick={() => setTab("expense")}
              />
            </div>

            <div className="transactions__list">
              {filtered.map((t) => (
                <TransactionCard
                  key={t.id}
                  icon={t.icon}
                  concept={t.concept}
                  date={t.date}
                  amount={t.amount}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Transactions;
