jest.mock('../../services/giphy');

import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import {
  fetchNextPage,
  requestGifs,
  receiveGifs,
  setSearchQuery,
  updateSearchQuery,
} from './gifsSlice';
import { giphy as mockGiphy } from '../../services/giphy';
import { IGif } from '@giphy/js-types';

const mockStore = configureMockStore([thunk]);

jest.useFakeTimers();

describe('gifs redux slice', () => {
  describe('async actions', () => {
    describe('fetch next page', () => {
      it('fetches gifs and applies the results for trending', () => {
        const gifs = [
          {
            id: 'fake-gif',
          },
          {
            id: 'fake-gif-2',
          },
        ] as IGif[];
        (mockGiphy.trending as jest.Mock).mockResolvedValue({
          data: gifs,
          pagination: {
            total_count: 2,
          },
        });

        const expectedActions = [
          requestGifs({
            newSearch: false,
          }),
          receiveGifs({
            gifs,
            totalCount: 2,
          }),
        ];

        const store = mockStore({
          gifs: {
            gifs: [],
            hasNextPage: false,
          },
        });

        return store
          .dispatch(fetchNextPage({ newSearch: false }) as any)
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('fetches gifs and applies the results for trending', () => {
        const gifs = [
          {
            id: 'fake-gif',
          },
          {
            id: 'fake-gif-2',
          },
        ] as IGif[];
        (mockGiphy.search as jest.Mock).mockResolvedValue({
          data: gifs,
          pagination: {
            total_count: 2,
          },
        });

        const expectedActions = [
          requestGifs({
            newSearch: true,
          }),
          receiveGifs({
            gifs,
            totalCount: 2,
          }),
        ];

        const store = mockStore({
          gifs: {
            gifs: [],
            hasNextPage: false,
            searchQuery: 'foo',
          },
        });

        return store
          .dispatch(fetchNextPage({ newSearch: true }) as any)
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    });

    describe('set search query', () => {
      it('debounces the fetch', async () => {
        const gifs = [
          {
            id: 'fake-gif',
          },
          {
            id: 'fake-gif-2',
          },
        ] as IGif[];
        (mockGiphy.search as jest.Mock).mockResolvedValue({
          data: gifs,
          pagination: {
            total_count: 2,
          },
        });

        const expectedActions = [
          updateSearchQuery('te'),
          updateSearchQuery('tes'),
          updateSearchQuery('test'),
          requestGifs({ newSearch: true }),
        ];

        const store = mockStore({
          gifs: {
            gifs: [],
            hasNextPage: false,
          },
        });

        await store.dispatch(setSearchQuery('te') as any);
        await store.dispatch(setSearchQuery('tes') as any);
        await store.dispatch(setSearchQuery('test') as any);

        jest.runAllTimers();

        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
