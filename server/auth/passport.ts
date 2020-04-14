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

type UserWithToken = Express.User & { tokens: any };
/** Authorisation middleware - Required */
export const authorise = (req: Request, res: Response, next: NextFunction) => {
    const provider = req.path.split("/").slice(-1)[0];
    const user: UserWithToken = req.user as UserWithToken;
    if (_.find(user.tokens, { kind: provider })) {
    // if (_.find((req.user?).tokens, { kind: provider })) {
        return next();
    }
    return res.redirect(`/api/${provider}`);
};
