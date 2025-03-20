import { Request, Response, NextFunction } from "express";
import multer from "multer";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create uploads directory if it doesn't exist
const uploadDir = process.env.IMAGE_UPLOAD_DIR || "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

class ImageFormatError extends Error {}

const storageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        // Use the environment variable for upload directory
        const uploadDir = process.env.IMAGE_UPLOAD_DIR || "uploads";
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Check if the file is a supported image type
        if (file.mimetype === "image/png") {
            const fileExtension = "png";
            const fileName = Date.now() + "-" + Math.round(Math.random() * 1E9) + "." + fileExtension;
            cb(null, fileName);
        } else if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
            const fileExtension = "jpg";
            const fileName = Date.now() + "-" + Math.round(Math.random() * 1E9) + "." + fileExtension;
            cb(null, fileName);
        } else {
            // Unsupported file type
            cb(new ImageFormatError("Unsupported image type"), "");
        }
    }
});

export const imageMiddlewareFactory = multer({
    storage: storageEngine,
    limits: {
        files: 1,
        fileSize: 5 * 1024 * 1024 // 5 MB
    },
});

export function handleImageFileErrors(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof multer.MulterError || err instanceof ImageFormatError) {
        res.status(400).send({
            error: "Bad Request",
            message: err.message
        });
        return;
    }
    next(err); // Some other error, let the next middleware handle it
}