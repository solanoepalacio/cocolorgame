import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import './App.css';

import GameSetup from './game/GameSetup';
import GamePlay from './game/GamePlay';
import ScoreBoard from './game/ScoreBoard';

const track = () => {
  const referrer = document.referrer;
  const browser = _.get(window, 'navigator.appName');
  const platform = _.get(window, 'navigator.platform');
  fetch('https://sf27prmmu5.execute-api.us-east-1.amazonaws.com/dev/session/start', {
    method: 'POST',
    body: JSON.stringify({
      referrer, platform, browser,
    }),
  })
};

function App() {
  useEffect(() => {
    track();
  });
  
  const [ gameSetup, setGameSetup ] = useState(null);
  const [ gameScoreBoard, setGameScoreBoard ] = useState(null);

  const restart = () => {
    setGameSetup(null);
    setGameScoreBoard(null);
  };

  const gameOver = (scoreBoard) => {
    setGameScoreBoard(scoreBoard);
  };

  return gameScoreBoard
    ? <ScoreBoard scoreBoard={gameScoreBoard} restart={restart} />
    : gameSetup && !gameSetup.transitionActive
    ? <GamePlay {...{ gameSetup, restart, gameOver }} />
    : <GameSetup onSetupDone={ setGameSetup }  />;
}

export default App;
