import http from "http";
import { ExpressServer } from "./ExpressServer";

const port = process.env.PORT || "3000";
let server: http.Server = new ExpressServer().listen(port);

if (module.hot) {
    module.hot.accept("./ExpressServer", () => {
        server.close();
        server = new ExpressServer().listen(port);
    });
}