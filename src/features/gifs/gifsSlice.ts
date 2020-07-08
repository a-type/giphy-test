import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface GifsState {
  searchQuery: string;
  focusedGifId: string | null;
}

const initialState: GifsState = {
  searchQuery: '',
  focusedGifId: null,
};

export const gifsSlice = createSlice({
  name: 'gifs',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    focusGif: (state, action: PayloadAction<string>) => {
      state.focusedGifId = action.payload;
    },
    clearGifFocus: (state) => {
      state.focusedGifId = null;
    },
  },
});

export const { reducer } = gifsSlice;

export const { setSearchQuery, focusGif, clearGifFocus } = gifsSlice.actions;

export const selectSearchQuery = (state: RootState) => state.gifs.searchQuery;
export const selectFocusedGifId = (state: RootState) => state.gifs.focusedGifId;
