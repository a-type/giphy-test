import { useRef, useEffect } from 'react';

/**
 * Hook that returns the previous value stored in it. This is useful for comparing
 * props from one render to the next (for example, when using `useEffect` to handle
 * lifecycle changes).
 */
const usePrevious = <T>(value: T) => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export default usePrevious;
