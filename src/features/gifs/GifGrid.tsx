import React from 'react';
import { Grid } from '@giphy/react-components';
import { useSelector, useDispatch } from 'react-redux';
import { selectSearchQuery } from './gifsSlice';
import { useGiphyFetch } from '../../services/giphy';

export function GifGrid() {
  const searchQuery = useSelector(selectSearchQuery);
  const fetchGifs = useGiphyFetch(searchQuery, 10);

  return <Grid width={800} columns={3} fetchGifs={fetchGifs} />;
}
