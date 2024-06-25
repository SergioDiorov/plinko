import { FC } from 'react';

import styles from './FinalResultsModal.module.scss';
import ScoreInfo from 'src/components/ScoreInfo/ScoreInfo';
import DoneButton from 'src/assets/DoneButton.png';

interface FinalResultsProps {
  ourTeamScore: number;
  othersTeamScore: number;
  open: boolean;
  handleClose: () => void;
}

const FinalResultsModal: FC<FinalResultsProps> = ({
  open,
  handleClose,
  ourTeamScore,
  othersTeamScore,
}) => {
  return (
    <div
      style={{ display: open ? 'block' : 'none' }}
      className={styles.finalResultsWrapper}
    >
      <div className={styles.finalResultsModal}>
        <div className={styles.score}>
          <ScoreInfo title='OUR TEAM' score={ourTeamScore} />
          <ScoreInfo title='OTHER TEAMS' score={othersTeamScore} />
        </div>
        {/* <button onClick={handleClose}>
          <img src={DoneButton} alt='DoneButton' />
        </button> */}
        <button className={styles.settingsButtonsConfirm} onClick={handleClose}>
          Done
        </button>
      </div>
      <div className={styles.finalResultsBackground}></div>
    </div>
  );
};

export default FinalResultsModal;
