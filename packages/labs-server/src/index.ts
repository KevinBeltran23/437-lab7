import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { MongoClient } from "mongodb";
import path from 'path';
import { registerLabsImageRoutes } from "./labs/routes/images";
import { registerLabsAuthRoutes } from "./labs/routes/auth";
import { registerAuthRoutes } from "./project/routes/auth";
import { registerUsersRoutes } from "./project/routes/users";
import { registerPostsRoutes } from "./project/routes/posts";
import { connectMongoose } from "./project/config/db";
import { verifyAuthToken } from "./project/services/authServices";
import { verifyLabsAuthToken } from "./labs/routes/auth";
import next from 'next';

// For Next.js handling - moved to dynamic import
// import next from 'next';

dotenv.config();
const PORT = process.env.PORT || 3000;
const staticDir = process.env.STATIC_DIR || "public";
const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER, DB_LABS_NAME } = process.env;
const labsConnectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_LABS_NAME}`;

// Define Next.js routes
const NEXT_ROUTES = ['/studybuddy'];

const app = express();
app.use(express.json());
app.use(express.static(staticDir));
const uploadDir = process.env.IMAGE_UPLOAD_DIR || "uploads";
app.use("/uploads", express.static(uploadDir));
app.use(cors());

async function setUpServer() {
    try {
        // Initialize Next.js app
        const dev = process.env.NODE_ENV !== 'production';
        const nextApp = next({ 
            dev, 
            dir: path.resolve(__dirname, '../../client') 
        });
        const nextHandler = nextApp.getRequestHandler();
        
        await nextApp.prepare();
        
        // Setup MongoDB connection
        const mongoClient = await MongoClient.connect(labsConnectionString);
        const collectionInfos = await mongoClient.db().listCollections().toArray();
        console.log("Collections in the database for labs:", collectionInfos.map(collectionInfo => collectionInfo.name));

        app.get("/hello", (req: Request, res: Response) => {
            res.send("Hello, World");
        });

        // Project stuff 
        await connectMongoose();

        // API routes
        registerLabsAuthRoutes(app, mongoClient);
        app.use("/labsApi/*", verifyLabsAuthToken);
        registerLabsImageRoutes(app, mongoClient);
        registerAuthRoutes(app);
        app.use("/api/*", verifyAuthToken);
        registerUsersRoutes(app);
        registerPostsRoutes(app);
       
        app.get("/images", (req: Request, res: Response) => {
            const options = { root: staticDir };
            res.sendFile("index.html", options, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Sent: index.html");
                }
            });
        });
       
        app.get("/image/:filename", (req: Request, res: Response) => {
            const options = { root: staticDir };
            res.sendFile("index.html", options, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Sent:", "index.html");
                }
            });
        });
        
        // Special handling for Next.js routes and assets
        app.all(['/studybuddy*', '/studybuddy/*'], (req, res) => {
            // With basePath configured, we can simply pass the request directly to Next.js
            // No need to modify URLs manually anymore
            console.log(`Next.js handling path: ${req.url}`);
            return nextHandler(req, res);
        });
        
        // Route handler for remaining Vite routes - move this AFTER the Next.js handler
        app.all("*", (req: Request, res: Response, next) => {
            const path = req.path;
            
            // Skip API routes and Next.js asset routes
            if (!path.startsWith('/api') && 
                !path.startsWith('/labsApi') && 
                !path.startsWith('/studybuddy')) {
                console.log(`Serving Vite app for path: ${path}`);
                const options = { root: staticDir };
                return res.sendFile("index.html", options, (err) => {
                    if (err) {
                        console.log(err);
                        next(err);
                    }
                });
            }
            
            next();
        });

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
            console.log(`Next.js routes available at: ${NEXT_ROUTES.join(', ')}`);
        });
    } catch (error) {
        console.error("Error setting up server:", error);
        process.exit(1);
    }
}

setUpServer();