import "../auth/passport";

import { Request, Response, NextFunction } from "express";
import { check, sanitize, validationResult } from "express-validator";

import { User } from "../models/User";

import { Controller, Middleware, Get, Put, Post, Delete } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import { NotFoundException, ConflictException } from "./Exception";
import { TResponse } from "./TypeResponse";

@Controller("auth/register")
export class Register {

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
    postRegister(req: Request, res: Response, next: NextFunction) {
        check("email", "Email is not valid").isEmail();
        check("password", "Password must be at least 4 characters long").isLength({ min: 4 });
        check("confirmPassword", "Passwords do not match").equals(req.body.password);
        sanitize("email").normalizeEmail({ gmail_remove_dots: false });

        try {
            validationResult(req).throw();
        }
        catch (errors) {
            console.log(errors.array());
            return res.status(422).json(errors.array());
        }

        const user = new User({
            email: req.body.email,
            password: req.body.password
        });

        User.findOne({ email: req.body.email }, (errorOne, existingUser) => {
            if (errorOne) { return next(errorOne); }
            if (existingUser) {
                const response = new ConflictException("Account with that email address already exists!").response;
                return res.status(409).json(response);
            }
            user.save((errorTwo) => {
                if (errorTwo) { return next(errorTwo); }
                req.logIn(user, (errorThree) => {
                    if (errorThree) {
                        return next(errorThree);
                    }
                    const response: TResponse = {
                        status: "OK",
                        code: 200,
                        payload: {
                            redirect: "/"
                        },
                        message: "Registration is successful. You"
                    };
                    res.status(200).json(response);
                });
            });
        });
    }
}
