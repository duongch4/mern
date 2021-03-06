import "../auth/passport"; // passport config
import passport from "passport";
import { IVerifyOptions } from "passport-local";

import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

import { User, UserDoc, UserPayload } from "../models/User";

import { Controller, Post, Get } from "@overnightjs/core";
import { Logger as Log } from "@overnightjs/logger";
import { NotFoundException } from "../communication/Exception";
import { getResponse200 } from "../communication/TResponse";

type UserWithId = Express.User & { id: any };

@Controller("api/login")
export class Login {

    @Get("check")
    public checkLogginStatus(req: Request, res: Response) {
        if (req.user) {
            User.findById((req.user as UserWithId).id, (err, user: UserDoc) => {
                if (err) {
                    return res.status(404).json(new NotFoundException("Unknown User!!!", err).response);
                }
                else {
                    const userPayload: UserPayload = {
                        id: user.id,
                        email: user.email,
                        emailVerified: user.emailVerified,
                        facebook: user.facebook,
                        profile: user.profile
                    };
                    const message = "Status: Logged In";
                    return res.status(200).json(getResponse200(userPayload, message));
                }
            });
        }
        else {
            const message = "Status: Not Logged In";
            return res.status(200).json(getResponse200(undefined, message));
        }
    }

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
                const message = "Logged In Successfully";
                const extra = { redirect: "/" };
                return res.status(200).json(getResponse200(undefined, message, extra));
            });
        })(req, res, next);
    }
}
