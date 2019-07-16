import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";

if (process.env.NODE_ENV !== "production") {
    // Setup multiple .*.env files in dev/debug mode
    if (fs.existsSync(".env")) {
        setEnv(".env");
    }
    else if (fs.existsSync(".env.whatever")) {
        setEnv(".env.whatever");
    }
}

function setEnv(envFile: string) {
    logger.debug(`Using ${envFile} file to supply config environment variables`);
    dotenv.config({ path: envFile });
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
