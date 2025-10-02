import React from 'react';
import { PokemonTypeInfo } from '../types/pokemon';
import styles from './TypeFilter.module.css';

interface TypeFilterProps {
  types: PokemonTypeInfo[];
  selectedTypes: string[];
  onTypeToggle: (typeName: string) => void;
}

const TypeFilter: React.FC<TypeFilterProps> = ({ types, selectedTypes, onTypeToggle }) => {
  const handleClearAll = () => {
    selectedTypes.forEach(type => onTypeToggle(type));
  };

  return (
    <div className={styles.typeFilter}>
      <div className={styles.header}>
        <h3>Filter by Type:</h3>
        {selectedTypes.length > 0 && (
          <button onClick={handleClearAll} className={styles.clearButton}>
            Clear All Filters
          </button>
        )}
      </div>
      <div className={styles.typeList}>
        {types.map((type) => (
          <label key={type.name} className={styles.typeItem}>
            <input
              type="checkbox"
              checked={selectedTypes.includes(type.name)}
              onChange={() => onTypeToggle(type.name)}
              className={styles.checkbox}
            />
            <span className={styles.typeName}>
              {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default TypeFilter;
