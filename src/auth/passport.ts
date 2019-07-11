import * as passport from "passport";
import * as passportLocal from "passport-local";
import * as _ from "lodash";

import { User, IUser } from "../model/User";
import { Request, Response, NextFunction } from "express";
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
