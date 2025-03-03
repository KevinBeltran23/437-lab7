import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const PORT = process.env.PORT || 3000;
const staticDir = process.env.STATIC_DIR || "public";

const app = express();
app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

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
