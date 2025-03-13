import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { ImageProvider } from "../imageProvider";

export function registerImageRoutes(app: express.Application, mongoClient: MongoClient) {
    // Define /api/images route
    app.get("/api/images", async (req: Request, res: Response) => {
        try {
            const imageProvider = new ImageProvider(mongoClient);
           
            // Parse the createdBy query parameter
            let authorId: string | undefined = undefined;
            if (typeof req.query.createdBy === "string") {
                authorId = req.query.createdBy;
                console.log("Filtering images by author ID:", authorId);
            }
           
            // Get images with optional author filter
            const images = await imageProvider.getAllImages(authorId);
               
            res.json(images);
        } catch (error) {
            console.error("Error fetching images:", error);
            res.status(500).json({ error: "Failed to fetch images" });
        }
    });

    // Define PATCH /api/images/:id route for updating image name
    app.patch("/api/images/:id", async (req: Request, res: Response) => {
        try {
            // Extract the image ID from the URL parameters
            const imageId = req.params.id;
            
            // Extract the new name from the request body
            const { name } = req.body;
            
            // Validate that name exists in the request body
            if (!name) {
                res.status(400).json({
                    error: "Bad request",
                    message: "Missing name property"
                });
            }
            
            console.log(`Updating image ${imageId} with new name: ${name}`);
            
            // Update the image name in the database
            const imageProvider = new ImageProvider(mongoClient);
            const matchedCount = await imageProvider.updateImageName(imageId, name);
            
            // Check if any document was updated
            if (matchedCount === 0) {
                res.status(404).json({
                    error: "Not found",
                    message: "Image does not exist"
                });
            }
            
            // Success - return 204 No Content
            res.status(204).send();
        } catch (error) {
            console.error("Error updating image:", error);
            res.status(500).json({ error: "Failed to update image" });
        }
    });
}