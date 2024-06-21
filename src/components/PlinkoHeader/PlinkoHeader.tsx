import { FC } from 'react';

import styles from './PlinkoHeader.module.scss';
import PlinkoLogo from 'src/assets/PlinkoLogo.png';

interface PlinkoHeaderProps {
  addBall: () => void;
}

const PlinkoHeader: FC<PlinkoHeaderProps> = ({ addBall }) => {
  const handleAddBallClick = () => {
    addBall();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div className={styles.headerContainer}>
      <button onClick={handleAddBallClick}>
        <img src={PlinkoLogo} alt='PlinkoLogo' />
      </button>
    </div>
  );
};

export default PlinkoHeader;
