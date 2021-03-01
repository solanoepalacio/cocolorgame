import { Grid } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import DoneAllIcon from '@material-ui/icons/DoneAll';

const CheckAnimation = () => {
  return <DoneAllIcon style={{ color: '#1CC610', fontSize: '800px' }} className="hit-animation"/>
};

const CrossAnimation = () => {
  return <CloseIcon style={{ color: 'blue', fontSize: '85px' }} />
}

export default function FrameTransition({ isHit }) {
  return (
    <Grid container styles={{ width: '100%', height: '100%' }} justify="center" >
      { isHit ? <CheckAnimation /> : <CrossAnimation /> }
    </Grid>
  )
}