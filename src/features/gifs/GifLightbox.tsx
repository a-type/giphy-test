import * as React from 'react';
import { Dialog } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { clearGifFocus, selectFocusedGif } from './gifsSlice';
import { Gif } from '@giphy/react-components';
import { useWindowSize } from '../../hooks/useWindowSize';

export function GifLightbox() {
  const gif = useSelector(selectFocusedGif);

  const dispatch = useDispatch();
  const onClose = React.useCallback(() => {
    dispatch(clearGifFocus());
  }, [dispatch]);

  // we want the lightbox to take up a good portion of the screen on
  // every screen size, so we'll need this
  const { width: windowWidth } = useWindowSize();

  return (
    <Dialog open={!!gif} onClose={onClose} maxWidth={false}>
      {!!gif && <Gif gif={gif} width={windowWidth * 0.75} />}
    </Dialog>
  );
}
