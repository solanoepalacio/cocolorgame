import { Button, Grid, Typography } from '@material-ui/core';
import _ from 'lodash';
import { useEffect, useState } from "react";
import styles from './game-play.module.css';
import FrameTransition from '../../components/FrameTransition';

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

const createTransitionStatus = () => {
  return { active: false, hit: false };
};

export default function GamePlay({ gameSetup: { boardColorConfig, questionSet }, restart, gameOver }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scoreBoard, setScoreBoard] = useState(buildScore(questionSet));
  const [transitionStatus, setTransitionStatus] = useState(createTransitionStatus())
  const question = _.get(questionSet, questionIndex);
  // console.log('gameplay received boardColorConfig', boardColorConfig);
  const onInteraction = async (event) => {
    if (transitionStatus.active) return;
    console.log('comparing with boardColorConfig', boardColorConfig);
    const interactionName = getInteractionName(event);
    if (!Object.keys(boardColorConfig).includes(interactionName) || !question) return;

    const colorPicked = _.get(boardColorConfig, interactionName);
    const isHit = colorPicked === question.color;
    console.log('question, pick, hit', question.color, colorPicked, isHit);

    const newScoreBoard = updateScoreBoard(scoreBoard, question.color, isHit);
    setScoreBoard(newScoreBoard);

    setTransitionStatus({ active: true, hit: isHit });
    setTimeout(() => setQuestionIndex(questionIndex + 1), 0);

    const frameTransitionTime = isHit ? 900 : 120;

    setTimeout(() => setTransitionStatus({ active: false }), frameTransitionTime);
  };

  useEffect(() => {
    document.addEventListener('click', onInteraction);
    document.addEventListener('keydown', onInteraction);
    return () => {
      document.removeEventListener('click', onInteraction);
      document.removeEventListener('keydown', onInteraction);
    }
  });

  if (!question && !transitionStatus.active) {
    gameOver(scoreBoard);
    return null;
  }

  const handleRestart = (e) => {
    e.stopPropagation();
    restart();
  };

  return (
    <div className={styles.container}>
      <Grid container spacing={4} justify="center">
        <Grid container item xs={8} justify="flex-end">
          <Typography>{questionIndex} / {questionSet.length}</Typography>
        </Grid>
        <Grid className={ styles.container} container item xs={12} justify="center" alignItems="center" >
            {
              transitionStatus.active ? <FrameTransition isHit={transitionStatus.hit}/> : <div className={styles.imageContainer} style={{ backgroundImage: `url(${question.image})` }}></div>
            }
        </Grid>
        <Grid container item xs={12} justify="center">
          <Button variant="contained" color="secondary" onClick={handleRestart}>restart</Button>
        </Grid>
      </Grid>
    </div>
  );
}
