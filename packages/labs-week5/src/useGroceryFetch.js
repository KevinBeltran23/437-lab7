import { useState, useEffect } from "react";
import { groceryFetcher } from "./groceryFetcher";

export function useGroceryFetch(source) {
  const [groceryData, setGroceryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isStale = false;

    async function fetchData(url) {
      try {
        setIsLoading(true);
        setGroceryData([]);
        console.log("Fetching data from " + url);

        if (!url) {
          setError(null);
          return;
        }

        const data = await groceryFetcher.fetch(url);
        if (!isStale) {
          setGroceryData(data);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        if (!isStale) {
          setError(true);
        }
      } finally {
        if (!isStale) {
          setIsLoading(false);
        }
      }
    }

    fetchData(source);

    return () => {
      isStale = true;
    };
  }, [source]);

  return { groceryData, isLoading, error }; // Return the state variables
} 