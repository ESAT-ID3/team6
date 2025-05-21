import './Statistics.css';
import { useState , useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import userService from '../../services/firebase/userService';
import Header from '../../components/layout/header/Header';
import Button from '../../components/ui/button/Button';
import BarChart from '../../components/ui/charts/BarChart';
import PieChart from '../../components/ui/charts/PieChart';

const Statistics = () => {
    const { user } = useUser();
    
        // Data for column chart
        const [labels, setLabels] = useState<string[]>([]);
        const [incomeData, setIncomeData] = useState<number[]>([]);
        const [outcomeData, setOutcomeData] = useState<number[]>([]);
    
        // Data for pie chart
        const [categories, setCategories] = useState<string[]>([]);
        const [spendData, setSpendData] = useState<number[]>([]);

        function getBarChartData(banks_info: any) {
            // Get the data for the column chart
            const { labels, incomeData, outcomeData } = userService.getInfoPerMonth(banks_info);

            const recentLabels = labels.slice(-12);
            const recentIncomeData = incomeData.slice(-12);
            const recentOutcomeData = outcomeData.slice(-12);

            return {
                labels: recentLabels,
                incomeData: recentIncomeData,
                outcomeData: recentOutcomeData
            };
        }

        function getPieChartData(banks_info: any, latestMonth: string) {
            // Get the data for the pie chart
            const {categories , spend} = userService.getSpendInfoPerCategory(banks_info, latestMonth);
            
            return {
                categories: categories,
                spend: spend
            };
        }

        useEffect(() => {
            const fetchData = async () => {
                if (!user) return;
    
                const userData = await userService.getBankInfo(user.id);
                const banks_info = userData?.bank_accounts;
    
                if (banks_info) {
                    const { labels, incomeData, outcomeData } = getBarChartData(banks_info);
                    let latestMonth = labels[labels.length - 1];
                    setLabels(labels);
                    setIncomeData(incomeData);
                    setOutcomeData(outcomeData);
                    
                    const {categories , spend} = getPieChartData(banks_info, latestMonth);
                    setCategories(categories);
                    setSpendData(spend);
                }
            };
    
            fetchData();
        }, [user]);

    return (
        <>
            <Header></Header>
            <main>
                <div>
                    <h2>Estadísticas</h2>
                </div>
                <div className="filter-gallery">

                </div>
                <div className="bar-chart-container">
                    <BarChart labels={labels} incomeData={incomeData} outcomeData={outcomeData} />
                </div>
                <div>
                    <h3>Showing data from: {labels[labels.length-1]}</h3>
                </div>
                <div className="gauge-gallery-container">

                </div>
                <div className="chart-gallery">
                    <div className="chart-gallery__item">
                        <BarChart labels={labels} incomeData={incomeData} outcomeData={outcomeData} />
                    </div>
                    <div className="chart-gallery__item">
                        <PieChart labels={categories} data={spendData} />
                    </div>
                </div>
            </main>
        </>
    )
}

export default Statistics;