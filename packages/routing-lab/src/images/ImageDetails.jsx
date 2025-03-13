import { useParams } from "react-router";
import { useImageFetching } from "./useImageFetching.js";

export function ImageDetails() {
    const { id } = useParams(); // This is still "id" from the URL
    const { isLoading, fetchedImages } = useImageFetching(id);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Find image by `_id` instead of `id`
    const imageData = fetchedImages.find((image) => image._id === id);

    if (!imageData) {
        return <div><h2>Image not found</h2></div>;
    }

    return (
        <div>
            <h2>{imageData.name}</h2>
            <img className="ImageDetails-img" src={imageData.src} alt={imageData.name} />
        </div>
    );
}
