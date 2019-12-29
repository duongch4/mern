import path from "path";
import fs from "fs";

export function setLogger() {
    if (process.env.NODE_ENV === "development") {
        process.env.OVERNIGHT_LOGGER_MODE = "FILE";

        const logFileDir = path.join(__dirname, "log");
        const logFilePath = path.join(logFileDir, "backend.log");
        if (!fs.existsSync(logFileDir)) {
            fs.mkdirSync(logFileDir);
        }
        process.env.OVERNIGHT_LOGGER_FILEPATH = logFilePath;
        // Remove current log file if it exists
        (function removeFile() {
            try {
                fs.unlinkSync(logFilePath);
            } catch (err) { return; }
        })();
    }
    else if (process.env.NODE_ENV === "production") {
        process.env.OVERNIGHT_LOGGER_MODE = "OFF";
    }
    else {
        process.env.OVERNIGHT_LOGGER_MODE = "CONSOLE";
    }
}
