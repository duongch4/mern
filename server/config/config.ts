import { Logger as Log } from "@overnightjs/logger";
import { setLogger } from "./LoggerSetup";

setLogger();

export const getSessionSecret = () => {
    const SESSION_SECRET = process.env["SESSION_SECRET"];
    if (typeof SESSION_SECRET === "undefined") {
        Log.Info("No client secret => Require Setting SESSION_SECRET environment variable.");
        process.exit(1);
    }
    return SESSION_SECRET;
};

export const getMongoDbUri = () => {
    const MONGODB_URI = process.env["MONGODB_URI"];
    if (!MONGODB_URI) {
        Log.Info("No mongo connection string => Require Setting MONGODB_URI environment variable.");
        process.exit(1);
    }
    return MONGODB_URI;
};
