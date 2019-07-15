import { ExpressServer } from "./ExpressServer";

const port = process.env.PORT || "3000";
export default new ExpressServer().listen(port);
