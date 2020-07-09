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
import { useScrollPosition } from '../../hooks/useScrollPosition';

// a pixel buffer for the virtualization - we'll keep rendering items
// even if they're this many pixels past the visible viewport.
// This value is a tradeoff - too large and the performance suffers,
// too small and scrolling upward looks like something broke. But
// since users generally don't scroll upward as often as downward,
// we can keep it a little tight - about 1 average screen height.
const VIRTUALIZATION_BUFFER = 1600;

function useColumns() {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.up('sm'));
  const isLarge = useMediaQuery<Theme>((theme) => theme.breakpoints.up('md'));

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

/**
 * This is a custom masonry grid designed to render the fetched
 * Giphy GIFs. It's responsive, loads infinitely, and virtualizes
 * the items as they move offscreen to keep performance smooth.
 */
export function GifGrid({ gap = 8 }: { gap?: number }) {
  const classes = useStyles();

  const dispatch = useDispatch();

  // called when the infinite scroll trigger enters the viewport.
  // fetches the next page of GIFs. The fact that this gets
  // called on initial page load (since the trigger mounts and
  // immediately fires) provides our initial gif load naturally.
  const onVisibilityTriggerVisible = React.useCallback(() => {
    dispatch(fetchNextPage({ newSearch: false }));
  }, [dispatch]);

  // attached to each Giphy Gif component. Opens the lightbox.
  const onGifClick = React.useCallback(
    (gif: GifResult['data'], ev: React.SyntheticEvent) => {
      // preventing default is necessary since Giphy makes its Gif components
      // links by default with no way to override that behavior otherwise.
      ev.preventDefault();
      dispatch(focusGif(gif.id.toString()));
    },
    [dispatch],
  );

  // selecting various state pieces we need to render the grid
  const gifs = useSelector(selectGifs);
  const loading = useSelector(selectLoadingGifsPage);
  const hasNextPage = useSelector(selectHasNextPage);

  // custom masonry grid code below

  // column count is computed responsively
  const columns = useColumns();

  const scrollPosition = useScrollPosition();

  // measuring the container element's width determines the width of each column,
  // which we need to define before we can compute the heights of the elements
  const [gridProps, { width }] = useMeasure<HTMLDivElement>();
  // column width is determined by container width, accommodating the gaps between elements
  const columnWidth = width / columns - gap * (columns - 1);
  // to do a decent masonry layout you have to do a bit of computation within the render cycle.
  // possibly, this could be cached or otherwise done out-of-band, but that's an optimization.
  // To start, we create an array of column heights we will track
  const heights = new Array(columns).fill(0);
  // then, computing CSS transform values for each GIF item
  const itemData = gifs.map((gif) => {
    // selects the shortest column to place this item in
    const column = heights.indexOf(Math.min(...heights));

    // measure the GIF
    const height = getGifHeight(gif, columnWidth);

    // compute the pixel transform
    const transform = `translate3d(${(width / columns + gap) * column}px, ${
      heights[column]
    }px, 0)`;

    // update the column height, including gap
    heights[column] = heights[column] + height + gap;

    return {
      transform,
      /**
       * @note for performance reasons, on any infinite list you want
       * to virtualize. The cool thing about an absolute-positioned
       * masonry grid like this is virtualization is dead simple - you
       * simply stop rendering the items you can't see anymore. There's
       * no need to worry about that affecting the positions of the ones you can.
       */
      visible:
        heights[column] + height >= scrollPosition - VIRTUALIZATION_BUFFER,
    };
  });

  return (
    <>
      <div
        {...gridProps}
        className={classes.root}
        style={{ height: Math.max(...heights) }}
      >
        {width &&
          gifs.map((gif, i) => {
            const { transform, visible } = itemData[i];

            // this is the virtualization - just don't render it!
            if (!visible) return null;

            return (
              <Gif
                key={gif.id}
                gif={gif}
                width={columnWidth || 100}
                className={classes.cell}
                style={{
                  // assigning the correct CSS transform for this item
                  transform,
                }}
                onGifClick={onGifClick}
              />
            );
          })}
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
