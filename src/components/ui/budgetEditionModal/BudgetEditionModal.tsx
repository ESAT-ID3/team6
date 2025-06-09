import { useState } from "react";
import BackLink from "../backLink/BackLink";
import Button from "../button/Button";
import { FiPlus, FiMinus } from "react-icons/fi";
import "./BudgetEditionModal.css";

interface BudgetEditionModalProps {
  currentBudget: { category: string; limit: number }[];
  onClose: () => void;
  updateBudget: (updatedBudget: { category: string; limit: number }[]) => void;
  categories: string[];
}

const BudgetEditionModal = ({ onClose, categories, currentBudget, updateBudget }: BudgetEditionModalProps) => {
  const [selectedCategories, setSelectedCategories] = useState<{ [key: string]: number }>(
    Object.fromEntries(currentBudget.map((item) => [item.category, item.limit]))
  );

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      const updated = { ...prev };
      if (updated[category] !== undefined) {
        delete updated[category];
      } else {
        updated[category] = 0;
      }
      return updated;
    });
  };

  const updateLimit = (category: string, value: string) => {
    if (isNaN(Number(value)) || Number(value) < 0) {
      return; // Ignore invalid input
    }
    setSelectedCategories((prev) => ({
      ...prev,
      [category]: Number(value),
    }));
  };

  const updateBudgetHandler = () => {
    updateBudget(Object.entries(selectedCategories).map(([category, limit]) => ({ category, limit })));
    onClose();
  }

  return (
    <div className="budget-edition-modal">
      <BackLink onClick={onClose} />
      <h5>Editar Presupuesto</h5>
      <div className="budget-edition-modal__content">
        {categories.map((category) => {
          const isSelected = selectedCategories[category] !== undefined;

          return (
            <div key={category} className="budget-edition-modal__category">
              <button
                type="button"
                className={`category-button ${isSelected ? "selected" : ""}`}
                onClick={() => toggleCategory(category)}
              >
                {isSelected ? <FiMinus /> : <FiPlus />}
                <span>{category.toUpperCase()}</span>
                {isSelected && (
                  <input
                    type="text"
                    className="category-button__input"
                    value={selectedCategories[category]}
                    onChange={(e) => updateLimit(category, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="€"
                  />
                )}
              </button>
            </div>
          );
        })}
        <div className="budget-edition-modal__actions">
          <Button
            label="Guardar Presupuesto"
            isDisabled={false}
            isFilter={false}
            variant="primary"
            onClick={updateBudgetHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetEditionModal;
