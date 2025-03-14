import { useEffect, useState } from "react";

/**
 * Fetches images from the backend API.
 * Returns an object with two properties: isLoading and fetchedImages, which will be
 * an array of ImageData.
 *
 * @param imageId {string} the image ID to fetch, or all of them if empty string
 * @param authToken {string} the authentication token for API requests
 * @returns {{isLoading: boolean, fetchedImages: ImageData[], error: string|null}} fetch state and data
 */
export function useImageFetching(imageId, authToken) {
    const [isLoading, setIsLoading] = useState(true);
    const [fetchedImages, setFetchedImages] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Don't attempt to fetch if we don't have an auth token
        if (!authToken) {
            console.warn("No auth token provided. Skipping image fetch.");
            setFetchedImages([]);
            setIsLoading(false);
            setError("Authentication required");
            return;
        }

        setIsLoading(true);
        setError(null);
        
        fetch('/api/images', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Keep `_id` as-is
                setFetchedImages(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching images:", error);
                setError(error.message);
                setIsLoading(false);
            });
    }, [imageId, authToken]); // Add authToken to dependency array

    return { isLoading, fetchedImages, error };
}