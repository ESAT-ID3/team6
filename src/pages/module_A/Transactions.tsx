import { useState, useEffect } from "react";
import "./Transactions.css";
import { useUser } from "../../context/UserContext";
import userService from "../../services/firebase/userService";
import Button from "../../components/ui/button/Button";
import Header from "../../components/layout/header/Header";
import Footer from "../../components/layout/footer/Footer";
import TransactionCard from "../../components/ui/transactionCard/TransactionCard";
import BankFilter from "../../components/ui/bankFilter/BankFilter";
import CategoryFilter from "../../components/ui/categoryFilter/CategoryFilter";
import AmountFilter from "../../components/ui/amountFilter/AmountFilter";
import Datepicker from "../../components/ui/datepicker/Datepicker";
import FilterModal from "../../components/ui/filterModal/FilterModal";

type Transaction = {
  id: string;
  icon: string;
  concept: string;
  amount: number;
  date: string;
  category: string;
};

type Category = {
  name: string;
  icon: string;
};

const Transactions = () => {
  const { user } = useUser();
  console.log("USER:", user);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"income" | "expense">("income");
  const [minAmount, setMinAmount] = useState<number | "">("");
  const [maxAmount, setMaxAmount] = useState<number | "">("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [bankList, setBankList] = useState<string[]>([]);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      const userData = await userService.getBankInfo(user.id);
      console.log("USER DATA:", userData);
      console.log("BANK ACCOUNTS:", userData?.bank_accounts);
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
            category: item.category,
          }));
          parsed = [...parsed, ...aux];
        });

        const uniqueCategoriesMap = new Map<string, string>();
        parsed.forEach((item) => {
          if (item.category && item.icon) {
            uniqueCategoriesMap.set(item.category, item.icon);
          }
        });

        const categoryArray = Array.from(uniqueCategoriesMap.entries()).map(
          ([name, icon]) => ({ name, icon })
        );

        setCategories(categoryArray);
        console.log("PARSED TRANSACTIONS:", parsed);
        setTransactions(parsed);

        const bankNames = banks_info.map((bank: any) => bank.bank_name);
        setBankList(bankNames);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    let result = [...transactions];

    if (tab === "income") result = result.filter((t) => t.amount > 0);
    if (tab === "expense") result = result.filter((t) => t.amount < 0);

    if (minAmount !== "") {
      result = result.filter((t) =>
        tab === "expense"
          ? t.amount <= -Math.abs(minAmount)
          : t.amount >= minAmount
      );
    }

    if (maxAmount !== "") {
      result = result.filter((t) =>
        tab === "expense"
          ? t.amount >= -Math.abs(maxAmount)
          : t.amount <= maxAmount
      );
    }

    if (search) {
      result = result.filter((t) =>
        t.concept.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (startDate) {
      result = result.filter((t) => {
        const [day, month, year] = t.date.split("/").map(Number);
        const txDate = new Date(year, month - 1, day);
        const [sDay, sMonth, sYear] = startDate.split("/").map(Number);
        const sDate = new Date(sYear, sMonth - 1, sDay);
        return txDate >= sDate;
      });
    }

    if (endDate) {
      result = result.filter((t) => {
        const [day, month, year] = t.date.split("/").map(Number);
        const txDate = new Date(year, month - 1, day);
        const [eDay, eMonth, eYear] = endDate.split("/").map(Number);
        const eDate = new Date(eYear, eMonth - 1, eDay);
        return txDate <= eDate;
      });
    }

    if (selectedBank) {
      result = result.filter((t) => t.id.startsWith(selectedBank));
    }

    if (selectedCategories.length > 0) {
      result = result.filter((t) => selectedCategories.includes(t.category));
    }

    result.sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split("/").map(Number);
      const [dayB, monthB, yearB] = b.date.split("/").map(Number);

      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);

      return dateB.getTime() - dateA.getTime();
    });

    setFiltered(result);
  }, [
    tab,
    search,
    transactions,
    minAmount,
    maxAmount,
    startDate,
    endDate,
    selectedBank,
    selectedCategories, // 👈 actualizado aquí
  ]);

  console.log(filtered);

  return (
    <>
      <Header />

      <div className="transactions__layout">
        {/* Columna izquierda */}
        <aside className="transactions__sidebar">
          <div className="transactions__sidebar-content">
            <h1 className="transactions__title">Transacciones</h1>
            <div className="transactions__mobile-controls ">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="transactions__search"
              />
              <button
                className="transactions__mobile-filter-button mobile-only"
                onClick={() => setShowFiltersModal(true)}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  Filtros
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M21 5H14.21C13.76 3.84 12.48 3 11 3s-2.76.84-3.21 2H3v2h4.79c.45 1.16 1.73 2 3.21 2s2.76-.84 3.21-2H21V5zm0 6H10.21c-.45-1.16-1.73-2-3.21-2s-2.76.84-3.21 2H3v2h.79c.45 1.16 1.73 2 3.21 2s2.76-.84 3.21-2H21v-2zm0 6H14.21c-.45-1.16-1.73-2-3.21-2s-2.76.84-3.21 2H3v2h4.79c.45 1.16 1.73 2 3.21 2s2.76-.84 3.21-2H21v-2z" />
                  </svg>
                </span>
              </button>
            </div>

            {showFiltersModal && (
              <div className="mobile-only-modal">
                <FilterModal
                  onClose={() => setShowFiltersModal(false)}
                  onApply={() => setShowFiltersModal(false)}
                  minAmount={minAmount}
                  maxAmount={maxAmount}
                  setMinAmount={setMinAmount}
                  setMaxAmount={setMaxAmount}
                  startDate={startDate}
                  endDate={endDate}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  bankList={bankList}
                  selectedBank={selectedBank}
                  setSelectedBank={setSelectedBank}
                  categories={categories}
                  selectedCategory={""} // actualiza esto si usas categorías en el modal también
                  setSelectedCategory={() => {}} // idem
                />
              </div>
            )}

            <div className="transactions__filters desktop-only">
              <AmountFilter
                min={minAmount}
                max={maxAmount}
                onChange={(min, max) => {
                  setMinAmount(min);
                  setMaxAmount(max);
                }}
              />
              <div className="date-filter-group desktop-only">
                <Datepicker
                  onRangeChange={(start, end) => {
                    setStartDate(start || null);
                    setEndDate(end || null);
                  }}
                />
              </div>
              {bankList.length > 1 && (
                <BankFilter
                  banks={bankList}
                  selected={selectedBank}
                  onChange={(bank) => setSelectedBank(bank)}
                />
              )}
              {categories.length > 1 && (
                <CategoryFilter
                  categories={categories}
                  selected={selectedCategories}
                  onChange={setSelectedCategories}
                />
              )}
            </div>
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
      <Footer />
    </>
  );
};

export default Transactions;
