import * as passport from "passport";
import { IVerifyOptions } from "passport-local";

import { Request, Response, NextFunction } from "express";
import { check, sanitize, validationResult } from "express-validator";

import { WriteError } from "mongodb";
import { User, IUser, IAuthToken } from "../models/User";
import "../auth/passport";

import * as crypto from "crypto";
import { Controller, Middleware, Get, Put, Post, Delete } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";

@Controller("/login")
export class Login {

    // @Get()
    // private getLogin(req: Request, res: Response) {
    //     if (req.user) {
    //         Logger.Info(`User "${req.user}": to be logged in`);
    //         return res.redirect("/");
    //     }
    //     // Should render stuffs here!!
    //     res.status(200).json({
    //         user: req.user,
    //     });
    // }

    @Post()
    private postLogin(req: Request, res: Response, next: NextFunction) {
        console.log(req);
        console.log(res);
        check("email", "Email is not valid").isEmail();
        check("password", "Password cannot be blank").isLength({ min: 1 });
        sanitize("email").normalizeEmail({ gmail_remove_dots: false });

        try {
            validationResult(req).throw();
        }
        catch (error) {
            console.log(error.mapped());
        }
        Logger.Info(req.params.msg);
        return res.status(400).json({
            error: req.params.msg,
        });
    }

    // export const postLogin = (req: Request, res: Response, next: NextFunction) => {
    //     check("email", "Email is not valid").isEmail();
    //     check("password", "Password cannot be blank").isLength({min: 1});
    //     sanitize("email").normalizeEmail({ gmail_remove_dots: false });
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //       req.flash("errors", errors.array());
    //       return res.redirect("/login");
    //     }
    //     passport.authenticate("local", (err: Error, user: UserDocument, info: IVerifyOptions) => {
    //       if (err) { return next(err); }
    //       if (!user) {
    //         req.flash("errors", {msg: info.message});
    //         return res.redirect("/login");
    //       }
    //       req.logIn(user, (err) => {
    //         if (err) { return next(err); }
    //         req.flash("success", { msg: "Success! You are logged in." });
    //         res.redirect(req.session.returnTo || "/");
    //       });
    //     })(req, res, next);
    //   };

    @Delete()
    private delMessage(req: Request, res: Response) {
        try {
            throw new Error(req.params.msg);
        } catch (err) {
            Logger.Err(err, true);
            return res.status(400).json({
                error: req.params.msg,
            });
        }
    }
}
