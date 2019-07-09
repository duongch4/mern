import logger from "./logger";
import * as dotenv from "dotenv";
import * as fs from "fs";

// Setup multiple .*.env files
if (fs.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
} else {
    logger.debug("Using .env.example file to supply config environment variables");
    dotenv.config({ path: ".env.example" });
}

export const SESSION_SECRET = process.env["SESSION_SECRET"];
export const MONGODB_URI = process.env["MONGODB_URI"];

if (!SESSION_SECRET) {
    logger.error("No client secret => Require Setting SESSION_SECRET environment variable.");
    process.exit(1);
}

if (!MONGODB_URI) {
    logger.error("No mongo connection string => Require Setting MONGODB_URI environment variable.");
    process.exit(1);
}
