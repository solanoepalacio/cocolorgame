import React, { useState } from 'react';
import './App.css';

import GameSetup from './game/GameSetup';
import GamePlay from './game/GamePlay';
import ScoreBoard from './game/ScoreBoard';

function App() {
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
    : gameSetup
    ? <GamePlay {...{ gameSetup, restart, gameOver }} />
    : <GameSetup onSetupDone={ setGameSetup }  />;
}

export default App;
