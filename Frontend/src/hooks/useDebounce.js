import { useRef } from "react";
function useDebounce(fn, delay = 1000) {
  const timeRef = useRef(null);
  return (...args) => {
    clearTimeout(timeRef.current);
    timeRef.current = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
export { useDebounce };
