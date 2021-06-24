import _ from 'lodash';
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Button, Typography, TextField, Menu } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import SpaceBarIcon from '@material-ui/icons/SpaceBar';
import MouseIcon from '@material-ui/icons/Mouse';

import styles from './game-setup.module.css'
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
  const imagesByColorClone = _.pick(_.cloneDeep(imagesByColor), selectedColors);

  const gameQuestions = _.reduce(selectedColors, (questions, color) => {
    const colorImages = _.range(questionsCount).map(() => {
      return { color, image: pickRandom(imagesByColorClone[color]) };
    });

    return questions.concat(colorImages);
  }, []);
  const a = _.shuffle(gameQuestions);
  console.log('gamequestions', a);
  return a;
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
  },
  clickable: {
    cursor: 'pointer'
  }
}));

const ColorPicker = ({ interactionName, color, setColor, direction = "row" }) => {
  const iconsByInteractionName = {
    ArrowUp: ArrowUpwardIcon,
    ArrowDown: ArrowDownwardIcon,
    ArrowLeft: ArrowBackIcon,
    ArrowRight: ArrowForwardIcon,
    Space: SpaceBarIcon,
    Click: MouseIcon,
  };

  const classes = useStyles();
  const Icon = iconsByInteractionName[interactionName];
  const fontSize = '52px';
  return (
    <Grid container justify="space-around" alignItems="center" justify={direction === "column" ? "center" : undefined} item>
      <PopupState variant="popover" popupId='somecrazyid'>
        {(popupState) => (
          <React.Fragment>
            <Paper className={[classes.paper, classes.clickable].join(' ')} {...bindTrigger(popupState)}>
              <Grid container alignItems="center" direction={direction}>
                <Icon style={{ color, fontSize }} />
              </Grid>
            </Paper>
            <Menu className={classes.modalPaper} {...bindMenu(popupState)}>
              <Grid container direction="column" spacing={3} className={classes.menuGrid}>
                <Grid item xs={12}>
                  <Typography variant="h5" id="transition-modal-title">Select Color:</Typography>
                </Grid>
                <Grid container spacing={2} item xs={12}>
                  {Object.keys(imagesByColor).map(color => {
                    return (
                      <Grid key={color} item xs onClick={() => setColor(color) || popupState.close()}>
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
  );
};

export default function GameSetup({ onSetupDone }) {
  const [boardColorConfig, setBoardColorConfig] = useState({
    ArrowUp: 'green',
    ArrowDown: 'purple',
    ArrowLeft: 'blue',
    ArrowRight: 'red',
    Space: 'yellow',
    Click: 'orange',
  });

  const [ questionsCount, setQuestionsCount ] = useState(4);
  const [ frameTransitionDelay, setFrameTransitionDelay ] = useState(120);

  const classes = useStyles();

  const setInteraction = (interaction, color) => {
    console.log('setting interaction', interaction, color);
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

        <Grid container spacing={7} item xs={6}>
          <Grid container item xs={12} justify="center">

            {/* Arrow Buttons */}
            <Grid container spacing={2} item xs={6}>
              <Grid container item xs={12} justify="center">
                <ColorPicker
                  direction="column"
                  interactionName="ArrowUp"
                  color={boardColorConfig['ArrowUp']}
                  setColor={(newColor) => setInteraction("ArrowUp", newColor)}
                />
              </Grid>
              <Grid container item xs={12} justify="center">
                <Grid item justify="flex-end">
                  <ColorPicker
                    interactionName="ArrowLeft"
                    color={boardColorConfig["ArrowLeft"]}
                    setColor={(newColor => setInteraction("ArrowLeft", newColor))}
                  />
                </Grid>
                <Grid xs={3} />
                <Grid item justify="flex-start">
                  <ColorPicker
                    interactionName="ArrowRight"
                    color={boardColorConfig["ArrowRight"]}
                    setColor={(newColor => setInteraction("ArrowRight", newColor))}
                  />
                </Grid>
              </Grid>
              <Grid container item xs={12} justify="center" >
                <ColorPicker
                  direction="column"
                  interactionName="ArrowDown"
                  color={boardColorConfig['ArrowDown']}
                  setColor={(newColor) => setInteraction("ArrowDown", newColor)}
                />
              </Grid>
            </Grid>

            {/* Space + Click */}
            <Grid container spacing={2} item xs={3}>
              <Grid container item xs={6}>
                <ColorPicker
                  interactionName="Space"
                  color={boardColorConfig['Space']}
                  setColor={(newColor) => setInteraction("Space", newColor)}
                />
              </Grid>
              <Grid container item xs={6}>
                <ColorPicker
                  interactionName="Click"
                  color={boardColorConfig['Click']}
                  setColor={(newColor) => setInteraction("Click", newColor)}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container>
                <Grid container justify="space-around" item xs={6}>
                  <Typography>Pictures/Color:</Typography>
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
                <Grid container justify="space-around" item xs={6}>
                  <Typography>Frame Transition Delay (ms):</Typography>
                  <TextField
                    color="secondary"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={frameTransitionDelay}
                    onChange={(e) => setFrameTransitionDelay(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Grid item xs={12} container direction="column" alignItems="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => onSetupDone({ questionSet: createGame(questionsCount, boardColorConfig), boardColorConfig, frameTransitionDelay })}>start game
                </Button>
        </Grid>
      </Grid>
      <div className={styles.watermarkLayout}>
        <Grid container justify="center" alignItems="center">
          <Typography variant="subtitle1" style={{ color: "gray" }} >Coded with&nbsp;</Typography><FavoriteIcon style={{ color: 'black' }} /><Typography style={{ color: "gray" }}>&nbsp;for Cocó</Typography>
        </Grid>
      </div>
    </Grid>
  );
};
