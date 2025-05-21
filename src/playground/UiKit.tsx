import './UiKit.css'
import { useState , useEffect } from 'react';
import { useUser } from '../context/UserContext';
import userService from '../services/firebase/userService';
import Header from "../components/layout/header/Header";
import Button from "../components/ui/button/Button";
import Datepicker from '../components/ui/datepicker/Datepicker';
import Input from '../components/ui/input/Input';
import BarChart from '../components/ui/charts/BarChart';
import PieChart from '../components/ui/charts/PieChart';


const UiKit = () => {
    const { user } = useUser();

    // Data for column chart
    const [labels, setLabels] = useState<string[]>([]);
    const [incomeData, setIncomeData] = useState<number[]>([]);
    const [outcomeData, setOutcomeData] = useState<number[]>([]);

    // Data for pie chart
    const [categories, setCategories] = useState<string[]>([]);
    const [spendData, setSpendData] = useState<number[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            const userData = await userService.getBankInfo(user.id);
            const banks_info = userData?.bank_accounts;

            if (banks_info) {
                // Get the data for the column chart
                const { labels, incomeData, outcomeData } = userService.getInfoPerMonth(banks_info);

                const recentLabels = labels.slice(-12);
                const recentIncomeData = incomeData.slice(-12);
                const recentOutcomeData = outcomeData.slice(-12);

                setLabels(recentLabels);
                setIncomeData(recentIncomeData);
                setOutcomeData(recentOutcomeData);

                // Get the data for the pie chart
                let latestMonth = recentLabels[recentLabels.length - 1];
            
                const {categories , spend} = userService.getSpendInfoPerCategory(banks_info, latestMonth);
                console.log(categories);
                console.log(spend);
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
                        <div style={{
                                    background: 'var(--white)',
                                    width: '48px',
                                    height: '48px',
                                    border: '1px solid var(--black)'
                                }}>
                        </div>
                        <div style={{
                                    background: 'var(--black)',
                                    width: '48px',
                                    height: '48px',
                                    border: '1px solid var(--black)'
                                }}>
                        </div>
                        <div style={{
                                    background: 'var(--main-blue)',
                                    width: '48px',
                                    height: '48px',
                                    border: '1px solid var(--black)'
                                }}>    
                        </div>
                        <div style={{
                                    background: 'var(--main-purple)',
                                    width: '48px',
                                    height: '48px',
                                    border: '1px solid var(--black)'
                                }}>
                        </div>
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
                        <Button label="Primary" isDisabled={false} isFilter={false} variant="primary"></Button>
                        <Button label="Secondary" isDisabled={false} isFilter={false} variant="secondary"></Button>
                        <Button label="Primary" isDisabled={true} isFilter={false} variant="primary"></Button>
                        <Button label="Secondary" isDisabled={true} isFilter={false} variant="secondary"></Button>
                        <Button label="Filter" isDisabled={false} isFilter={true} variant="secondary"></Button>
                    </div>
                </section>
                <section>
                    <h5 className='section-title'>Custom inputs</h5>
                    <div className='horizontal-gallery'>
                        <Datepicker></Datepicker>
                        <Input
                            headline="Headline"
                            footer="Footer"
                            beginningIcon="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                            endingIcon="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                            placeholder="Placeholder"
                            isPassword={false}
                            onChange={() => { }}></Input>
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
                            />
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default UiKit;