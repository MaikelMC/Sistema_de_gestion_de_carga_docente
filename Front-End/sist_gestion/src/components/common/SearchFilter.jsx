import React from 'react';
import './SearchFilter.css';

export const SearchFilter = ({
  searchTerm,
  onSearchChange,
  filterOptions = [],
  onFilterChange,
  sortOptions = [],
  sortBy,
  onSortChange,
  onClearFilters,
  hasActiveFilters = false
}) => {
  return (
    <div className="search-filter-container">
      {/* Search Input */}
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Buscar..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button
            className="search-clear"
            onClick={() => onSearchChange('')}
            title="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filters and Sort */}
      <div className="filters-group">
        {filterOptions.map((option) => (
          <div key={option.id} className="filter-item">
            <label>{option.label}</label>
            <select
              value={option.value}
              onChange={(e) => onFilterChange(option.id, e.target.value)}
            >
              <option value="">Todo</option>
              {option.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}

        {sortOptions.length > 0 && (
          <div className="filter-item">
            <label>Ordenar Por</label>
            <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {hasActiveFilters && (
          <button
            className="btn btn-secondary"
            onClick={onClearFilters}
            style={{ alignSelf: 'flex-end' }}
          >
            Limpiar Filtros
          </button>
        )}
      </div>
    </div>
  );
};
