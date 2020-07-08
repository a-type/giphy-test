import { GiphyFetch } from '@giphy/js-fetch-api';

export const giphy = new GiphyFetch(process.env.REACT_APP_GIPHY_KEY);

/**
 * Returns a Giphy fetch function from the SDK. If no search query is provided,
 * trending Gifs will be returned by default.
 */
export function useGiphyFetch(searchQuery: string, pageSize: number) {
  if (searchQuery.length === 0) {
    return (offset: number) => giphy.trending({ offset, limit: pageSize });
  } else {
    return (offset: number) =>
      giphy.search(searchQuery, { offset, limit: pageSize });
  }
}
