import { useEffect, useRef, useState } from 'react';

import ColourfulBG from 'src/assets/ColourfulBG.png';
import Frame from 'src/assets/Frame.png';
import LeftWall from 'src/assets/LeftWall.png';
import RightWall from 'src/assets/RightWall.png';
import PointLines from 'src/assets/PointLines.png';
import BoardDots from 'src/assets/BoardDots.png';
import Board from 'src/assets/Board.png';
import Ball from 'src/assets/Ball.png';
import Settings from 'src/assets/Settings.png';
import plinkoSoundEffect from 'src/assets/audio/PlinkoSoundEffect.mp3';

import styles from './GameTable.module.scss';
import PlinkoHeader from 'src/components/PlinkoHeader/PlinkoHeader';
import OthersOption from 'src/components/OthersOption/OthersOption';
import RollsRemaining from 'src/components/RollsRemaining/RollsRemaining';
import ScoreInfo from 'src/components/ScoreInfo/ScoreInfo';
import FinalResultsModal from 'src/components/FinalResultsModal/FinalResultsModal';
import SettingsModal from 'src/components/SettingsModal/SettingsModal';
import ScoresBlock from 'src/components/ScoresBlock/ScoresBlock';
import { resetGame, startGame, throwBall } from 'src/helpers/gameLogic';
import { countScore } from 'src/helpers/countScore';
import { slots } from 'src/constants/constants';
import { ScreenSize } from 'src/constants/screenSize';

type GameDataType = { [key: number]: number[] };
const initialGameData: GameDataType = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
};

