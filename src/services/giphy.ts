import { GiphyFetch, GifResult } from '@giphy/js-fetch-api';
import { useState, useEffect } from 'react';

export const giphy = new GiphyFetch(process.env.REACT_APP_GIPHY_KEY);
