import { Button, Grid, Typography } from '@material-ui/core';
import _ from 'lodash';
import { useEffect, useState, useRef } from "react";
import styles from './game-play.module.css';
import FrameTransition from '../../components/FrameTransition';
import useSound from 'use-sound';

import beep from '../../sounds/beep.mp3';
import chimes from '../../sounds/chimes.mp3';

const getInteractionName = (event) => {
  const { type, code } = event;
  return type === 'click' ? 'Click' : code;
};

const buildScore = (questionSet) => _.reduce(questionSet, (scoreByColors, { color }) => {
  const colorData = _.get(scoreByColors, color, { total: 0, hits: 0, misses: 0 });
  _.set(scoreByColors, color, { ...colorData, total: colorData.total + 1 });
  return scoreByColors;
}, {});

const updateScoreBoard = (scoreBoard, color, hit) => {
  const newScoreBoard = _.cloneDeep(scoreBoard);
  const colorScore = _.get(newScoreBoard, color);
  const addTo = hit ? 'hits' : 'misses';
  const currentValue = colorScore[addTo];
  _.set(colorScore, addTo, currentValue + 1);
  return newScoreBoard;
};

export default function GamePlay({ gameSetup: { boardColorConfig, questionSet, frameTransitionDelay, questionTimeoutSecs }, restart, gameOver }) {
  const [playBeep] = useSound(beep);
  const [playChimes] = useSound(chimes);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [scoreBoard, setScoreBoard] = useState(buildScore(questionSet));

  const transitionStatusRef = useRef({ active: false, hit: false });
  const [transitionStatus, setTransitionStatus] = useState({ active: false, hit: false });

  const updateTransitionStatus = (newStatus) => {
    transitionStatusRef.current = newStatus;
    setTransitionStatus(newStatus);
  };

  const question = _.get(questionSet, questionIndex);

  const nextFrame = (isHit, noDelay) => {
    if (isHit) playChimes()
    else playBeep();

    const newScoreBoard = updateScoreBoard(scoreBoard, question.color, isHit);
    setScoreBoard(newScoreBoard);

    updateTransitionStatus({ active: true, hit: isHit });
    setTimeout(() => setQuestionIndex(questionIndex + 1), 0);

    const frameTransitionTime = noDelay ? 120 : Math.max(frameTransitionDelay, isHit ? 900 : 120);

    setTimeout(() => {
      updateTransitionStatus({ active: false, isHit: null });
    }, frameTransitionTime);
  };

  const questionTimeoutRef = useRef(null);
  const onInteraction = async (event) => {
    if (transitionStatusRef.active) return;
    const interactionName = getInteractionName(event);
    if (!Object.keys(boardColorConfig).includes(interactionName) || !question) return;

    if (questionTimeoutRef.current) {
      clearTimeout(questionTimeoutRef.current)
    }

    const colorPicked = _.get(boardColorConfig, interactionName);
    const isHit = colorPicked === question.color;

    nextFrame(isHit, false);
  };

  useEffect(() => {
    if (questionIndex === 0) {
      console.log('boardColorConfig', boardColorConfig);
      // the following beep wont be heard. For some reason sounds are played from the second time and on :shrug:
      playBeep();
    }

    document.addEventListener('click', onInteraction);
    document.addEventListener('keydown', onInteraction);

    if (questionIndex < questionSet.length && !transitionStatus.active) {
      questionTimeoutRef.current = setTimeout(() => {
        nextFrame(false, true);
      }, questionTimeoutSecs * 1000);
    }

    return () => {
      document.removeEventListener('click', onInteraction);
      document.removeEventListener('keydown', onInteraction);
    }
  }, [questionIndex, transitionStatus]);

  if (!question && !transitionStatus.active) {
    gameOver(scoreBoard);
    return null;
  }

  const handleRestart = (e) => {
    if (questionTimeoutRef.current) clearTimeout(questionTimeoutRef.current)
    e.stopPropagation();
    restart();
  };

  return (
    <div className={styles.container}>
      <Grid container spacing={4} justify="center">
        <Grid container item xs={8} justify="flex-end">
          <Typography>{questionIndex} / {questionSet.length}</Typography>
        </Grid>
        <Grid className={styles.container} container item xs={12} justify="center" alignItems="center" >
          {
            transitionStatus.active ? <FrameTransition isHit={transitionStatus.hit} /> : <div className={styles.imageContainer} style={{ backgroundImage: `url(${question.image})` }}></div>
          }
        </Grid>
        <Grid container item xs={12} justify="center">
          <Button variant="contained" color="secondary" onClick={handleRestart}>restart</Button>
        </Grid>
      </Grid>
    </div>
  );
}
