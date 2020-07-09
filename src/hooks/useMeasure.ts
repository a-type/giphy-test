import { useRef, useState, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export function useMeasure<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);

  const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 });

  const [ro] = useState(
    () => new ResizeObserver(([entry]) => set(entry.contentRect)),
  );

  useEffect(() => {
    if (ref.current) {
      ro.observe(ref.current);
      return () => ro.disconnect();
    }
  }, []);

  return [{ ref }, bounds] as const;
}
