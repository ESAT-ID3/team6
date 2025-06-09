import './UiKit.css';
import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import userService from '../services/firebase/userService';
import Header from "../components/layout/header/Header";
import Button from "../components/ui/button/Button";
import Datepicker from '../components/ui/datepicker/Datepicker';
import Input from '../components/ui/input/Input';
import BarChart from '../components/ui/charts/BarChart';
import PieChart from '../components/ui/charts/PieChart';
import HorizontalBarChart from '../components/ui/charts/HorizontalBarChart';
import DynamicTable from '../components/ui/tables/DynamicTable';

const UiKit = () => {
    const { user } = useUser();

    const [filterActive, setFilterActive] = useState(false);

    const [labels, setLabels] = useState<string[]>([]);
    const [incomeData, setIncomeData] = useState<number[]>([]);
    const [outcomeData, setOutcomeData] = useState<number[]>([]);

    const [categories, setCategories] = useState<string[]>([]);
    const [spendData, setSpendData] = useState<number[]>([]);
    const [categoryColors, setCategoryColors] = useState<string[]>([]);

    const [tableLabels, setTableLabels] = useState<string[]>(["Categoría","Límite","Gasto","Ahorro"]);
    const [tableData, setTableData] = useState<Record<string, any>[]>([
        { categoria: "Comida", limite: 300, gasto: 250, ahorro: 50 },
        { categoria: "Transporte", limite: 150, gasto: 100, ahorro: 50 },
        { categoria: "Ocio", limite: 200, gasto: 180, ahorro: 20 },
        { categoria: "Suscripciones", limite: 100, gasto: 90, ahorro: 10 },
        { categoria: "Otros", limite: 250, gasto: 220, ahorro: 30 },
    ]);

    const getRandomColor = (): string => {
        const r = Math.floor(Math.random() * 156) + 100;
        const g = Math.floor(Math.random() * 156) + 100;
        const b = Math.floor(Math.random() * 156) + 100;
        return `rgba(${r}, ${g}, ${b}, 0.7)`;
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            const userData = await userService.getBankInfo(user.id);
            const banks_info = userData?.bank_accounts;

            if (banks_info) {
                const { labels, incomeData, outcomeData } = userService.getInfoPerMonth(banks_info);
                const recentLabels = labels.slice(-12);
                const recentIncomeData = incomeData.slice(-12);
                const recentOutcomeData = outcomeData.slice(-12);

                setLabels(recentLabels);
                setIncomeData(recentIncomeData);
                setOutcomeData(recentOutcomeData);

                const latestMonth = recentLabels[recentLabels.length - 1];
                const { categories, spend } = userService.getSpendInfoPerCategory(banks_info, latestMonth);
                setCategories(categories);
                setSpendData(spend);

                const generatedColors = categories.map(() => getRandomColor());
                setCategoryColors(generatedColors);
            }
        };

        fetchData();
    }, [user]);

    return (
        <>
            <Header />
            <main>
                <section>
                    <h5 className='section-title'>Logged Developer</h5>
                    <div>
                        <p>Id: {user?.id}</p>
                        <p>Nombre completo: {user?.name} {user?.surname}</p>
                        <p>E-mail: {user?.email}</p>
                        <p>Contraseña cifrada: <span className='hash'>{user?.password}</span></p>
                    </div>
                </section>
                <section>
                    <h5 className='section-title'>Colors</h5>
                    <div className='horizontal-gallery'>
                        {['--white', '--black', '--main-blue', '--main-purple'].map((colorVar, index) => (
                            <div key={index} style={{
                                background: `var(${colorVar})`,
                                width: '48px',
                                height: '48px',
                                border: '1px solid var(--black)'
                            }}></div>
                        ))}
                    </div>
                </section>
                <section>
                    <h5 className='section-title'>Typographies</h5>
                    <div>
                        <h1>This is an h1 tag</h1>
                        <h2>This is an h2 tag</h2>
                        <h3>This is an h3 tag</h3>
                        <h4>This is an h4 tag</h4>
                        <h5>This is an h5 tag</h5>
                        <h6>This is an h6 tag</h6>
                        <p>This is a paragraph</p>
                        <small>This is a small tag</small>
                    </div>
                </section>
                <section>
                    <h5 className='section-title'>Buttons</h5>
                    <div className='horizontal-gallery'>
                        <Button label="Primary" isDisabled={false} isFilter={false} variant="primary" />
                        <Button label="Secondary" isDisabled={false} isFilter={false} variant="secondary" />
                        <Button label="Primary" isDisabled={true} isFilter={false} variant="primary" />
                        <Button label="Secondary" isDisabled={true} isFilter={false} variant="secondary" />
                        <Button label="Filter" isDisabled={false} isFilter={true} variant="secondary" isActive={filterActive} onClick={() => setFilterActive(!filterActive)}/>
                    </div>
                </section>
                <section>
                    <h5 className='section-title'>Custom inputs</h5>
                    <div className='horizontal-gallery'>
                        <Datepicker />
                        <Input
                            headline="Headline"
                            footer="Footer"
                            beginningIcon="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                            endingIcon="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                            placeholder="Placeholder"
                            isPassword={false}
                            onChange={() => { }}
                        />
                    </div>
                </section>
                <section>
                    <h5 className='section-title'>Charts</h5>
                    <div className='horizontal-gallery'>
                        <div className='chart-container'>
                            <BarChart
                                labels={labels}
                                incomeData={incomeData}
                                outcomeData={outcomeData}
                            />
                        </div>
                        <div className='chart-container'>
                            <PieChart
                                labels={categories}
                                data={spendData}
                                colors={categoryColors}
                            />
                        </div>
                        <div className='chart-container'>
                            <HorizontalBarChart
                                categories={categories}
                                expenses={spendData}
                                colors={categoryColors}
                            />
                        </div>
                    </div>
                </section>
                <section>
                    <h5 className='section-title'>Tables</h5>
                    <div className='horizontal-gallery'>
                        <DynamicTable
                            labels={tableLabels}
                            data={tableData}
                        />
                    </div>
                </section>
            </main>
        </>
    );
};

export default UiKit;
