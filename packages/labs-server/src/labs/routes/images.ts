import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { ImageProvider } from "../imageProvider";
import { handleImageFileErrors, imageMiddlewareFactory } from "../imageUploadMiddlware";

export function registerLabsImageRoutes(app: express.Application, mongoClient: MongoClient) {
    // Define /api/images route
    app.get("/labsApi/images", async (req: Request, res: Response) => {
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
    app.patch("/labsApi/images/:id", async (req: Request, res: Response) => {
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

    app.post(
        "/labsApi/images",
        imageMiddlewareFactory.single("image"),
        handleImageFileErrors,
        async (req: Request, res: Response) => {
            try {
                // Check if we have all required data
                console.log("received upload request");
                if (!req.file) {
                    res.status(400).json({
                        error: "Bad Request",
                        message: "Missing required file"
                    });
                }
    
                // Check if name field exists
                if (!req.body.name) {
                    res.status(400).json({
                        error: "Bad Request",
                        message: "Missing required field: name"
                    });
                }

                const username = res.locals.token.username;
                if (!username) {
                    res.status(401).json({
                        error: "Unauthorized",
                        message: "Cannot identify user"
                    });
                }
    
                // Create image document
                const imageData = {
                    _id: req.file!.filename,
                    src: `/uploads/${req.file!.filename}`,
                    name: req.body.name,
                    author: username,
                    likes: 0
                };
    
                // Save to database using ImageProvider
                const imageProvider = new ImageProvider(mongoClient);
                const newImage = await imageProvider.createImage(imageData);
    
                // Return success response
                res.status(201).json(newImage);
                console.log(res.status);
            } catch (error) {
                console.error("Error handling image upload:", error);
                res.status(500).json({ error: "Failed to process image upload" });
            }
        }
    );
}