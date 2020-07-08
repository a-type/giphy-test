import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { reducer as gifsReducer } from '../features/gifs/gifsSlice';

export const store = configureStore({
  reducer: {
    gifs: gifsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
