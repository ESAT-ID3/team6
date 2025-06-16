import "./Statistics.css";
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import userService from "../../services/firebase/userService";
import Header from "../../components/layout/header/Header";
import Button from "../../components/ui/button/Button";
import BarChart from "../../components/ui/charts/BarChart";
import HorizontalBarChart from "../../components/ui/charts/HorizontalBarChart";
import DynamicTable from "../../components/ui/tables/DynamicTable";
import Footer from "../../components/layout/footer/Footer";

const Statistics = () => {
  const { user } = useUser();

  const [labels, setLabels] = useState<string[]>([]);
  const [incomeData, setIncomeData] = useState<number[]>([]);
  const [outcomeData, setOutcomeData] = useState<number[]>([]);

  const [categories, setCategories] = useState<string[]>([]);
  const [spendData, setSpendData] = useState<number[]>([]);
  const [categoryColors, setCategoryColors] = useState<string[]>([]);

  const [bankFilter, setBankFilter] = useState<string[]>([]);
  const [selectedBank, setSelectedBank] = useState<string>("Todos");
  const [banksInfo, setBanksInfo] = useState<any[]>([]);

  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  const getRandomColor = (): string => {
    const r = Math.floor(Math.random() * 156) + 100;
    const g = Math.floor(Math.random() * 156) + 100;
    const b = Math.floor(Math.random() * 156) + 100;
    return `rgba(${r}, ${g}, ${b}, 0.7)`;
  };

  function getBarChartData(banks_info: any[], monthsCount: number) {
    const { labels, incomeData, outcomeData } =
      userService.getInfoPerMonth(banks_info);
    const recentLabels = labels.slice(0, monthsCount).reverse();
    const recentIncomeData = incomeData.slice(0, monthsCount).reverse();
    const recentOutcomeData = outcomeData.slice(0, monthsCount).reverse();
    return {
      labels: recentLabels,
      incomeData: recentIncomeData,
      outcomeData: recentOutcomeData,
    };
  }

  function getPieChartData(banks_info: any[], latestMonth: string) {
    const { categories, spend } = userService.getSpendInfoPerCategory(
      banks_info,
      latestMonth
    );
    return { categories, spend };
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const userData = await userService.getBankInfo(user.id);
      const banks_info = userData?.bank_accounts;

      if (banks_info) {
        setBanksInfo(banks_info);
        const banks: string[] = ["Todos"];
        banks_info.forEach((bank: any) => banks.push(bank.bank_name));
        setBankFilter(banks);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (banksInfo.length === 0) return;

    const monthsCount = isMobile ? 6 : 12;

    let filteredBanks =
      selectedBank === "Todos"
        ? banksInfo
        : banksInfo.filter((b) => b.bank_name === selectedBank);

    const { labels, incomeData, outcomeData } = getBarChartData(
      filteredBanks,
      monthsCount
    );

    setLabels(labels);
    setIncomeData(incomeData);
    setOutcomeData(outcomeData);

    if (labels.length > 0) {
      const latestMonth = labels[labels.length - 1];
      setSelectedMonth(latestMonth);
      handleMonthClick(latestMonth);
    }
  }, [banksInfo, isMobile, selectedBank]);

  const handleMonthClick = (month: string) => {
    setSelectedMonth(month);

    let filteredBanks =
      selectedBank === "Todos"
        ? banksInfo
        : banksInfo.filter((b) => b.bank_name === selectedBank);

    const { categories, spend } = getPieChartData(filteredBanks, month);

    const sortedData = categories
      .map((category, index) => ({
        category,
        amount: spend[index],
      }))
      .sort((a, b) => b.amount - a.amount);

    const sortedCategories = sortedData.map((item) => item.category);
    const sortedSpend = sortedData.map((item) => item.amount);
    const generatedColors = sortedCategories.map(() => getRandomColor());

    setCategories(sortedCategories);
    setSpendData(sortedSpend);
    setCategoryColors(generatedColors);
  };

  const handleBankFilter = (bank: string) => {
    setSelectedBank(bank);
  };

  return (
    <>
      <Header />
      <main className="stats-main">
        <div>
          <h2>Estadísticas</h2>
        </div>
        <div className="filter-gallery">
          {bankFilter.map((bank, index) => (
            <Button
              key={index}
              label={bank}
              isDisabled={false}
              isFilter={true}
              variant="secondary"
              isActive={selectedBank === bank}
              isFullWidth={false}
              onClick={() => handleBankFilter(bank)}
            />
          ))}
        </div>
        <div className="bar-chart-container">
          <BarChart
            labels={labels}
            incomeData={incomeData}
            outcomeData={outcomeData}
            selectedLabel={selectedMonth}
            onBarClick={handleMonthClick}
          />
        </div>
        <div className="selected-month">
          <h4>
            Visualizando fecha:{" "}
            {selectedMonth || (labels.length > 0 ? labels[labels.length - 1] : "")}
          </h4>
        </div>
        <div className="gauge-gallery-container"></div>
        <div className="chart-gallery">
          <div className="chart-gallery__item">
            <HorizontalBarChart
              categories={categories}
              expenses={spendData}
              colors={categoryColors}
            />
          </div>
          <div className="chart-gallery__item">
            <DynamicTable
              labels={["Categoría", "% del gasto"]}
              data={categories.map((category, idx) => {
                const totalSpend = spendData.reduce((acc, val) => acc + val, 0);
                return {
                  category,
                  percentage: totalSpend
                    ? ((spendData[idx] / totalSpend) * 100).toFixed(2) + "%"
                    : "0%",
                };
              })}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Statistics;
