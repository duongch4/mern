import App from "./app";

const app = new App();
app.config();
const server = app.listen();
export default server;
