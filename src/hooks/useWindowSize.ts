import { useState, useEffect } from 'react';
import { debounce } from '@material-ui/core';

function getInitialWidth() {
  if (typeof window === 'undefined') return { width: 0, height: 0 };
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState(getInitialWidth());

  useEffect(() => {
    function update() {
      setWindowSize({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      });
    }
    const debounced = debounce(update, 100);
    window.addEventListener('resize', debounced);

    return () => {
      window.removeEventListener('resize', debounced);
    };
  }, []);

  return windowSize;
}
