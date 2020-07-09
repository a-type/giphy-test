import { useState, useEffect } from 'react';

function getInitialWidth() {
  if (typeof window === 'undefined') return 0;
  return document.documentElement.clientWidth;
}

export function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(getInitialWidth());

  useEffect(() => {
    function update() {
      setWindowWidth(document.documentElement.clientWidth);
    }
    document.addEventListener('resize', update);

    return () => {
      document.removeEventListener('resize', update);
    };
  }, []);

  return windowWidth;
}
