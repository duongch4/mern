import http from "http";
import { ExpressServer } from "./ExpressServer";

const port = process.env.PORT || "3000";
let expressServer: ExpressServer = new ExpressServer();
let server: http.Server = expressServer.listen(port);

if (module.hot) {
    module.hot.accept("./ExpressServer", () => {
        server.close();
        server = new ExpressServer().listen(port);
    });
}