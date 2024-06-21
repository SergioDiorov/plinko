import { FC } from 'react';

import styles from './OthersOption.module.scss';
import Others from 'src/assets/Others.png';

interface OthersOptionProps {
  othersSlotNumbers: number[];
}

const OthersOption: FC<OthersOptionProps> = ({ othersSlotNumbers }) => {
  return (
    <div>
      {othersSlotNumbers.map((item) => {
        const styleName = `others${item}`;
        return (
          <img
            key={item}
            src={Others}
            className={`${styles.others} ${styles[styleName]}`}
            alt=''
          />
        );
      })}
    </div>
  );
};

export default OthersOption;
