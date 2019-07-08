import * as shell from "shelljs";
import * as glob from "glob";

shell.rm("-R", "./frontend/");
shell.rm("-R", "./src/");
shell.rm("./README.md");
shell.rm("./.gitignore");
shell.rm("copyFrontend.ts");
glob("./*.json", (err: Error, files: string[]) => {
    if (err) {
        console.log("No files matching './*.json' pattern");
    }
    else {
        for (const file of files) {
            shell.rm(file);
        }
    }
});
