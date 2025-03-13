import { useEffect, useState } from "react";

/**
 * Fetches images from the backend API.
 * Returns an object with two properties: isLoading and fetchedImages, which will be
 * an array of ImageData.
 *
 * @param imageId {string} the image ID to fetch, or all of them if empty string
 * @returns {{isLoading: boolean, fetchedImages: ImageData[]}} fetch state and data
 */
export function useImageFetching(imageId) {
    const [isLoading, setIsLoading] = useState(true);
    const [fetchedImages, setFetchedImages] = useState([]);

    useEffect(() => {
        setIsLoading(true);

        fetch('/api/images')
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
                setIsLoading(false);
            });
    }, [imageId]);

    return { isLoading, fetchedImages };
}
