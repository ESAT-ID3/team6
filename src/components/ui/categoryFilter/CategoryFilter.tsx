import React from "react";
import "./CategoryFilter.css";

type Category = {
  name: string;
  icon: string;
};

type Props = {
  categories: Category[];
  selected: string;
  onChange: (category: string) => void;
};

const CategoryFilter = ({ categories, selected, onChange }: Props) => {
  return (
    <div className="category-filter">
      <label className="category-filter__label">Categoría</label>
      <div className="category-filter__buttons">
        {categories.map((cat) => (
          <button
            key={cat.name}
            className={`category-filter__button ${
              selected === cat.name ? "active" : ""
            }`}
            onClick={() => onChange(cat.name)}
          >
            <span className="category-filter__icon">
              <i className={cat.icon}></i>
            </span>
            <span className="category-filter__name">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
