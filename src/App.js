import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import './App.css';

import GameSetup from './game/GameSetup';
import GamePlay from './game/GamePlay';
import ScoreBoard from './game/ScoreBoard';
import Config from './config';

const track = () => {
  if (!process.env.NODE_ENV === 'development') return;
  
  const referrer = document.referrer;
  const browser = _.get(window, 'navigator.appName');
  const platform = _.get(window, 'navigator.platform');
  fetch(Config.aticsUrl, {
    method: 'POST',
    body: JSON.stringify({
      referrer, platform, browser,
    }),
  });
};

function App() {
  console.log('process.env', process.env)
  useEffect(track);
  const [ gameSetup, setGameSetup ] = useState(null);
  const [ gameScoreBoard, setGameScoreBoard ] = useState(null);

  const restart = () => {
    setGameSetup(null);
    setGameScoreBoard(null);
  };

  const gameOver = (scoreboard) => {
    setGameScoreBoard(scoreboard);
  };

  return gameScoreBoard
    ? <ScoreBoard scoreboard={gameScoreBoard} restart={restart} />
    : gameSetup && !gameSetup.transitionActive
    ? <GamePlay {...{ gameSetup, restart, gameOver }} />
    : <GameSetup onSetupDone={ setGameSetup }  />;
}

export default App;
