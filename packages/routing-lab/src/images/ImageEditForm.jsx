import { useState } from "react";

export function ImageEditForm() {
    const [imageId, setImageId] = useState("");
    const [imageName, setImageName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit() {
        if (!imageId || !imageName) {
            alert("Please provide both an Image ID and a new name.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`/api/images/${imageId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: imageName }),
            });

            if (response.ok) {
                alert("Image name updated successfully!");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Failed to update image:", error);
            alert("An error occurred while updating the image.");
        } finally {
            setImageId("");
            setImageName("");
            setIsLoading(false);
        }
    }

    return (
        <div>
            <label>
                Image ID
                <input
                    type="text"
                    value={imageId}
                    onChange={(e) => setImageId(e.target.value)}
                />
            </label>
            <label>
                New Image Name
                <input
                    type="text"
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
                />
            </label>
            <button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Updating..." : "Send Request"}
            </button>
        </div>
    );
}
