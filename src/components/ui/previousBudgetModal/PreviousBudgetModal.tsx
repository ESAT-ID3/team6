import React from "react";
import "./PreviousBudgetModal.css";
import DynamicTable from "../tables/DynamicTable";
import BackLink from "../backLink/BackLink";
import Button from "../button/Button";

type BudgetItem = {
  category: string;
  limit: number;
  spend: number;
  savings: number;
};

interface BudgetInfoModalProps {
  onClose: () => void;
  updateBudget: (updatedBudget: { category: string; limit: number }[]) => void;
  previousBudget: BudgetItem[];
}

const PreviousBudgetModal: React.FC<BudgetInfoModalProps> = ({ onClose, previousBudget, updateBudget }) => {

  const updateBudgetHandler = () => {
    const updatedBudget = previousBudget.map((item) => ({
        category: item.category,
        limit: item.limit,
    }));
    updateBudget(updatedBudget);
    onClose();
  };
  return (
    <div className="budget-info-modal">
      <BackLink onClick={onClose} />
      <h5 className="budget-info-modal__title">Detalles del presupuesto</h5>
      <DynamicTable
        labels={["Categoría", "Límite", "Gasto", "Ahorro"]}
        data={previousBudget}
      />
      <div className="budget-info-modal__actions">
        <Button
        label="Utilizar presupuesto como base"
        isDisabled={false}
        isFilter={false}
        variant="primary"
        onClick={updateBudgetHandler}
        />
      </div>
    </div>
  );
};

export default PreviousBudgetModal;
