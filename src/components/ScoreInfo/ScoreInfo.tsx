import { FC, useEffect, useState } from 'react';

import styles from './ScoreInfo.module.scss';

interface ScoreInfoProps {
  title: string;
  score: number;
  showFlash?: boolean;
  disbleShowFlash?: () => void;
}

const ScoreInfo: FC<ScoreInfoProps> = ({
  title,
  score,
  showFlash,
  disbleShowFlash,
}) => {
  const points = Array.from(Array(30).keys());
  const [flashActive, setFlashActive] = useState(false);

  useEffect(() => {
    if (showFlash) {
      setFlashActive(true);
      const timeout = setTimeout(() => {
        setFlashActive(false);
        disbleShowFlash && disbleShowFlash();
      }, 2000);

      return () => clearTimeout(timeout);
    } else {
      setFlashActive(false);
    }
  }, [showFlash]);

  return (
    <div className={styles.scoreContainer}>
      <p className={styles.text}>{title}</p>
      <p className={`${styles.text} ${styles.textNumber}`}>{score}</p>

      <div className={styles.pointsContainer}>
        {points.map((index) => (
          <div
            key={index}
            className={`${styles.point} ${styles[`point${++index}`]} ${
              flashActive ? styles.active : ''
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ScoreInfo;
