import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { reducer as gifsReducer } from '../features/gifs/gifsSlice';
import thunk from 'redux-thunk';

export const store = configureStore({
  reducer: {
    gifs: gifsReducer,
  },
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
