import "../auth/passport"; // passport config
import passport from "passport";
import { IVerifyOptions } from "passport-local";

import { Request, Response, NextFunction } from "express";
import { check, sanitize, validationResult } from "express-validator";

import { UserDoc } from "../models/User";

import crypto from "crypto";
import { Controller, Middleware, Get, Put, Post, Delete } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import { NotFoundException } from "./Exception";
import { TResponse } from "./TypeResponse";

@Controller("auth/login")
export class Login {

    // @Get()
    //  getLogin(req: Request, res: Response) {
    //     // if (req.user) {
    //     //     Logger.Info(`User "${req.user}": to be logged in`);
    //     //     return res.redirect("/");
    //     // }
    //     // Should render stuffs here!!
    //     res.status(400).json({
    //         user: req.user,
    //     });
    // }

    @Post()
    postLogin(req: Request, res: Response, next: NextFunction) {
        Logger.Info(req.body, true);

        check("email", "Email cannot be empty").exists({ checkNull: true, checkFalsy: true });
        check("password", "Password cannot be empty").exists({ checkNull: true, checkFalsy: true });
        check("email", "Email is not valid").isEmail();
        check("password", "Password must be longer than 4 characters").isLength({ min: 4 });
        sanitize("email").normalizeEmail({ gmail_remove_dots: false });

        try {
            validationResult(req).throw();
        }
        catch (errors) {
            console.log(errors.array());
            return res.status(422).json(errors.array());
        }

        passport.authenticate("local", (errorOne, user: UserDoc, info: IVerifyOptions) => {
            console.log("\na");
            if (errorOne) { return next(errorOne); }
            console.log("\nb");
            if (!user) {
                console.log("\nc");
                return res.status(404).json(new NotFoundException(info.message).response);
            }
            req.logIn(user, (errorTwo) => {
                if (errorTwo) { return next(errorTwo); }
                // req.flash("success", { msg: "Success! You are logged in." });
                // res.redirect(req.session.returnTo || "/");
                const response: TResponse = {
                    status: "OK",
                    code: 200,
                    payload: {
                        redirect: "/"
                    },
                    message: "Success Logged In"
                };
                return res.status(200).json(response);
            });
        })(req, res, next);
    }
}
