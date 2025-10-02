import React from 'react';
import styles from './NavigationButtons.module.css';

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}) => {
  return (
    <div className={styles.navigationButtons}>
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={`${styles.navButton} ${!canGoPrevious ? styles.disabled : ''} ${styles.previous}`}
      >
        ← Previous
      </button>
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className={`${styles.navButton} ${!canGoNext ? styles.disabled : ''} ${styles.next}`}
      >
        Next →
      </button>
    </div>
  );
};

export default NavigationButtons;