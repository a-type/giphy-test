import * as React from 'react';
import { Gif } from '@giphy/react-components';
import { useSelector, useDispatch } from 'react-redux';
import {
  focusGif,
  selectGifs,
  fetchNextPage,
  selectLoadingGifsPage,
  selectHasNextPage,
} from './gifsSlice';
import { getGifHeight } from '@giphy/js-util';
import { GifResult } from '@giphy/js-fetch-api';
import {
  useMediaQuery,
  Theme,
  CircularProgress,
  makeStyles,
  Box,
} from '@material-ui/core';
import { useMeasure } from '../../hooks/useMeasure';
import { VisibilityTrigger } from '../../components/VisibilityTrigger';

function useColumns() {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.up('xs'));
  const isLarge = useMediaQuery<Theme>((theme) => theme.breakpoints.up('lg'));

  if (isLarge) return 4;
  else if (isSmall) return 2;
  return 1;
}

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    position: 'relative',
  },
  cell: {
    position: 'absolute',
    left: 0,
    opacity: 0,
    top: 32,
    animationName: '$fadeUp',
    animationDuration: '800ms',
    animationTimingFunction: 'ease-out',
    animationFillMode: 'forwards',
  },
  '@keyframes fadeUp': {
    from: { opacity: 0, top: 32 },
    to: { opacity: 1, top: 0 },
  },
}));

export function GifGrid({ gap = 8 }: { gap?: number }) {
  const classes = useStyles();

  const dispatch = useDispatch();

  const onVisibilityTriggerVisible = React.useCallback(() => {
    dispatch(fetchNextPage());
  }, [dispatch]);

  const onGifClick = React.useCallback(
    (gif: GifResult['data'], ev: React.SyntheticEvent) => {
      ev.preventDefault();
      dispatch(focusGif(gif.id.toString()));
    },
    [],
  );

  const gifs = useSelector(selectGifs);
  const loading = useSelector(selectLoadingGifsPage);
  const hasNextPage = useSelector(selectHasNextPage);

  // custom masonry grid code below
  const columns = useColumns();
  const [gridProps, { width }] = useMeasure<HTMLDivElement>();
  const columnWidth = width / columns - gap * (columns - 1);
  // begin tracking column heights
  const heights = new Array(columns).fill(0);
  const transforms = gifs.map((gif) => {
    // selects the shortest column to place this item in
    const column = heights.indexOf(Math.min(...heights));

    // measure the GIF
    const height = getGifHeight(gif, columnWidth);

    const transform = `translate3d(${(width / columns + gap) * column}px, ${
      heights[column]
    }px, 0)`;

    heights[column] = heights[column] + height + gap;

    return transform;
  });

  return (
    <>
      <div
        {...gridProps}
        className={classes.root}
        style={{ height: Math.max(...heights) }}
      >
        {width &&
          gifs.map((gif, i) => (
            <Gif
              key={gif.id}
              gif={gif}
              width={columnWidth || 100}
              className={classes.cell}
              style={{
                transform: transforms[i],
              }}
              onGifClick={onGifClick}
            />
          ))}
      </div>
      {hasNextPage && (
        <Box
          // a nice wide space so the user's scroll feels uninterrupted
          height="75vh"
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="100%"
        >
          <VisibilityTrigger onVisible={onVisibilityTriggerVisible} />
          {loading && <CircularProgress />}
        </Box>
      )}
    </>
  );
}
