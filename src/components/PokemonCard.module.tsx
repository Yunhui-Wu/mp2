import React from 'react';
import { Pokemon } from '../types/pokemon';
import styles from './PokemonCard.module.css';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
  return (
    <div className={styles.pokemonCard} onClick={onClick}>
      <div className={styles.imageContainer}>
        <img
          src={pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default || '/logo192.png'}
          alt={pokemon.name}
          className={styles.pokemonImage}
          loading='lazy'
        />
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.label}>Height:</span>
            <span className={styles.value}>{pokemon.height / 10} m</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Weight:</span>
            <span className={styles.value}>{pokemon.weight / 10} kg</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Base Exp:</span>
            <span className={styles.value}>{pokemon.base_experience}</span>
          </div>
        </div>
        <div className={styles.types}>
          {pokemon.types.map((type: any, index: number) => (
            <span key={index} className={`${styles.typeTag} ${styles[type.type.name]}`}>
              {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
