import passport from "passport";
import passportLocal from "passport-local";
import _ from "lodash";

import { Request, Response, NextFunction } from "express";
import { User, IUser } from "../models/User";
import Auth from "../utils/Auth";

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((user, done) => {
    done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

/** Sign in with Email and Password */
passport.use("local",
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
        User.findOne({ email: email.toLowerCase() }, (errEmail: Error, user: IUser) => {
            if (errEmail) {
                return done(errEmail);
            }
            if (!user) {
                return done(undefined, false, { message: `Email "${email}" not found` });
            }
            Auth.compare(password, user.password, (errPassword: Error, isMatch: boolean) => {
                if (errPassword) {
                    return done(errPassword);
                }
                if (isMatch) {
                    return done(undefined, user);
                }
                return done(undefined, false, { message: "Invalid Password" });
            });
        });
    })
);

/** Login middleware - Required  */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/login");
};

/** Authorisation middleware - Required */
export const authorise = (req: Request, res: Response, next: NextFunction) => {
    const provider = req.path.split("/").slice(-1)[0];
    if (_.find(req.user.tokens, { kind: provider })) {
        return next();
    }
    return res.redirect(`/auth/${provider}`);
};
