import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { registerImageRoutes } from "./routes/images";

dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const PORT = process.env.PORT || 3000;
const staticDir = process.env.STATIC_DIR || "public";
const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER, DB_NAME } = process.env;
const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_NAME}`;

const app = express();
// Add middleware to parse JSON request bodies
app.use(express.json());
app.use(express.static(staticDir));

async function setUpServer() {
    try {
        const mongoClient = await MongoClient.connect(connectionString);
        const collectionInfos = await mongoClient.db().listCollections().toArray();
        console.log("Collections in the database:", collectionInfos.map(collectionInfo => collectionInfo.name));

        app.get("/hello", (req: Request, res: Response) => {
            res.send("Hello, World");
        });

        registerImageRoutes(app, mongoClient);
       
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