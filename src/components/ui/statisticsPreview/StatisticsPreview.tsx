import "./StatisticsPreview.css";
import { useState, useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import userService from "../../../services/firebase/userService";
import BarChart from "../../ui/charts/BarChart";
import Button from "../../ui/button/Button";
import { useNavigate } from "react-router-dom";

const StatisticsPreview = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [labels, setLabels] = useState<string[]>([]);
  const [incomeData, setIncomeData] = useState<number[]>([]);
  const [outcomeData, setOutcomeData] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const userData = await userService.getBankInfo(user.id);
      const banks_info = userData?.bank_accounts;

      if (banks_info) {
        const { labels, incomeData, outcomeData } =
          userService.getInfoPerMonth(banks_info);
        setLabels(labels.slice(-6).reverse());
        setIncomeData(incomeData.slice(-6).reverse());
        setOutcomeData(outcomeData.slice(-6).reverse());
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="statistics-preview">
      <div className="chart-wrapper">
        <BarChart
          labels={labels}
          incomeData={incomeData}
          outcomeData={outcomeData}
          selectedLabel={undefined}
          onBarClick={() => {}}
        />
      </div>
      <div className="button-container">
        <Button
          variant="secondary"
          label="Ver estadísticas"
          isDisabled={false}
          isFilter={false}
          isFullWidth={false}
          onClick={() => navigate("/personal/stats")}
        />
      </div>
    </div>
  );
};

export default StatisticsPreview;
