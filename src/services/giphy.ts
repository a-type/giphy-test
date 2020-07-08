import { GiphyFetch, GifResult } from '@giphy/js-fetch-api';
import { useState, useEffect } from 'react';

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

export function useGiphyGif(id: string | null) {
  const [gifData, setGifData] = useState<GifResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setGifData(null);
      return;
    }

    setLoading(true);

    giphy
      .gif(id)
      .then(setGifData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return {
    gif: gifData?.data ?? null,
    error,
    loading,
  };
}
