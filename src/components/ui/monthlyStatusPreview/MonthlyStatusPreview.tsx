import "./MonthlyStatusPreview.css";
import { useNavigate } from "react-router-dom";
import GaugeChart from "../charts/GaugeChart";
import Button from "../button/Button";

interface CategoryStatus {
  category: string;
  percent: number;
}

interface MonthlyStatusPreviewProps {
  data: CategoryStatus[];
}

const MonthlyStatusPreview: React.FC<MonthlyStatusPreviewProps> = ({
  data,
}) => {
  const navigate = useNavigate();

  return (
    <div className="monthly-status-preview">
      {data.length ? (
        <>
          <h2>Estado de los presupuestos actuales</h2>
          <div className="gauges-wrapper">
            {data.map((item) => (
              <GaugeChart
                key={item.category}
                label={item.category}
                value={item.percent}
              />
            ))}
          </div>
        </>
      ) : (
        <h2>No hay presupuesto creado en el mes actual</h2>
      )}
      

      <div className="button-container">
        <Button
          variant="secondary"
          label="Ver presupuestos"
          isDisabled={false}
          isFilter={false}
          isFullWidth={false}
          onClick={() => navigate("/personal/budget")}
        />
      </div>
    </div>
  );
};

export default MonthlyStatusPreview;
