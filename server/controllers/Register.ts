import { Request, Response, NextFunction } from "express";
import { check, sanitize, validationResult } from "express-validator";

import { User, UserDoc } from "../models/User";

import { Controller, Post } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import { ConflictException } from "./Exception";
import { TResponse } from "./TypeResponse";

@Controller("api/register")
export class Register {

    _makeUser(req: Request): UserDoc {
        return new User({
            email: req.body.email,
            password: req.body.password,
            profile: {
                firstName: "",
                lastName: "",
                gender: "",
                location: "",
                website: "",
                picture: ""
            }
        });
    }

    @Post()
    postRegister(req: Request, res: Response, next: NextFunction) {
        check("email", "Email is not valid").isEmail();
        check("password", "Password must be at least 4 characters long").isLength({ min: 4 });
        check("confirmPassword", "Passwords do not match").equals(req.body.password);
        sanitize("email").normalizeEmail({ "gmail_remove_dots": false });

        try {
            validationResult(req).throw();
        }
        catch (errs) {
            // console.log(errs.array());
            Logger.Err(errs.array(), true);
            return res.status(422).json(errs.array());
        }

        const user = this._makeUser(req);
        user.profile.picture = user.getGravatar(60);

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
