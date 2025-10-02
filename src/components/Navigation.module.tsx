import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navigation.module.css';
import logo from '../logo.png';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className={styles.navigation}>
      <div className={styles.container}>
        
        <img className={styles.logo} src={logo} alt="Pokémon World Pokédex" />
        
        <div className={styles.navLinks}>
          <Link 
            to="/" 
            className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
          >
            List View
          </Link>
          <Link 
            to="/gallery" 
            className={`${styles.navLink} ${location.pathname === '/gallery' ? styles.active : ''}`}
          >
            Gallery View
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
