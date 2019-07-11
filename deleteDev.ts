import * as shell from "shelljs";
import * as glob from "glob";

shell.rm("-rf", "./frontend/");
shell.rm("-rf", "./src/");
shell.rm("./README.md");
shell.rm("./.gitignore");
shell.rm("./nodemon.json");
const patterns = ["./ts*.json", "./*config*.js"];
for (const pattern of patterns) {
    glob(pattern, (err: Error, files: string[]) => {
        if (err) {
            console.log("No files matching pattern");
        }
        else {
            for (const file of files) {
                shell.rm(file);
            }
        }
    });
}
