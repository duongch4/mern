import http from "http";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import flash from "express-flash";

import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import lusca from "lusca";

import mongo from "connect-mongo";
import mongoose from "mongoose";
import bluebird from "bluebird";

import path from "path";

import passport from "passport";

import { MONGODB_URI, SESSION_SECRET } from "./utils/SecretsSetup";

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

    constructor() {
        super(true);
        this.config();
    }

    getApp(): express.Application {
        return this.app;
    }

    config(): void {
        mongoose.connection.close((err: Error) => {
            if (err) {
                Logger.Err(err, true);
                process.exit(1);
            }
            const MongoStore = this.setMongoStore();
            this.app.use(compression());
            this.setBodyParser();
            this.setSession(MongoStore);
            this.setPassportSession();
            this.logSession();
            // this.setFlash();
            this.setLusca();
            this.setCORS();
            // this.setCurrUser();
            /** No leading slashes for @overnightjs: @Controller("api"), not @Controller("/api") */
            this.setRoutes();
            this.setGraphQL();
            this.setStaticFrontend();
            this.handleError();
        });
    }

    setMongoStore(): mongo.MongoStoreFactory {
        const MongoStore = mongo(session);
        (mongoose as any).Promise = bluebird;
        mongoose.connect(MONGODB_URI as string, { useCreateIndex: true, useNewUrlParser: true }).then(() => {
            if (this.app.get("env") !== "production") {
                Logger.Info(`MongoDB is connected at: ${MONGODB_URI}`);
            }
            else {
                Logger.Info(`MongoDB is connected successfully`);
            }
        }).catch((err: Error) => {
            Logger.Err(`!!! MongoDB connection error. Please make sure MongoDB is running:: ${err}`);
        });
        return MongoStore;
    }

    listen(port: string): http.Server {
        const server = this.app.listen(port, () => {
            Logger.Info(`App is running at PORT ${port} in "${this.app.get("env")}" mode`);
            if (process.env.NODE_ENV !== "production") {
                Logger.Info("Press CTRL-C to stop");
            }
        });
        return server;
    }

    setBodyParser() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    setSession(MongoStore: mongo.MongoStoreFactory): void {
        this.app.use(cookieParser(SESSION_SECRET));
        this.app.use(session({
            cookie: { maxAge: 60000 },
            secret: SESSION_SECRET as string,
            resave: true,
            saveUninitialized: false,
            store: new MongoStore(
                {
                    url: MONGODB_URI,
                    autoReconnect: true
                } as mongo.MongoUrlOptions
            )
        }));
    }

    setPassportSession(): void {
        this.app.use(passport.initialize());
        this.app.use(passport.session());
    }

    setFlash(): void {
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

    setLusca(): void {
        this.app.use(lusca.xframe("SAMEORIGIN"));
        this.app.use(lusca.xssProtection(true));
    }

    setCORS(): void {
        this.app.use((_, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
            res.setHeader("Access-Control-Allow-Headers",
                "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, " +
                "Access-Control-Request-Method, Access-Control-Request-Headers");
            next();
        });
    }

    setCurrUser(): void {
        this.app.use((req, res, next) => {
            res.locals.user = req.user;
            next();
        });
    }

    setRoutes(): void {
        const controllerInstances = [];
        for (const name of Object.keys(controllers)) {
            const controller = (controllers as any)[name];
            if (typeof controller === "function") {
                controllerInstances.push(new controller());
            }
        }
        super.addControllers(controllerInstances);
    }

    setGraphQL(): void {
        this.app.use(
            "/graphql",
            graphqlHTTP({
                schema: graphqlSchema,
                rootValue: graphqlResolver,
                graphiql: true
            })
        );
    }

    setStaticFrontend(): void {
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

    logSession(): void {
        if (process.env.NODE_ENV !== "production") {
            this.app.use((req, _, next) => {
                Logger.Info(req.session, true);
                Logger.Info(req.user, true);
                next();
            });
        }
    }

    handleError(): void {
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
