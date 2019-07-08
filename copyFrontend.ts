import * as shell from "shelljs";
import * as fs from "fs";

if (fs.existsSync("./dist/frontend/")) {
    shell.rm("-R", "./dist/frontend/");
}
shell.cp("-R", "./frontend/dist/", "./dist/frontend/");
