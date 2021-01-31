import React from 'react';
import { Grid, Paper, Typography, Divider, Button, Box } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import ColorBox from '../../components/ColorBox';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(3, 6),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    flexGrow: 1,
  },
}));

export default function ScoreBoard({ scoreBoard, restart }) {
  const classes = useStyles();
  const { totalHits, totalMisses } = Object.values(scoreBoard).reduce(({ totalHits, totalMisses }, { hits, misses }) => {
    return {
      totalHits: totalHits + hits,
      totalMisses: totalMisses + misses,
    };
  }, { totalHits: 0, totalMisses: 0 });
  return (
    <Box mt={6}>
    <Grid container justify="center">
      <Grid item xs={6}>
        <Paper className={classes.paper}>
          <Grid container direction="column" alignItems="center" spacing={3}>
            <Typography variant="h2" style={{ marginBottom: '16px' }}>Results:</Typography>
            <Grid container direction="column" spacing={5} item>
              {Object.entries(scoreBoard).map(([color, { total, hits, misses }]) => {
                return (
                  <div style={{ marginBottom: "16px" }}>
                    <Divider></Divider>
                    <Grid container key={color}>
                      <Grid container spacing={2} alignItems="center" item xs>
                        <Grid item>
                          <ColorBox color={color} />
                        </Grid>
                        <Grid item>
                          <Typography variant="h6">{color.toUpperCase()}:</Typography>
                        </Grid>
                      </Grid>
                      <Grid container direction="column" alignItems="flex-start" justify="center" spacing={2} item xs>
                        <Grid item >
                          <Typography variant="h5">Hits: {hits} | Misses: {misses}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                );
              })}
              <div>
                <Divider />
                <Grid container justify="center">
                  <Grid item>
                    <Typography variant="h6">Total Hits: {totalHits}  |  Total Misses: {totalMisses}</Typography>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
        </Paper>
        <Box mt={3}>
          <Grid container justify="center" item xs={12} >
            <Button variant="contained" color="secondary" onClick={restart}>restart</Button>
          </Grid>
        </Box>
      </Grid>
    </Grid>
    </Box>
  );
}
