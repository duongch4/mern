import logger from "./logger";
import * as dotenv from "dotenv";
import * as fs from "fs";

if (fs.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
} else {
    logger.debug("Using .env.example file to supply config environment variables");
    dotenv.config({ path: ".env.example" });  // you can delete this after you create your own .env file!
}

const isProd = process.env.NODE_ENV === "production"; // Anything else is treated as 'dev'

export const SESSION_SECRET = process.env["SESSION_SECRET"];
export const MONGODB_URI = isProd ? process.env["MONGODB_URI"] : process.env["MONGODB_URI_LOCAL"];

if (!SESSION_SECRET) {
    logger.error("No client secret => Require Setting SESSION_SECRET environment variable.");
    process.exit(1);
}

if (!MONGODB_URI) {
    if (isProd) {
        logger.error("No mongo connection string => Require Setting MONGODB_URI environment variable.");
    } else {
        logger.error("No mongo connection string => Require Setting MONGODB_URI_LOCAL environment variable.");
    }
    process.exit(1);
}