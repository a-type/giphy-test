import * as React from 'react';
import { makeStyles, Theme, Modal, Paper } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { selectFocusedGifId, clearGifFocus } from './gifsSlice';
import { Gif } from '@giphy/react-components';
import { useGiphyGif } from '../../services/giphy';

export type GifLightboxProps = {};

const useStyles = makeStyles<Theme, GifLightboxProps>((theme) => ({
  paper: {
    position: 'absolute',
    width: 400 + theme.spacing(4),
    padding: theme.spacing(2),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

export function GifLightbox(props: GifLightboxProps) {
  const classes = useStyles(props);
  const {} = props;

  const focusedId = useSelector(selectFocusedGifId);

  const { gif, loading, error } = useGiphyGif(focusedId);

  const dispatch = useDispatch();
  const onClose = React.useCallback(() => {
    dispatch(clearGifFocus());
  }, [dispatch]);

  return (
    <Modal open={!!focusedId} onClose={onClose}>
      <Paper className={classes.paper}>
        {!!gif && <Gif gif={gif} width={400} />}
      </Paper>
    </Modal>
  );
}