function GameTable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameData, setGameData] = useState<GameDataType>(initialGameData);
  const [rollsLimit, setRollsLimit] = useState<number>(5);
  const [othersSlotNumbers, setOthersSlotNumbers] = useState<number[]>([4, 6]);
  const [ballsThrown, setBallsThrown] = useState<number>(0);
  const [ourTeamScore, setOurTeamScore] = useState<number>(0);
  const [othersTeamScore, setOthersTeamScore] = useState<number>(0);
  const [openFinalResults, setOpenFinalResults] = useState<boolean>(false);
  const [openSettingsModal, setOpenSettingsModal] = useState<boolean>(false);
  const [slotsData, setSlotsData] = useState<{ [key: number]: number }>(slots);

  const [showBall, setShowBall] = useState<boolean>(false);
  const [ballPosition, setBallPosition] = useState<number>(1);
  const [ballStyleLeft, setBallStyleLeft] = useState<string | null>(null);

  const handleGameDataUpdate = (ballNumber: number, squareIndex: number) => {
    setGameData((prevGameData) => {
      const newGameData = { ...prevGameData };

      Object.keys(newGameData).forEach((key) => {
        newGameData[parseInt(key)] = newGameData[parseInt(key)].filter(
          (ball: number) => ball !== ballNumber,
        );
      });

      newGameData[squareIndex] = [...newGameData[squareIndex], ballNumber];

      return newGameData;
    });
  };

  const handleGetGameScreenSize = () => {
    const height = document.documentElement.offsetHeight;

    if (height < 814) {
      return ScreenSize.SMALL;
    }
    if (height > 814 && height < 1000) {
      return ScreenSize.MEDIUM;
    }
    if (height > 1000 && height < 1270) {
      return ScreenSize.LARGE;
    }
    if (height > 1270) {
      return ScreenSize.EXTRA_LARGE;
    }
    return ScreenSize.LARGE;
  };

  const handleRemoveCanvasElements = () => {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach((canvas) => canvas.remove());

    const canvas =
      containerRef.current && containerRef.current.querySelectorAll('canvas');

    if (containerRef.current && canvas?.length === 0) {
      const gameScreenSize = handleGetGameScreenSize();
      startGame(containerRef.current, handleGameDataUpdate, gameScreenSize);
    }
  };

  const handleCloseFinalResults = () => {
    setRollsLimit(5);
    setOpenFinalResults(false);
    setBallsThrown(0);
    setOurTeamScore(0);
    setOthersTeamScore(0);
    setShowBall(false);
    resetGame();
    handleRemoveCanvasElements();
    setGameData(initialGameData);
  };

  const handleSpanClick = (id: number) => {
    if (showBall) {
      setBallPosition(id);
      const spanElement = document.getElementById(id.toString());
      if (spanElement) {
        const spanRect = spanElement.getBoundingClientRect();

        const containerRect = containerRef.current?.getBoundingClientRect();
        if (containerRect)
          setBallStyleLeft(`${spanRect.left - containerRect.left - 10}px`);
      }
    }
  };

  const handleThrowBall = () => {
    const ballElement = document
      .getElementById('ball')
      ?.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();

    setShowBall(false);
    setBallPosition(1);
    setBallStyleLeft(null);

    if (ballElement && containerRect) {
      const gameScreenSize = handleGetGameScreenSize();
      throwBall({
        x: ballElement.left - containerRect.left + 17,
        y: ballElement.top - containerRect.top + 17,
        gameScreenSize,
      });
      setBallsThrown((prev) => ++prev);
    }
  };

  const handlePlayAudio = () => {
    const audio = new Audio(plinkoSoundEffect);
    audio.play();
  };

  const addBall = () => {
    if (rollsLimit > ballsThrown) {
      if (showBall) {
        handleThrowBall();
      } else {
        setShowBall((prev) => !prev);
      }
    }
  };

  useEffect(() => {
    const canvas =
      containerRef.current && containerRef.current.querySelectorAll('canvas');

    if (containerRef.current && canvas?.length === 0) {
      const gameScreenSize = handleGetGameScreenSize();
      startGame(containerRef.current, handleGameDataUpdate, gameScreenSize);
    }
  }, [containerRef]);

  useEffect(() => {
    const { ourTeam, othersTeam } = countScore({
      gameData,
      othersSlotNumbers,
      slotsData,
    });
    setOurTeamScore(ourTeam);
    setOthersTeamScore(othersTeam);

    if (Object.values(gameData).flat().length !== 0) {
      handlePlayAudio();
    }

    if (
      Object.values(gameData).flat().length === rollsLimit &&
      ballsThrown === rollsLimit
    ) {
      setOpenFinalResults(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameData]);

  useEffect(() => {
    if (showBall) {
      const spanElement = document.getElementById(ballPosition.toString());
      if (spanElement) {
        const spanRect = spanElement.getBoundingClientRect();

        const containerRect = containerRef.current?.getBoundingClientRect();
        if (containerRect)
          setBallStyleLeft(`${spanRect.left - containerRect.left - 10}px`);
      }
    }
  }, [showBall, ballPosition]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          if (showBall) {
            setBallPosition((prevPosition) =>
              prevPosition === 1 ? 9 : prevPosition - 1,
            );
          }
          break;

        case 'ArrowRight':
          if (showBall) {
            setBallPosition((prevPosition) =>
              prevPosition === 9 ? 1 : prevPosition + 1,
            );
          }
          break;

        case 'Enter':
          if (showBall) {
            handleThrowBall();
          }
          break;

        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [ballPosition, showBall]);
  return (
    <div>
      <FinalResultsModal
        ourTeamScore={ourTeamScore}
        othersTeamScore={othersTeamScore}
        open={openFinalResults}
        handleClose={handleCloseFinalResults}
      />

      <SettingsModal
        open={openSettingsModal}
        handleClose={() => setOpenSettingsModal(false)}
        checkedSlots={othersSlotNumbers}
        setSlotChecked={setOthersSlotNumbers}
        rollsRemaining={rollsLimit}
        setRollsRemaining={setRollsLimit}
        resetScore={() => {
          handleCloseFinalResults();
          setOthersSlotNumbers([4, 6]);
          setSlotsData(slots);
        }}
        slotsData={slotsData}
        setSlotsData={setSlotsData}
      />

      <div className={styles.rollsRemaining}>
        <RollsRemaining rollsRemaining={rollsLimit - ballsThrown} />
      </div>
      <div className={styles.setingsImage}>
        <button onClick={() => setOpenSettingsModal(true)}>
          <img src={Settings} alt='' />
        </button>
      </div>
      <img
        src={ColourfulBG}
        className={`${styles.centerImage} ${styles.colourfulBG}`}
        alt=''
      />
      <img
        src={Frame}
        className={`${styles.centerImage} ${styles.frame}`}
        alt=''
      />
      <div ref={containerRef} className={styles.board}>
        <PlinkoHeader addBall={addBall} />
        <div className={`${styles.score} ${styles.scoreLeft}`}>
          <ScoreInfo title='OUR TEAM' score={ourTeamScore} />
        </div>
        <div className={`${styles.score} ${styles.scoreRight}`}>
          <ScoreInfo title='OTHER TEAMS' score={othersTeamScore} />
        </div>
        <div className={styles.numbers}>
          {showBall && (
            <span
              id={'ball'}
              className={styles.ball}
              style={{
                left: ballStyleLeft ? ballStyleLeft : '',
                opacity: ballStyleLeft ? '1' : '0',
              }}
            >
              <img src={Ball} alt='Ball' />
            </span>
          )}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <span
              key={number}
              id={number.toString()}
              onClick={() => handleSpanClick(number)}
              style={{ cursor: showBall ? 'pointer' : 'default' }}
            >
              {number}
            </span>
          ))}
        </div>
        <img
          src={LeftWall}
          className={` ${styles.wall} ${styles.wallLeft}`}
          alt=''
        />
        <img
          src={RightWall}
          className={` ${styles.wall} ${styles.wallRight}`}
          alt=''
        />
        <img src={PointLines} className={` ${styles.pointLines}`} alt='' />
        <img src={BoardDots} className={` ${styles.boardDots}`} alt='' />
        <ScoresBlock slotsData={slotsData} />
        <OthersOption othersSlotNumbers={othersSlotNumbers} />
        <img src={Board} className={` ${styles.boardBackground}`} alt='' />
      </div>
    </div>
  );
}

export default GameTable;
