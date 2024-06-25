import { FC, useEffect, useState } from 'react';

import styles from './SettingsModal.module.scss';
import XMark from 'src/assets/XMark.png';
// import { slots } from 'src/constants/constants';

interface SettingsModalProps {
  open: boolean;
  handleClose: () => void;
  checkedSlots: number[];
  setSlotChecked: (param: number[]) => void;
  rollsRemaining: number;
  setRollsRemaining: (param: number) => void;
  resetScore: () => void;
  slotsData: { [key: number]: number };
  setSlotsData: (param: { [key: number]: number }) => void;
}

const SettingsModal: FC<SettingsModalProps> = ({
  open,
  handleClose,
  checkedSlots,
  setSlotChecked,
  rollsRemaining,
  setRollsRemaining,
  resetScore,
  slotsData,
  setSlotsData,
}) => {
  const [tempRollsRemaining, setTempRollsRemaining] =
    useState<number>(rollsRemaining);
  const [tempSlotsChecked, setTempSlotsChecked] =
    useState<number[]>(checkedSlots);
  const [tempSlotsData, setTempSlotsData] = useState<{ [key: number]: number }>(
    slotsData,
  );

  const handleCheck = (slotNumber: number) => {
    if (tempSlotsChecked.includes(slotNumber)) {
      const updatedSlots = tempSlotsChecked.filter(
        (slot) => slot !== slotNumber,
      );
      setTempSlotsChecked(updatedSlots);
    } else {
      const updatedSlots = [...tempSlotsChecked, slotNumber];
      setTempSlotsChecked(updatedSlots);
    }
  };

  const handleSubstractRemain = () =>
    setTempRollsRemaining((prev: number) => (prev === 1 ? prev : --prev));

  const handleMultiplyRemain = () =>
    setTempRollsRemaining((prev: number) => (prev === 10 ? prev : ++prev));

  const handleSave = () => {
    if (rollsRemaining !== tempRollsRemaining) {
      setRollsRemaining(tempRollsRemaining);
    }
    if (JSON.stringify(tempSlotsChecked) !== JSON.stringify(checkedSlots)) {
      setSlotChecked(tempSlotsChecked);
    }
    if (JSON.stringify(tempSlotsData) !== JSON.stringify(slotsData)) {
      setSlotsData(tempSlotsData);
    }

    handleClose();
  };

  const handleCloseModal = () => {
    setTempRollsRemaining(rollsRemaining);
    setTempSlotsChecked(checkedSlots);
    setTempSlotsData(slotsData);
    handleClose();
  };

  const handleSlotChange = (slotNumber: number, newValue: string) => {
    const regex = /^-?\d*$/;

    if (regex.test(newValue) && +newValue <= 999 && +newValue >= -999) {
      const updatedSlots = { ...tempSlotsData, [slotNumber]: +newValue };
      setTempSlotsData(updatedSlots);
    }
  };

  useEffect(() => setTempRollsRemaining(rollsRemaining), [rollsRemaining]);
  useEffect(() => setTempSlotsChecked(checkedSlots), [checkedSlots]);
  useEffect(() => setTempSlotsData(slotsData), [slotsData]);

  return (
    <div
      style={{ display: open ? 'block' : 'none' }}
      className={styles.settingsWrapper}
    >
      <div className={styles.settingsContainer}>
        <h3 className={styles.title}>Settings</h3>
        <div className={styles.settings}>
          <div className={styles.remaining}>
            <p>Rolls Remaining</p>
            <div className={styles.infoBlock}>
              <button onClick={handleSubstractRemain}>-</button>
              <span>{tempRollsRemaining}</span>
              <button onClick={handleMultiplyRemain}>+</button>
            </div>
          </div>
          <div className={styles.settingsSlots}>
            {Object.keys(tempSlotsData).map((slot) => {
              return (
                <div className={styles.slotBlock} key={slot}>
                  <p>Slot{slot}</p>
                  <div className={styles.infoBlock}>
                    {/* {tempSlotsData[+slot]} */}
                    <input
                      type='number'
                      value={tempSlotsData[+slot].toString()}
                      onChange={(e) => handleSlotChange(+slot, e.target.value)}
                    />
                  </div>
                  {/* <div className={styles.infoBlock}>{slotsData[+slot]}</div> */}
                  <div className={styles.switchBlock}>
                    <span>Us</span>
                    <label className={styles.switch}>
                      <input
                        checked={!tempSlotsChecked.includes(+slot)}
                        type='checkbox'
                        onChange={() => handleCheck(+slot)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                    <span>Others</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.settingsButtons}>
          <button
            className={styles.settingsButtonsReset}
            onClick={() => {
              handleClose();
              resetScore();
            }}
          >
            Reset Scores
          </button>
          <button
            className={styles.settingsButtonsConfirm}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
        <button className={styles.closeButton} onClick={handleCloseModal}>
          <img src={XMark} alt='Close' />
        </button>
      </div>

      <div className={styles.settingsBackground}></div>
    </div>
  );
};

export default SettingsModal;
