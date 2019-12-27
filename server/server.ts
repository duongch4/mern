import http from "http";
import { ExpressServer } from "./ExpressServer";

const port = process.env.PORT || "3000";
const server: http.Server = new ExpressServer().listen(port);
export default server;
