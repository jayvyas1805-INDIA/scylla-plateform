import React, { useState } from 'react';
import '../../styles/filter-drawer.css';

// const FilterDrawer = ({ isOpen, onClose, filters, setFilters }) => {
const FilterDrawer = ({ isOpen, onClose, filters, setFilters, filterOptions }) => {
  const { categories, brands, conditions, maxPrice } = filterOptions;


  const handleConditionChange = (condition) => {
    setFilters(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
    }));
  };


  // const brands = [products.brands]

  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };



  const handleBrandChange = (brand) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  const handlePriceChange = (e) => {
    const newPrice = parseInt(e.target.value);
    setPriceRange([priceRange[0], newPrice]);
    setFilters(prev => ({
      ...prev,
      maxPrice: newPrice
    }));
  };

 const resetFilters = () => {
  setFilters({
    categories: [],
    conditions: [],
    brands: [],
    maxPrice
  });
};


  return (
    <>
      {isOpen && <div className="filter-overlay" onClick={onClose} />}

      <div className={`filter-drawer ${isOpen ? 'open' : ''}`}>
        <div className="filter-header">
          <h2 className="filter-title">Filters</h2>
          <button
            className="filter-close-btn"
            onClick={onClose}
            aria-label="Close filters"
          >
            ✕
          </button>
        </div>

        <div className="filter-content">
          <input
            type="range"
            min="0"
            max={maxPrice}
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters(prev => ({
                ...prev,
                maxPrice: Number(e.target.value)
              }))
            }
          />

          <div className="price-display">
            <span className="price-min">$0</span>
            <span className="price-max">${filters.maxPrice}</span>
          </div>


          {/* Condition Filter */}
          <div className="filter-section">
            <h3 className="filter-section-title">Condition</h3>
            <div className="filter-options">
              {conditions.map(condition => (
                <label key={condition} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.conditions.includes(condition)}
                    onChange={() =>
                      setFilters(prev => ({
                        ...prev,
                        conditions: prev.conditions.includes(condition)
                          ? prev.conditions.filter(c => c !== condition)
                          : [...prev.conditions, condition]
                      }))
                    }
                  />
                  <span>{condition.toUpperCase()}</span>
                </label>
              ))}

            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-section">
            <h3 className="filter-section-title">Category</h3>
            <div className="filter-options">
              {categories.map(category => (
                <label key={category} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <span>{category}</span>
                </label>
              ))}

            </div>
          </div>

          {/* Brand Filter */}
          <div className="filter-section">
            <h3 className="filter-section-title">Brand</h3>
            <div className="filter-options">
              {brands.map(brand => (
                <label key={brand} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    className="filter-checkbox"
                  />
                  <span className="filter-label">{brand}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="filter-footer">
          <button className="filter-reset-btn" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterDrawer;
