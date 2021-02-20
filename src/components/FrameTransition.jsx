import { Grid } from '@material-ui/core';

import DoneAllIcon from '@material-ui/icons/DoneAll';

const CheckAnimation = () => {
  return <DoneAllIcon style={{ color: '#1CC610', fontSize: '800px' }} className="hit-animation"/>
};

export default function FrameTransition({ isHit }) {
  return (
    <Grid container styles={{ width: '100%', height: '100%' }} >
      { isHit ? <CheckAnimation /> : null }
    </Grid>
  )
}