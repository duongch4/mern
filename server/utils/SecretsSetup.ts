import { setEnvDev } from "./EnvDevSetup";
import { setLogger } from "./LoggerSetup";

setEnvDev();
setLogger();

export const SESSION_SECRET = process.env["SESSION_SECRET"];
export const MONGODB_URI = process.env["MONGODB_URI"];

if (!SESSION_SECRET) {
    console.log("No client secret => Require Setting SESSION_SECRET environment variable.");
    process.exit(1);
}

if (!MONGODB_URI) {
    console.log("No mongo connection string => Require Setting MONGODB_URI environment variable.");
    process.exit(1);
}
