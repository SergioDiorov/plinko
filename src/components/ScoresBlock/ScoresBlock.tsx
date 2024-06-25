import { FC } from 'react';
import styles from './ScoresBlock.module.scss';

interface ScoresBlockProps {
  slotsData: { [key: number]: number };
}

const ScoresBlock: FC<ScoresBlockProps> = ({ slotsData }) => {
  const handleGetItemClassName = (item: number): string => {
    if (
      (slotsData[+item] >= 0 && slotsData[+item] < 10) ||
      (slotsData[+item] <= 0 && slotsData[+item] > -10)
    ) {
      return 'scoresSpan' + item + 'One';
    }
    if (
      (slotsData[+item] >= 10 && slotsData[+item] < 100) ||
      (slotsData[+item] <= 10 && slotsData[+item] > -100)
    ) {
      return 'scoresSpan' + item + 'Two';
    }
    if (
      (slotsData[+item] >= 100 && slotsData[+item] < 1000) ||
      (slotsData[+item] <= 100 && slotsData[+item] > -1000)
    ) {
      return 'scoresSpan' + item + 'Three';
    }

    return 'scoresSpan' + item;
  };

  return (
    <div className={styles.scoresContainer}>
      {Object.keys(slotsData).map((item) => {
        const className = handleGetItemClassName(+item);
        return (
          <span
            key={item}
            className={`${styles['scoresSpan' + item]} ${styles[className]}`}
          >
            {slotsData[+item] > 0 ? '+' + slotsData[+item] : slotsData[+item]}
          </span>
        );
      })}
    </div>
  );
};

export default ScoresBlock;
