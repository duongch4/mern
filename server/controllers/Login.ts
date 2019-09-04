import "../auth/passport"; // passport config
import passport from "passport";
import { IVerifyOptions } from "passport-local";

import { Request, Response, NextFunction } from "express";
import { check, sanitize, validationResult } from "express-validator";

import { UserDoc } from "../models/User";

import { Controller, Middleware, Get, Put, Post, Delete } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import { NotFoundException } from "./Exception";
import { TResponse } from "./TypeResponse";

@Controller("api/login")
export class Login {

    @Post()
    postLogin(req: Request, res: Response, next: NextFunction) {
        Logger.Info(req.body, true);

        check("email", "Email cannot be empty").exists({ checkNull: true, checkFalsy: true });
        check("password", "Password cannot be empty").exists({ checkNull: true, checkFalsy: true });
        check("email", "Email is not valid").isEmail();
        check("password", "Password must be at least 4 characters long").isLength({ min: 4 });
        sanitize("email").normalizeEmail({ gmail_remove_dots: false });

        try {
            validationResult(req).throw();
        }
        catch (errs) {
            console.log(errs.array());
            return res.status(422).json(errs.array());
        }

        passport.authenticate("local", (errAuth, user: UserDoc, info: IVerifyOptions) => {
            if (errAuth) {
                return next(errAuth);
            }
            if (!user) {
                return res.status(404).json(new NotFoundException(info.message).response);
            }
            req.logIn(user, (errLogin) => {
                if (errLogin) {
                    return next(errLogin);
                }
                const response: TResponse = {
                    status: "OK",
                    code: 200,
                    payload: {
                        redirect: "/"
                    },
                    message: "Logged In Successfully"
                };
                Logger.Info(req.user, true);
                return res.status(200).json(response);
            });
        })(req, res, next);
    }
}
