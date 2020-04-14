import "../auth/passport"; // passport config
import passport from "passport";
import { IVerifyOptions } from "passport-local";

import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

import { UserDoc } from "../models/User";

import { Controller, Post } from "@overnightjs/core";
import { Logger as Log } from "@overnightjs/logger";
import { NotFoundException } from "./Exception";
import { TResponse } from "./TypeResponse";

@Controller("api/login")
export class Login {

    @Post()
    public postLogin(req: Request, res: Response, next: NextFunction) {
        Log.Info(req.body, true);

        check("email", "Email cannot be empty").exists({ checkNull: true, checkFalsy: true });
        check("password", "Password cannot be empty").exists({ checkNull: true, checkFalsy: true });
        check("email", "Email is not valid").isEmail();
        check("password", "Password must be at least 4 characters long").isLength({ min: 4 });
        check("email").normalizeEmail({ "gmail_remove_dots": false });

        try {
            validationResult(req).throw();
        }
        catch (errs) {
            Log.Err(errs.array());
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
                Log.Info(req.user, true);
                return res.status(200).json(response);
            });
        })(req, res, next);
    }
}
