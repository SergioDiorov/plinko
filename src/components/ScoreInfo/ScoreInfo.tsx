import { FC } from 'react';

import styles from './ScoreInfo.module.scss';

interface ScoreInfoProps {
  title: string;
  score: number;
}

const ScoreInfo: FC<ScoreInfoProps> = ({ title, score }) => {
  return (
    <div className={styles.scoreContainer}>
      <p className={styles.text}>{title}</p>
      <p className={`${styles.text} ${styles.textNumber}`}>{score}</p>
    </div>
  );
};

export default ScoreInfo;
