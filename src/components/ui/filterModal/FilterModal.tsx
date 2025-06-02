import React from "react";
import AmountFilter from "../amountFilter/AmountFilter";
import Datepicker from "../datepicker/Datepicker";
import BankFilter from "../bankFilter/BankFilter";
import CategoryFilter from "../categoryFilter/CategoryFilter";
import Button from "../button/Button";
import "./FilterModal.css";
import BackLink from "../backLink/BackLink";

type Props = {
  onClose: () => void;
  onApply: () => void;
  minAmount: number | "";
  maxAmount: number | "";
  setMinAmount: (val: number | "") => void;
  setMaxAmount: (val: number | "") => void;
  startDate: string | null;
  endDate: string | null;
  setStartDate: (val: string | null) => void;
  setEndDate: (val: string | null) => void;
  bankList: string[];
  selectedBank: string;
  setSelectedBank: (val: string) => void;
  categories: { name: string; icon: string }[];
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
};

const FilterModal = ({
  onClose,
  onApply,
  minAmount,
  maxAmount,
  setMinAmount,
  setMaxAmount,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  bankList,
  selectedBank,
  setSelectedBank,
  categories,
  selectedCategory,
  setSelectedCategory,
}: Props) => {
  return (
    <div className="transactions__modal-overlay">
      <div className="transactions__modal-content">
        <BackLink onClick={onClose} />
        <AmountFilter
          min={minAmount}
          max={maxAmount}
          onChange={(min, max) => {
            setMinAmount(min);
            setMaxAmount(max);
          }}
        />

        <Datepicker
          onRangeChange={(start, end) => {
            setStartDate(start || null);
            setEndDate(end || null);
          }}
        />

        {bankList.length > 1 && (
          <BankFilter
            banks={bankList}
            selected={selectedBank}
            onChange={setSelectedBank}
          />
        )}

        {categories.length > 1 && (
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        )}

        <div className="transactions__modal-actions">
          <Button
            label="Add"
            variant="primary"
            isFullWidth={false}
            onClick={onApply}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
