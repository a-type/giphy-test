import * as React from 'react';
import { Grid } from '@giphy/react-components';
import { useSelector, useDispatch } from 'react-redux';
import { selectSearchQuery, focusGif } from './gifsSlice';
import { useGiphyFetch } from '../../services/giphy';
import { useDebounce } from '../../hooks/useDebounce';
import { GifResult } from '@giphy/js-fetch-api';

export function GifGrid() {
  const searchQuery = useSelector(selectSearchQuery);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const fetchGifs = useGiphyFetch(debouncedSearchQuery, 10);

  const dispatch = useDispatch();
  const onGifClick = React.useCallback(
    (gif: GifResult['data'], ev: React.SyntheticEvent) => {
      ev.preventDefault();
      dispatch(focusGif(gif.id.toString()));
    },
    [],
  );

  return (
    <Grid
      /**
       * @note I'm not thrilled about this - I read the source for Giphy's Grid component,
       * and it appears to only call the fetch function on initial mount - so passing
       * a new fetch function has no effect. A key is required to completely remount
       * the component whenever the search term changes.
       * For now I'll keep it, but I may revisit this to create a more sensible implementation
       * that doesn't have quirks that require key usage.
       */
      key={debouncedSearchQuery}
      width={912}
      columns={3}
      fetchGifs={fetchGifs}
      onGifClick={onGifClick}
    />
  );
}
