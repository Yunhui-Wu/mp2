import React from 'react';
import { Pokemon } from '../types/pokemon';
import styles from './GalleryItem.module.css';

interface GalleryItemProps {
  pokemon: Pokemon;
  onClick: () => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ pokemon, onClick }) => {
  return (
    <div className={styles.galleryItem} onClick={onClick}>
      <div className={styles.imageContainer}>
        <img
          src={pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default || '/logo192.png'}
          alt={pokemon.name}
          className={styles.poster}
          loading='lazy'
        />
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
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

export default GalleryItem;