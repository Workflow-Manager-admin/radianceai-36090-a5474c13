// PUBLIC_INTERFACE
/**
 * Custom React Hook for working with localStorage.
 * @param {string} key
 * @param {any} initialValue
 */
import { useState } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = value => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch { }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
