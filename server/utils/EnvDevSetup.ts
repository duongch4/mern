import fs from "fs";
import dotenv from "dotenv";

function _setEnvDev(envFile: string) {
    console.log(`Using file "${envFile}" to supply config environment variables`);
    dotenv.config({ path: envFile });
}

export function setEnvDev() {
    if (process.env.NODE_ENV !== "production") {
        // Setup multiple .*.env files in dev/debug mode
        if (fs.existsSync(".env")) {
            _setEnvDev(".env");
        }
        else if (fs.existsSync(".env.whatever")) {
            _setEnvDev(".env.whatever");
        }
    }
}
