import "./ImageGallery.css";
import { Link } from "react-router";
import { ImageUploadForm } from "./ImageUploadForm";

export function ImageGallery({ isLoading, fetchedImages }) {
    const imageElements = fetchedImages.map((image) => (
        <div key={image._id} className="ImageGallery-photo-container">
            <Link to={`/image/${image._id}`}>
                <img src={image.src} alt={image.name} />
            </Link>
        </div>
    ));

    return (
        <div>
            <h2>Image Gallery</h2>
            {isLoading && "Loading..."}
            <section>
                <h3>Upload an Image</h3>
                <ImageUploadForm />
            </section>
            <div className="ImageGallery">
                {imageElements}
            </div>
        </div>
    );
}
