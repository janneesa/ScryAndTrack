import { useState, useCallback } from "react";

export default function useFetchAny() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFunction = useCallback(async (url, options = {}) => {
    setIsLoading(true);
    setError(null); // Reset error state before making a new request

    try {
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json", ...options.headers },
        ...options,
      });

      if (!response.ok) {
        const errorMessage = `Error: ${response.statusText}`;
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      if (response.status === 204) {
        setIsLoading(false);
        return null;
      }

      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
      throw err;
    }
  }, []);

  return { fetchFunction, isLoading, error };
}
