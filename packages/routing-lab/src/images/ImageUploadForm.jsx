import { useActionState } from "react";

// Define your action function outside the component
async function uploadImageAction(previousState, formData) {
  try {
    // Get the auth token from wherever you're storing it
    const authToken = localStorage.getItem("authToken");
    
    // Create a new request with the auth token
    const response = await fetch("/labsApi/images", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${authToken}`,
        // Don't set Content-Type when using FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        status: "error", 
        message: errorData.message || "Failed to upload image" 
      };
    }

    const data = await response.json();
    return { 
      status: "success", 
      message: "Image uploaded successfully!", 
      image: data 
    };
  } catch (error) {
    return { 
      status: "error", 
      message: error.message || "An unexpected error occurred" 
    };
  }
}

export function ImageUploadForm() {
  // Use the hook correctly with an appropriate initial state
  const [state, formAction, isPending] = useActionState(uploadImageAction, { 
    status: "idle", 
    message: "", 
    image: null 
  });

  return (
    <div className="upload-container">
      {/* Keep your original form structure, just update the action */}
      <form action={formAction}>
        {/* Your existing form fields */}
        <div className="form-group">
          <label htmlFor="image">Select Image</label>
          <input 
            type="file" 
            id="image" 
            name="image" 
            accept="image/*" 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="name">Image Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            placeholder="Enter image name" 
            required 
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="upload-button" 
            disabled={isPending}
          >
            {isPending ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </form>
      
      {/* Status messages */}
      {state.status === "error" && (
        <div className="error-message">{state.message}</div>
      )}
      
      {state.status === "success" && (
        <div className="success-message">
          {state.message}
          {state.image && (
            <div className="image-preview">
              <img 
                src={state.image.src} 
                alt={state.image.name} 
                className="preview" 
              />
              <p>Uploaded as: {state.image.name}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
