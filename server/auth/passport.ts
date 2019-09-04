import passport from "passport";
import _ from "lodash";

import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { LocalStrategy } from "./LocalStrategy";

passport.serializeUser<any, any>((user, done) => {
    done(undefined, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

/** Sign in with Email and Password */
passport.use("local", LocalStrategy);

/** Login middleware - Required  */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/");
};

/** Authorisation middleware - Required */
export const authorise = (req: Request, res: Response, next: NextFunction) => {
    const provider = req.path.split("/").slice(-1)[0];
    if (_.find(req.user.tokens, { kind: provider })) {
        return next();
    }
    return res.redirect(`/api/${provider}`);
};
