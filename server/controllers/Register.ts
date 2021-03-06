import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

import { User, UserDoc } from "../models/User";

import { Controller, Post } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import { ConflictException } from "../communication/Exception";
import { getResponse200 } from "../communication/TResponse";

@Controller("api/register")
export class Register {

    private makeUser(req: Request): UserDoc {
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
    public postRegister(req: Request, res: Response, next: NextFunction) {
        check("email", "Email is not valid").isEmail();
        check("password", "Password must be at least 4 characters long").isLength({ min: 4 });
        check("confirmPassword", "Passwords do not match").equals(req.body.password);
        check("email").normalizeEmail({ "gmail_remove_dots": false });

        try {
            validationResult(req).throw();
        }
        catch (errs) {
            // console.log(errs.array());
            Logger.Err(errs.array(), true);
            return res.status(422).json(errs.array());
        }

        const user = this.makeUser(req);
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
                    const message = "Registered Successfully";
                    const extra = { redirect: "/" };
                    return res.status(200).json(getResponse200(undefined, message, extra));
                });
            });
        });
    }
}
