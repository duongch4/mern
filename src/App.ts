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

import * as errorHandler from "errorhandler";

import { Server } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import * as controllers from "./controllers";

// Controllers (route handlers)
// import * as homeController from "./controllers/home";
// import * as userController from "./controllers/user";
// import * as apiController from "./controllers/api";
// import * as contactController from "./controllers/contact";

// API keys and Passport configuration
// import * as passportConfig from "./auth/passport";

// Create Express server
export default class App extends Server {
    // private app: express.Application;

    constructor() {
        // this.app = express();
        super(true);
    }

    public config(): void {
        const MongoStore = mongo(session);
        (mongoose as any).Promise = bluebird;
        mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).then(
            () => {
                if (this.app.get("env") !== "production") {
                    console.log(`========== MongoDB is connected at: ${MONGODB_URI} ==========`);
                }
                else {
                    console.log(`========== MongoDB is connected successfully ==========`);
                }
            },
        ).catch(
            (err) => { console.log(`!!! MongoDB connection error. Please make sure MongoDB is running:: ${err}`); }
        );

        this.app.set("port", process.env.PORT || 3000);
        this.app.use(compression());
        this.setBodyParser();
        this.setSession(MongoStore);
        this.setFlash();
        this.setLusca();
        this.setCORS();
        this.setCurrUser();
        this.setRoutes();
        this.setStaticFrontend();
        this.handleError();
    }

    public listen(): void {
        this.app.listen(this.app.get("port"), () => {
            console.log(
                "\n========== App is running at PORT %d in %s mode ==========",
                this.app.get("port"),
                this.app.get("env")
            );
            if (process.env.NODE_ENV !== "production") {
                console.log("========== Press CTRL-C to stop ==========\n");
            }
        });
    }

    private setBodyParser() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    private setSession(MongoStore: mongo.MongoStoreFactory): void {
        this.app.use(cookieParser(SESSION_SECRET));
        this.app.use(session({
            cookie: { maxAge: 60000 },
            secret: SESSION_SECRET,
            resave: true,
            saveUninitialized: false,
            store: new MongoStore({
                url: MONGODB_URI,
                autoReconnect: true
            })
        }));
    }

    private setFlash(): void {
        this.app.use(flash());
        // Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
        this.app.use((req, res, next) => {
            // if there's a flash message in the session request, make it available in the response, then delete it
            res.locals.sessionFlash = req.session.sessionFlash;
            delete req.session.sessionFlash;
            next();
        });
    }

    private setLusca(): void {
        this.app.use(lusca.xframe("SAMEORIGIN"));
        this.app.use(lusca.xssProtection(true));
    }

    private setCORS(): void {
        this.app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
            res.setHeader("Access-Control-Allow-Headers",
                "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, " +
                "Access-Control-Request-Method, Access-Control-Request-Headers");
            next();
        });
    }

    private setCurrUser(): void {
        this.app.use((req, res, next) => {
            res.locals.user = req.user;
            next();
        });
    }

    private setRoutes(): void {
        const controllerInstances = [];
        for (const name in controllers) {
            if (controllers.hasOwnProperty(name)) {
                const controller = (controllers as any)[name];
                controllerInstances.push(new controller());
            }
        }
        super.addControllers(controllerInstances);
    }

    private setStaticFrontend(): void {
        // Set Static Assets On Frontend: ABSOLUTELY REQUIRED!!!
        this.app.use(
            express.static(path.resolve(__dirname, "frontend"), { maxAge: 31557600000 })
        );
        // If request doesn't match api => return the main index.html => react-router render the route in the client
        this.app.get("*", (req, res) => {
            res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
        });
    }

    private handleError(): void {
        // Error Handler. Provides full stack - remove for production
        if (process.env.NODE_ENV !== "production") {
            this.app.use(errorHandler());
        }
    }
}

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

// export default app;
