import { useState, useEffect } from 'react';
import { debounce } from '@material-ui/core';

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    function update() {
      setScrollPosition(window.scrollY);
    }
    const debounced = debounce(update, 300);
    document.addEventListener('scroll', debounced);

    return () => {
      document.removeEventListener('scroll', debounced);
    };
  }, []);

  return scrollPosition;
}
