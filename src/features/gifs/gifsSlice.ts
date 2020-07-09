import {
  createSlice,
  PayloadAction,
  ThunkAction,
  Action,
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { IGif } from '@giphy/js-types';
import { giphy } from '../../services/giphy';

const GIF_PAGE_SIZE = 50;

interface GifsState {
  searchQuery: string;
  focusedGifId: string | null;
  gifs: IGif[];
  loadingGifsPage: boolean;
  hasNextPage: boolean;
  networkError: string | null;
}

const initialState: GifsState = {
  searchQuery: '',
  focusedGifId: null,
  gifs: [],
  loadingGifsPage: false,
  hasNextPage: true,
  networkError: null,
};

export const gifsSlice = createSlice({
  name: 'gifs',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      // clear gifs cache when search query changes
      state.gifs = [];
    },
    focusGif: (state, action: PayloadAction<string>) => {
      state.focusedGifId = action.payload;
    },
    clearGifFocus: (state) => {
      state.focusedGifId = null;
    },
    requestGifs: (state) => {
      state.loadingGifsPage = true;
      // every new fetch might have a next page
      state.hasNextPage = true;
    },
    receiveGifs: (
      state,
      action: PayloadAction<{ gifs: IGif[]; totalCount: number }>,
    ) => {
      state.gifs = state.gifs.concat(action.payload.gifs);
      state.hasNextPage = state.gifs.length <= action.payload.totalCount;
      state.loadingGifsPage = false;
    },
    gifsRequestFailure: (state, action: PayloadAction<{ error: string }>) => {
      state.networkError = action.payload.error;
      state.loadingGifsPage = false;
      // don't retry loading the page if we encountered an error.
      state.hasNextPage = false;
    },
  },
});

export const { reducer } = gifsSlice;

export const { focusGif, clearGifFocus } = gifsSlice.actions;

export const selectSearchQuery = (state: RootState) => state.gifs.searchQuery;
export const selectFocusedGifId = (state: RootState) => state.gifs.focusedGifId;
export const selectGifs = (state: RootState) => state.gifs.gifs;
export const selectLoadingGifsPage = (state: RootState) =>
  state.gifs.loadingGifsPage;
export const selectNetworkError = (state: RootState) => state.gifs.networkError;
export const selectHasNextPage = (state: RootState) => state.gifs.hasNextPage;
export const selectFocusedGif = (state: RootState) =>
  state.gifs.gifs.find((gif) => gif.id === state.gifs.focusedGifId);

// Async actions

export function fetchNextPage(): ThunkAction<
  Promise<void>,
  RootState,
  undefined,
  Action
> {
  return async function (dispatch, getState) {
    dispatch(gifsSlice.actions.requestGifs());

    const searchQuery = selectSearchQuery(getState());
    const currentGifsOffset = selectGifs(getState()).length;
    try {
      let result;

      if (searchQuery) {
        result = await giphy.search(searchQuery, {
          offset: currentGifsOffset,
          limit: GIF_PAGE_SIZE,
        });
      } else {
        result = await giphy.trending({
          offset: currentGifsOffset,
          limit: GIF_PAGE_SIZE,
        });
      }
      dispatch(
        gifsSlice.actions.receiveGifs({
          gifs: result.data,
          totalCount: result.pagination.total_count,
        }),
      );
    } catch (err) {
      dispatch(gifsSlice.actions.gifsRequestFailure({ error: err.message }));
    }
  };
}

let debounceTimeoutHandle: NodeJS.Timeout | null = null;
export function setSearchQuery(
  query: string,
): ThunkAction<void, RootState, undefined, Action> {
  return function (dispatch, getState) {
    // first, update the store with the new search term
    dispatch(gifsSlice.actions.setSearchQuery(query));

    // then, call a debounced function to fetch new GIFs based on the term

    // if a previous fetch was queued up, cancel it
    if (debounceTimeoutHandle) {
      clearTimeout(debounceTimeoutHandle);
    }

    // queue a new fetch after 500ms of inactivity
    debounceTimeoutHandle = setTimeout(async () => {
      dispatch(fetchNextPage());
    }, 500);
  };
}
