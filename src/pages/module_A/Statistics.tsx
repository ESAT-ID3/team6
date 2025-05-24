import './Statistics.css';
import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import userService from '../../services/firebase/userService';
import Header from '../../components/layout/header/Header';
import Button from '../../components/ui/button/Button';
import BarChart from '../../components/ui/charts/BarChart';
import PieChart from '../../components/ui/charts/PieChart';
import HorizontalBarChart from '../../components/ui/charts/HorizontalBarChart';

const Statistics = () => {
  const { user } = useUser();

  const [labels, setLabels] = useState<string[]>([]);
  const [incomeData, setIncomeData] = useState<number[]>([]);
  const [outcomeData, setOutcomeData] = useState<number[]>([]);

  const [categories, setCategories] = useState<string[]>([]);
  const [spendData, setSpendData] = useState<number[]>([]);
  const [categoryColors, setCategoryColors] = useState<string[]>([]);

  const [bankFilter, setBankFilter] = useState<string[]>([]);
  const [selectedBank, setSelectedBank] = useState<string>('Todos');
  const [banksInfo, setBanksInfo] = useState<any[]>([]); // Nuevo: almacena todos los datos

  const getRandomColor = (): string => {
    const r = Math.floor(Math.random() * 156) + 100;
    const g = Math.floor(Math.random() * 156) + 100;
    const b = Math.floor(Math.random() * 156) + 100;
    return `rgba(${r}, ${g}, ${b}, 0.7)`;
  };

  function getBarChartData(banks_info: any[]) {
    const { labels, incomeData, outcomeData } = userService.getInfoPerMonth(banks_info);
    const recentLabels = labels.slice(-12);
    const recentIncomeData = incomeData.slice(-12);
    const recentOutcomeData = outcomeData.slice(-12);
    return { labels: recentLabels, incomeData: recentIncomeData, outcomeData: recentOutcomeData };
  }

  function getPieChartData(banks_info: any[], latestMonth: string) {
    const { categories, spend } = userService.getSpendInfoPerCategory(banks_info, latestMonth);
    return { categories, spend };
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const userData = await userService.getBankInfo(user.id);
      const banks_info = userData?.bank_accounts;

      if (banks_info) {
        setBanksInfo(banks_info); // Guardar todos los bancos

        const { labels, incomeData, outcomeData } = getBarChartData(banks_info);
        const latestMonth = labels[labels.length - 1];

        setLabels(labels);
        setIncomeData(incomeData);
        setOutcomeData(outcomeData);

        const { categories, spend } = getPieChartData(banks_info, latestMonth);

        const sortedData = categories.map((category, index) => ({
          category,
          amount: spend[index],
        })).sort((a, b) => b.amount - a.amount);

        const sortedCategories = sortedData.map(item => item.category);
        const sortedSpend = sortedData.map(item => item.amount);

        setCategories(sortedCategories);
        setSpendData(sortedSpend);

        const generatedColors = sortedCategories.map(() => getRandomColor());
        setCategoryColors(generatedColors);

        const banks: string[] = ['Todos'];
        banks_info.forEach((bank: any) => banks.push(bank.bank_name));
        setBankFilter(banks);
      }
    };

    fetchData();
  }, [user]);

  const handleBankFilter = (bank: string) => {
    setSelectedBank(bank);

    let filteredBanks = banksInfo;
    if (bank !== 'Todos') {
      filteredBanks = banksInfo.filter(b => b.bank_name === bank);
    }

    const { labels, incomeData, outcomeData } = getBarChartData(filteredBanks);
    const latestMonth = labels[labels.length - 1];

    setLabels(labels);
    setIncomeData(incomeData);
    setOutcomeData(outcomeData);

    const { categories, spend } = getPieChartData(filteredBanks, latestMonth);

    const sortedData = categories.map((category, index) => ({
      category,
      amount: spend[index],
    })).sort((a, b) => b.amount - a.amount);

    const sortedCategories = sortedData.map(item => item.category);
    const sortedSpend = sortedData.map(item => item.amount);

    setCategories(sortedCategories);
    setSpendData(sortedSpend);

    const generatedColors = sortedCategories.map(() => getRandomColor());
    setCategoryColors(generatedColors);
  };

  return (
    <>
      <Header />
      <main>
        <div><h2>Estadísticas</h2></div>
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
          <BarChart labels={labels} incomeData={incomeData} outcomeData={outcomeData} />
        </div>
        <div><h3>Showing data from: {labels[labels.length - 1]}</h3></div>
        <div className="gauge-gallery-container"></div>
        <div className="chart-gallery">
          <div className="chart-gallery__item">
            <HorizontalBarChart categories={categories} expenses={spendData} colors={categoryColors} />
          </div>
          <div className="chart-gallery__item">
            <PieChart labels={categories} data={spendData} colors={categoryColors} hideLegend={true} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Statistics;
