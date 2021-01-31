import _ from 'lodash';
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Button, Typography, TextField, Menu } from '@material-ui/core';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

import { makeStyles } from '@material-ui/core/styles';

import Box from '../../components/ColorBox';

import boardImage from './makeymakeyclassic.png';

const requireColorImages = (color) => require(`../../image-urls/${color}.json`);

const imagesByColor = {
  red: requireColorImages('red'),
  blue: requireColorImages('blue'),
  green: requireColorImages('green'),
  purple: requireColorImages('purple'),
  yellow: requireColorImages('yellow'),
  orange: requireColorImages('orange'),
};

const pickRandom = (array) => array.splice((Math.random() * array.length) | 0, 1)[0];

const createGame = (questionsCount, boardColorConfig) => {
  const selectedColors = Object.values(boardColorConfig);
  const gameColors = _.pick(_.cloneDeep(imagesByColor), selectedColors);

  return _.filter(_.range(questionsCount).map(() => {
    const color = _.sample(selectedColors);
    const image = pickRandom(gameColors[color]);
    return image ? { color, image } : null;
  }));
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
  },
  menuGrid: {
    padding: '16px 32px',
    overflow: 'hidden',
  }
}));

const ColorPicker = ({ interactionName, color, setColor }) => {
  const classes = useStyles();
  return (
    <Grid container justify="space-around" alignItems="center" item>
      <Grid container alignItems="center">
        <Grid item xs={3}><Box color={color} /></Grid>
        <Grid item xs={6}>{interactionName}</Grid>
        <Grid item xs={3}>
          <PopupState variant="popover" popupId='somecrazyid'>
            {(popupState) => (
              <React.Fragment>
                <Button color="primary" {...bindTrigger(popupState)}>Change</Button>
                <Menu className={classes.modalPaper} {...bindMenu(popupState)}>
                  <Grid container direction="column" spacing={3} className={classes.menuGrid}>
                    <Grid item xs={12}>
                      <Typography variant="h5" id="transition-modal-title">Select Color:</Typography>
                    </Grid>
                    <Grid container spacing={2} item xs={12}>
                      {Object.keys(imagesByColor).map(color => {
                        return (
                          <Grid key={color} item xs onClick={() => setColor(color) && popupState.close()}>
                            <Box color={color} />
                          </Grid>
                        )
                      })}
                    </Grid>
                  </Grid>
                </Menu>
              </React.Fragment>)}
          </PopupState>
        </Grid>
      </Grid>
    </Grid>
  );
};

const ColorConfigColumn = ({ colorConfigs, setInteraction }) => {
  const classes = useStyles();
  return colorConfigs.map(([interaction, color]) => {
    return (
      <Grid item xs={6} key={[interaction, color].join('-')}>
        <Paper className={classes.paper}>
          <Grid container spacing={1}>
            <Grid container direction="column" spacing={2} item xs={12}>
              <ColorPicker interactionName={interaction} color={color} setColor={(newColor) => setInteraction(interaction, newColor)} />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  });
}

export default function GameSetup({ onSetupDone }) {
  const [boardColorConfig, setBoardColorConfig] = useState({
    ArrowUp: 'green',
    ArrowDown: 'purple',
    ArrowLeft: 'blue',
    ArrowRight: 'red',
    Space: 'yellow',
    Click: 'orange',
  });

  const [questionsCount, setQuestionsCount] = useState(10);

  const classes = useStyles();

  const [leftColors, rightColors] = _.chunk(Object.entries(boardColorConfig), 3);

  const setInteraction = (interaction, color) => {
    setBoardColorConfig({
      ...boardColorConfig,
      [interaction]: color,
    });
  };

  return (
    <Grid container spacing={3} justify="center" alignItems="center" item xs={12}>
      <Grid container justify="center" item xs={12}>
          <Typography variant="h2">Game Setup</Typography>
      </Grid>
      <Grid container spacing={3} justify="center" alignItems="center">
        <Grid item xs={6}>
          <Paper className={classes.paper} >
            <img width="720" src={boardImage} alt="" />
          </Paper>
        </Grid>

        <Grid container spacing={2} item xs={6}>
          <Grid container spacing={2} item xs={12}>
            {boardColorConfig && <ColorConfigColumn colorConfigs={leftColors} setInteraction={setInteraction} />}
            {boardColorConfig && <ColorConfigColumn colorConfigs={rightColors} setInteraction={setInteraction} />}
          </Grid>


          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container justify="space-around" item xs={12}>
                <Typography>Pictures amount to show:</Typography>
                <TextField
                  color="secondary"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={questionsCount}
                  onChange={(e) => setQuestionsCount(e.target.value)}
                />
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Grid item xs={12} container direction="column" alignItems="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => onSetupDone({ questionSet: createGame(questionsCount, boardColorConfig), boardColorConfig })}>start game
                </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
