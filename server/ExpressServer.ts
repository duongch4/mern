import http from "http";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

import flash from "express-flash";

import expressStatusMonitor from "express-status-monitor";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import lusca from "lusca";
import helmet from "helmet";

import mongo from "connect-mongo";
import mongoose from "mongoose";
import bluebird from "bluebird";

import path from "path";

import passport from "passport";

import { setLogger, getSessionSecret, getMongoDbUri } from "./config/config";

import errorHandler from "errorhandler";

import { Server } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import * as controllers from "./controllers";

import graphqlHTTP from "express-graphql";
import { schema as graphqlSchema } from "./graphql/schema";
import { root as graphqlResolver } from "./graphql/resolver";

// API keys and Passport configuration
// import passportConfig from "./auth/passport";

// Create Express server
export class ExpressServer extends Server {

    private SESSION_SECRET: string;
    private MONGODB_URI: string;

    constructor() {
        super(true);
        setLogger();
        this.SESSION_SECRET = getSessionSecret();
        this.MONGODB_URI = getMongoDbUri();
        this.config();
    }

    public getApp(): express.Application {
        return this.app;
    }

    private config() {
        mongoose.connection.close((err: Error) => {
            if (err) {
                Logger.Err(err, true);
                process.exit(1);
            }
            const MongoStore = this.setMongoStore();
            this.setExpressStatusMonitor();
            this.setRequestCompression();
            this.setBodyParser();
            this.setExpressSession(MongoStore);
            this.setPassportSession();
            this.logSession();
            // this.setFlash();
            this.setLusca();
            this.setHelmet();
            this.setCORS();
            // this.setCurrUser();
            /** No leading slashes for @overnightjs: @Controller("api"), not @Controller("/api") */
            this.setRoutes();
            this.setGraphQL();
            this.setStaticFrontend();
            this.handleError();
        });
    }

    private setExpressStatusMonitor() {
        this.app.use(expressStatusMonitor());
    }

    private setRequestCompression() {
        this.app.use(compression());
    }

    private setMongoStore(): mongo.MongoStoreFactory {
        const MongoStore = mongo(session);
        (mongoose as any).Promise = bluebird;
        const mongooseConnectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true };
        mongoose.connect(this.MONGODB_URI, mongooseConnectionOptions).then(() => {
            if (this.app.get("env") !== "production") {
                Logger.Info(`MongoDB is connected at: ${this.MONGODB_URI}`);
            }
            else {
                Logger.Info(`MongoDB is connected successfully`);
            }
        }).catch((err: Error) => {
            Logger.Err(`!!! MongoDB connection error. Please make sure MongoDB is running:: ${err}`);
        });
        return MongoStore;
    }

    public listen(port: string): http.Server {
        const server = this.app.listen(port, () => {
            Logger.Info(`App is running at PORT ${port} in "${process.env.NODE_ENV}" mode`);
            if (process.env.NODE_ENV !== "production") {
                Logger.Info("Press CTRL-C to stop");
            }
        });
        return server;
    }

    private setBodyParser() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    private setExpressSession(MongoStore: mongo.MongoStoreFactory) {
        this.app.use(cookieParser(this.SESSION_SECRET));
        this.app.use(session(this.getExpressSession(MongoStore)));
    }

    private getExpressSession(MongoStore: mongo.MongoStoreFactory): session.SessionOptions {
        const sess: session.SessionOptions = {
            name: "sessionID",
            cookie: {
                maxAge: 60000,
                httpOnly: true
            },
            secret: this.SESSION_SECRET as string,
            resave: true,
            saveUninitialized: false,
            store: new MongoStore(
                {
                    url: this.MONGODB_URI,
                    autoReconnect: true
                } as mongo.MongoUrlOptions
            )
        };

        if (process.env.NODE_ENV === "production") {
            this.app.set("trust proxy", 1);
            if (sess.cookie) {
                sess.cookie.secure = true;
            }
        }
        return sess;
    }

    private setPassportSession() {
        this.app.use(passport.initialize());
        this.app.use(passport.session());
    }

    private setFlash() {
        this.app.use(flash());
        // Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
        this.app.use((req, res, next) => {
            // if there's a flash message in the session request, make it available in the response, then delete it
            if (req.session) {
                res.locals.sessionFlash = req.session.sessionFlash;
                delete req.session.sessionFlash;
            }
            next();
        });
    }

    private setLusca() {
        this.app.use(lusca.xframe("SAMEORIGIN"));
        this.app.use(lusca.xssProtection(true));
    }

    private setHelmet() {
        this.app.use(helmet());
    }

    private setCORS() {
        this.app.use((_, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
            res.setHeader("Access-Control-Allow-Headers",
                "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, " +
                "Access-Control-Request-Method, Access-Control-Request-Headers, Pragma, Cache-Control");
            next();
        });
    }

    private setCurrUser() {
        this.app.use((req, res, next) => {
            res.locals.user = req.user;
            next();
        });
    }

    private setRoutes() {
        const controllerInstances = [];
        for (const name of Object.keys(controllers)) {
            const controller = (controllers as any)[name];
            if (typeof controller === "function") {
                controllerInstances.push(new controller());
            }
        }
        super.addControllers(controllerInstances);
    }

    private setGraphQL() {
        this.app.use(
            "/api/graphql",
            graphqlHTTP({
                schema: graphqlSchema,
                rootValue: graphqlResolver,
                graphiql: true
            })
        );
    }

    private setStaticFrontend() {
        // Set Static Assets On Frontend: ABSOLUTELY REQUIRED!!!
        this.app.use(
            express.static(path.resolve(__dirname, "client"), { maxAge: 31557600000 })
        );
        // React Router: client-side routing: ABSOLUTELY REQUIRED!!!
        // If request doesn't match api => return the main index.html
        this.app.get("/*", (_, res) => {
            res.sendFile(path.resolve(__dirname, "client", "index.html"), (err) => {
                if (err) {
                    res.status(500).send(err);
                }
            });
        });
    }

    private logSession() {
        if (process.env.NODE_ENV !== "production") {
            this.app.use((req, _, next) => {
                Logger.Info(req.session, true);
                Logger.Info(req.user, true);
                next();
            });
        }
    }

    private handleError() {
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
