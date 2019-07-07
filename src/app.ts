import * as express from "express";
import * as session from "express-session";
import * as cookieParser from "cookie-parser";
import * as flash from "express-flash";

import * as compression from "compression";  // compresses requests
import * as bodyParser from "body-parser";
import * as lusca from "lusca";

import * as mongo from "connect-mongo";
import * as mongoose from "mongoose";
import * as bluebird from "bluebird";

import * as path from "path";

import * as passport from "passport";

import { MONGODB_URI, SESSION_SECRET } from "./utils/secrets";

import * as routes from "./routes";

// Controllers (route handlers)
// import * as homeController from "./controllers/home";
// import * as userController from "./controllers/user";
// import * as apiController from "./controllers/api";
// import * as contactController from "./controllers/contact";

// API keys and Passport configuration
// import * as passportConfig from "./auth/passport";

// Create Express server
const app = express();

// Connect to MongoDB
const MongoStore = mongo(session);
const mongoUrl = MONGODB_URI;
(mongoose as any).Promise = bluebird;

mongoose.connect(mongoUrl, { useNewUrlParser: true }).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(
    (err) => { console.log("MongoDB connection error. Please make sure MongoDB is running. " + err); }
);

// Express configuration
app.set("port", process.env.PORT || 3000);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(SESSION_SECRET));
app.use(session({
    cookie: { maxAge: 60000 },
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        url: mongoUrl,
        autoReconnect: true
    })
}));

// Passport
// app.use(passport.initialize());
// app.use(passport.session());

// Flash
app.use(flash());
// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use((req, res, next) => {
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});

// Lusca
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

// Set Headers to allow Cross Origin Requests
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers",
        "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, " +
        "Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});

// Set Request User to be Current User
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// // Set Static Assets
// app.use(
//     express.static(path.join(__dirname, "frontend"), { maxAge: 31557600000 })
// );

// Connect all our routes to our application
// app.use("/", routes);

// If request doesn't match api => return the main index.html => react-router render the route in the client
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

/**
 * Primary app routes.
 */
// app.get("/", homeController.index);
// app.get("/login", userController.getLogin);
// app.post("/login", userController.postLogin);
// app.get("/logout", userController.logout);
// app.get("/forgot", userController.getForgot);
// app.post("/forgot", userController.postForgot);
// app.get("/reset/:token", userController.getReset);
// app.post("/reset/:token", userController.postReset);
// app.get("/signup", userController.getSignup);
// app.post("/signup", userController.postSignup);
// app.get("/contact", contactController.getContact);
// app.post("/contact", contactController.postContact);
// app.get("/account", passportConfig.isAuthenticated, userController.getAccount);
// app.post("/account/profile", passportConfig.isAuthenticated, userController.postUpdateProfile);
// app.post("/account/password", passportConfig.isAuthenticated, userController.postUpdatePassword);
// app.post("/account/delete", passportConfig.isAuthenticated, userController.postDeleteAccount);
// app.get("/account/unlink/:provider", passportConfig.isAuthenticated, userController.getOauthUnlink);

/**
 * API examples routes.
 */
// app.get("/api", apiController.getApi);
// app.get("/api/facebook", passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);

// /**
//  * OAuth authentication routes. (Sign in)
//  */
// app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));
// app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
//   res.redirect(req.session.returnTo || "/");
// });

export default app;
