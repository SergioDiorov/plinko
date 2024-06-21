import { FC } from 'react';

import styles from './RollsRemaining.module.scss';

interface RollsRemainingProps {
  rollsRemaining: number;
}

const RollsRemaining: FC<RollsRemainingProps> = ({ rollsRemaining }) => {
  return (
    <div className={styles.rollsRemainingContainer}>
      <p className={styles.text}>Rolls Remaining</p>
      <p className={`${styles.text} ${styles.textNumber}`}>{rollsRemaining}</p>
    </div>
  );
};

export default RollsRemaining;
