import { ExpressServer } from "./ExpressServer";

const port = process.env.PORT || "3000";
new ExpressServer().listen(port);

if (module.hot) {
    module.hot.accept("./ExpressServer");
}
