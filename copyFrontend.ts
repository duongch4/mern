import * as shell from "shelljs";
import * as fs from "fs";

if (fs.existsSync("./dist/frontend/")) {
    shell.rm("-rf", "./dist/frontend/");
}
shell.cp("-r", "./frontend/dist/", "./dist/frontend/");
