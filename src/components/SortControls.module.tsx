import React from 'react';
import { SortField, SortOrder } from '../types/pokemon';
import styles from './SortControls.module.css';

interface SortControlsProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortFieldChange: (field: SortField) => void;
  onSortOrderChange: (order: SortOrder) => void;
}

const SortControls: React.FC<SortControlsProps> = ({
  sortField,
  sortOrder,
  onSortFieldChange,
  onSortOrderChange,
}) => {
  return (
    <div className={styles.sortControls}>
      <div className={styles.sortField}>
        <label htmlFor="sort-field" className={styles.label}>
          Sort by: 
        </label>
        <select
          id="sort-field"
          value={sortField}
          onChange={(e) => onSortFieldChange(e.target.value as SortField)}
          className={styles.select}
        >
          <option value="name">Name</option>
          <option value="height">Height</option>
          <option value="weight">Weight</option>
          <option value="base_experience">Base Experience</option>
        </select>
      </div>
      <div className={styles.sortOrder}>
        <button
          onClick={() => onSortOrderChange('asc')}
          className={`${styles.button} ${sortOrder === 'asc' ? styles.active : ''}`}
        >
          Asc
        </button>
        <button
          onClick={() => onSortOrderChange('desc')}
          className={`${styles.button} ${sortOrder === 'desc' ? styles.active : ''}`}
        >
          Desc
        </button>
      </div>
    </div>
  );
};

export default SortControls;