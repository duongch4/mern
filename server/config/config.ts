import { Logger } from "@overnightjs/logger";
import { LoggerModeOptions } from "@overnightjs/logger/lib/constants";
import fs from "fs";
import path from "path";

export const setLogger = () => {
    if (!process.env["OVERNIGHT_LOGGER_MODE"]) {
        if (process.env.NODE_ENV === "production") {
            Logger.mode = "OFF" as LoggerModeOptions;
        }
        else {
            Logger.mode = "CONSOLE" as LoggerModeOptions;
        }
    }
    else {
        Logger.mode = process.env["OVERNIGHT_LOGGER_MODE"] as LoggerModeOptions;
        if (Logger.mode === "FILE") {
            const logFileDir = path.join(__dirname, "log"); // inside dist/ directory
            const today = new Date().toDateString().split(" ").join("_");
            const logFilePath = path.join(logFileDir, `backend_${today}.log`);
            if (!fs.existsSync(logFileDir)) {
                fs.mkdirSync(logFileDir);
            }
            Logger.filePath = logFilePath;
            Logger.rmTimestamp = false;
        }
    }
};

export const getSessionSecret = () => {
    const SESSION_SECRET = process.env["SESSION_SECRET"];
    if (typeof SESSION_SECRET === "undefined") {
        Logger.Info("No client secret => Require Setting SESSION_SECRET environment variable.");
        process.exit(1);
    }
    return SESSION_SECRET;
};

export const getMongoDbUri = () => {
    const MONGODB_URI = process.env["MONGODB_URI"];
    if (!MONGODB_URI) {
        Logger.Info("No mongo connection string => Require Setting MONGODB_URI environment variable.");
        process.exit(1);
    }
    return MONGODB_URI;
};
