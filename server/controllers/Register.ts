import { Request, Response, NextFunction } from "express";
import { check, sanitize, validationResult } from "express-validator";

import { User } from "../models/User";

import { Controller, Middleware, Get, Put, Post, Delete } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import { ConflictException } from "./Exception";
import { TResponse } from "./TypeResponse";

@Controller("auth/register")
export class Register {

    @Post()
    postRegister(req: Request, res: Response, next: NextFunction) {
        check("email", "Email is not valid").isEmail();
        check("password", "Password must be at least 4 characters long").isLength({ min: 4 });
        check("confirmPassword", "Passwords do not match").equals(req.body.password);
        sanitize("email").normalizeEmail({ gmail_remove_dots: false });

        try {
            validationResult(req).throw();
        }
        catch (errs) {
            console.log(errs.array());
            return res.status(422).json(errs.array());
        }

        const user = new User({
            email: req.body.email,
            password: req.body.password
        });

        User.findOne({ email: req.body.email }, (errFind, existingUser) => {
            if (errFind) {
                return next(errFind);
            }
            if (existingUser) {
                const response = new ConflictException("Account with that email address already exists!").response;
                return res.status(409).json(response);
            }
            user.save((errSaveUser) => {
                if (errSaveUser) {
                    return next(errSaveUser);
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
                        message: "Registration is successful."
                    };
                    return res.status(200).json(response);
                });
            });
        });
    }
}
