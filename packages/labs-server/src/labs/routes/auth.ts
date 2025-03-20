import express, { NextFunction, Request, Response } from "express";
import { MongoClient } from "mongodb";
import { CredentialsProvider } from "../CredentialsProvider";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const signatureKey = process.env.LABS_JWT_SECRET;
if (!signatureKey) {
    throw new Error("Missing JWT_SECRET from env file");
}

export function verifyLabsAuthToken(
    req: Request,
    res: Response,
    next: NextFunction // Call next() to run the next middleware or request handler
) {
    const authHeader = req.get("Authorization");
    // The header should say "Bearer <token string>".  Discard the Bearer part.
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).end();
    } else { // signatureKey already declared as a module-level variable
        jwt.verify(token, signatureKey as string, (error, decoded) => {
            if (decoded) {
                res.locals.token = decoded;
                next();
            } else {
                res.status(403).end();
            }
        });
    }
}

function generateAuthToken(username: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(
            { username: username },
            signatureKey as string,
            { expiresIn: "1d" },
            (error, token) => {
                if (error) reject(error);
                else resolve(token as string);
            }
        );
    });
}

export function registerLabsAuthRoutes(app: express.Application, mongoClient: MongoClient) {
    const credentialsProvider = new CredentialsProvider(mongoClient);

    app.post("/labsApi/auth/register", async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                res.status(400).json({
                    success: false,
                    message: "Missing username or password"
                });
                return;
            }

            try {
                const registrationSuccess = await credentialsProvider.registerUser(username, password);
                if (!registrationSuccess) {
                    res.status(409).json({
                        success: false,
                        message: "Username already taken"
                    });
                    return;
                }

                res.status(201).json({
                    success: true,
                    message: "User registered successfully"
                });
            } catch (authError) {
                console.log("Registration service error:", authError);
                res.status(400).json({
                    success: false,
                    message: authError instanceof Error ? authError.message : "Registration failed"
                });
            }
        } catch (error) {
            console.error("Unexpected registration error:", error);
            res.status(500).json({
                success: false,
                message: "An error occurred during registration"
            });
        }
    });

    app.post("/labsApi/auth/login", async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;

            // Check for missing username or password
            if (!username || !password) {
                res.status(400).json({
                    success: false,
                    message: "Missing username or password"
                });
                return;
            }

            try {
                // Verify the user's password
                const isPasswordValid = await credentialsProvider.verifyPassword(username, password);
                if (!isPasswordValid) {
                    res.status(401).json({
                        success: false,
                        message: "Incorrect username or password"
                    });
                    return;
                }

                // Generate a JWT token
                const token = await generateAuthToken(username);
                res.json({
                    success: true,
                    message: "Login successful",
                    token: token
                });
            } catch (authError) {
                console.log("Login service error:", authError);
                res.status(401).json({
                    success: false,
                    message: "Incorrect username or password"
                });
            }
        } catch (error) {
            console.error("Unexpected login error:", error);
            res.status(500).json({
                success: false,
                message: "An error occurred during login"
            });
        }
    });
}