import { useEffect, useRef, useState } from 'react';

import ColourfulBG from 'src/assets/ColourfulBG.png';
import Frame from 'src/assets/Frame.png';
import LeftWall from 'src/assets/LeftWall.png';
import RightWall from 'src/assets/RightWall.png';
import PointLines from 'src/assets/PointLines.png';
import BoardDots from 'src/assets/BoardDots.png';
import Board from 'src/assets/Board.png';
import Scores from 'src/assets/Scores.png';
import Ball from 'src/assets/Ball.png';
import Settings from 'src/assets/Settings.png';

import styles from './GameTable.module.scss';
import PlinkoHeader from 'src/components/PlinkoHeader/PlinkoHeader';
import OthersOption from 'src/components/OthersOption/OthersOption';
import RollsRemaining from 'src/components/RollsRemaining/RollsRemaining';
import ScoreInfo from 'src/components/ScoreInfo/ScoreInfo';
import { startGame, throwBall } from 'src/helpers/gameLogic';
import { countScore } from 'src/helpers/countScore';

function GameTable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameData, setGameData] = useState<{
    [key: number]: number[];
  }>({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
  });
  const [rollsLimit, setRollsLimit] = useState<number>(10);
  const [othersSlotNumbers, setOthersSlotNumbers] = useState<number[]>([4, 6]);
  const [ballsThrown, setBallsThrown] = useState<number>(0);
  const [ourTeamScore, setOurTeamScore] = useState<number>(0);
  const [othersTeamScore, setOthersTeamScore] = useState<number>(0);

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

  const addBall = () => {
    if (rollsLimit > ballsThrown) {
      setShowBall((prev) => !prev);
    }
  };

  useEffect(() => {
    const canvas =
      containerRef.current && containerRef.current.querySelectorAll('canvas');

    if (containerRef.current && canvas?.length === 0) {
      startGame(containerRef.current, handleGameDataUpdate);
    }
  }, [containerRef]);

  useEffect(() => {
    const { ourTeam, othersTeam } = countScore({ gameData, othersSlotNumbers });
    setOurTeamScore(ourTeam);
    setOthersTeamScore(othersTeam);
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
          setBallPosition((prevPosition) =>
            prevPosition === 1 ? 9 : prevPosition - 1,
          );
          break;

        case 'ArrowRight':
          setBallPosition((prevPosition) =>
            prevPosition === 9 ? 1 : prevPosition + 1,
          );
          break;

        case 'Enter':
          if (showBall) {
            const ballElement = document
              .getElementById('ball')
              ?.getBoundingClientRect();
            const containerRect = containerRef.current?.getBoundingClientRect();

            setShowBall(false);
            setBallPosition(1);
            setBallStyleLeft(null);

            if (ballElement && containerRect) {
              throwBall({
                x: ballElement.left - containerRect.left + 17,
                y: ballElement.top - containerRect.top + 17,
              });
              setBallsThrown((prev) => ++prev);
            }
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
      <div className={styles.rollsRemaining}>
        <RollsRemaining rollsRemaining={rollsLimit - ballsThrown} />
      </div>

      <div className={styles.setingsImage}>
        <img src={Settings} alt='' />
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
          <span id={'1'}>1</span>
          <span id={'2'}>2</span>
          <span id={'3'}>3</span>
          <span id={'4'}>4</span>
          <span id={'5'}>5</span>
          <span id={'6'}>6</span>
          <span id={'7'}>7</span>
          <span id={'8'}>8</span>
          <span id={'9'}>9</span>
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
        <img src={Scores} className={` ${styles.scores}`} alt='' />
        <OthersOption othersSlotNumbers={othersSlotNumbers} />
        <img src={Board} className={` ${styles.boardBackground}`} alt='' />
      </div>
    </div>
  );
}

export default GameTable;
