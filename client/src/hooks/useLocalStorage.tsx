import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }
      
      const parsed = JSON.parse(item);
      
      // Handle Set objects specially - convert array back to Set
      if (initialValue instanceof Set && Array.isArray(parsed)) {
        return new Set(parsed) as unknown as T;
      }
      
      // For arrays, ensure we always return a valid array
      if (Array.isArray(initialValue) && !Array.isArray(parsed)) {
        return initialValue;
      }
      
      // Handle null/undefined cases
      if (parsed === null || parsed === undefined) {
        return initialValue;
      }
      
      return parsed;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      let serializedValue;
      
      // Handle Set objects specially - convert to array for JSON
      if (valueToStore instanceof Set) {
        serializedValue = JSON.stringify(Array.from(valueToStore));
      } else {
        serializedValue = JSON.stringify(valueToStore);
      }
      
      window.localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
