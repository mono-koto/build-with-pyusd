import { useEffect, useRef } from "react";

export function useChangeObserver<T>(
  value: T,
  targetValue: T,
  callback: () => void
) {
  const previous = usePrevious(value);
  useEffect(() => {
    if (previous !== value && value === targetValue) {
      (async () => callback())();
    }
  }, [value, previous, callback]);
}

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
