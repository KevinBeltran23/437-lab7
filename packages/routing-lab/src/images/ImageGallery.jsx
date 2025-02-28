import "./ImageGallery.css";
import { Link } from "react-router";

export function ImageGallery({ isLoading, fetchedImages }) {
    const imageElements = fetchedImages.map((image) => (
        <div key={image.id} className="ImageGallery-photo-container">
            <Link to={`/image/${image.id}`}>
                <img src={image.src} alt={image.name} />
            </Link>
        </div>
    ));

    return (
        <div>
            <h2>Image Gallery</h2>
            {isLoading && "Loading..."}
            <div className="ImageGallery">
                {imageElements}
            </div>
        </div>
    );
}
