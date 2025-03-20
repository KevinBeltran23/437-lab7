import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { registerLabsImageRoutes } from "./labs/routes/images";
import { registerLabsAuthRoutes, verifyLabsAuthToken } from "./labs/routes/auth";

dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const PORT = process.env.PORT || 3000;
const staticDir = process.env.STATIC_DIR || "public";
const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER, DB_LABS_NAME, DB_NAME } = process.env;
const labsConnectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_LABS_NAME}`;
const projectConnectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_NAME}`;

const app = express();
// Add middleware to parse JSON request bodies
app.use(express.json());
app.use(express.static(staticDir));
// Serve uploaded images
const uploadDir = process.env.IMAGE_UPLOAD_DIR || "uploads";
app.use("/uploads", express.static(uploadDir));

async function setUpServer() {
    try {
        const mongoClient = await MongoClient.connect(labsConnectionString);
        const collectionInfos = await mongoClient.db().listCollections().toArray();
        console.log("Collections in the database for labs:", collectionInfos.map(collectionInfo => collectionInfo.name));

        app.get("/hello", (req: Request, res: Response) => {
            res.send("Hello, World");
        });

        registerLabsAuthRoutes(app, mongoClient);
        app.use("/labsApi/*", verifyLabsAuthToken);
        registerLabsImageRoutes(app, mongoClient);
       
        app.get("/images", (req: Request, res: Response) => {
            const options = {
                root: staticDir,
            };
            res.sendFile("index.html", options, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Sent: index.html");
                }
            });
        });
       
        app.get("/image/:filename", (req: Request, res: Response) => {
            const options = {
                root: staticDir,
            };
            res.sendFile("index.html", options, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Sent:", "index.html");
                }
            });
        });
       
        app.get("*", (req: Request, res: Response) => {
            console.log("none of the routes above me were matched");
        });

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

setUpServer();