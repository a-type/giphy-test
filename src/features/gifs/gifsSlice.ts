import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface GifsState {
  searchQuery: string;
}

const initialState: GifsState = {
  searchQuery: '',
};

export const gifsSlice = createSlice({
  name: 'gifs',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { reducer } = gifsSlice;

export const { setSearchQuery } = gifsSlice.actions;

export const selectSearchQuery = (state: RootState) => state.gifs.searchQuery;
