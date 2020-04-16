import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

import { User, UserProfile, UserDoc } from "../models/User";

import { Controller, Get, Put, Delete } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import { NotFoundException, ConflictException } from "../communication/Exception";
import { TResponse } from "../communication/TResponse";
import { WriteError } from "mongodb";

import { Logger as Log } from "@overnightjs/logger";

type UserPayload = {
    id: string;
    email: string;
    facebook: string;
    profile: UserProfile;
};

type UserWithId = Express.User & { id: any };

@Controller("api/account")
export class Account {

    @Get()
    public getSessionCurrentUser(req: Request, res: Response) {
        if (req.user) {
            User.findById((req.user as UserWithId).id, (err, user: UserDoc) => {
                if (err) {
                    return res.status(404).json(new NotFoundException(err).response);
                }
                else {
                    const userPayload: UserPayload = {
                        id: user.id,
                        email: user.email,
                        facebook: user.facebook,
                        profile: user.profile
                    };
                    const response: TResponse = {
                        status: "OK",
                        code: 200,
                        payload: userPayload,
                        message: "Account info found"
                    };
                    return res.status(200).json(response);
                }
            });
        }
        else {
            return res.status(404).json(new NotFoundException("Session has no user").response);
        }
    }

    @Get(":id")
    public getAccount(req: Request, res: Response) {
        User.findById(req.params.id, (err, user: UserDoc) => {
            if (err) {
                return res.status(404).json(new NotFoundException(err).response);
            }
            else {
                const response: TResponse = {
                    status: "OK",
                    code: 200,
                    payload: user,
                    message: "Account info found"
                };
                return res.status(200).json(response);
            }
        });
    }

    @Put("profile/:id")
    public putAccountProfile(req: Request, res: Response, next: NextFunction) {
        Logger.Info(req.body, true);

        check("email", "Email cannot be empty").exists({ checkNull: true, checkFalsy: true });
        check("email", "Email is not valid").isEmail();
        check("email").normalizeEmail({ "gmail_remove_dots": false });
        try {
            validationResult(req).throw();
        }
        catch (errs) {
            Logger.Err(errs.array());
            return res.status(422).json(errs.array());
        }

        User.findById(req.params.id, (errFind, user: UserDoc) => {
            if (errFind) {
                return next(errFind);
            }
            if (!user) {
                const message = "User not found by id";
                return res.status(404).json(new NotFoundException(message).response);
            }

            user.email = req.body.email || "";
            this.updateProfile(user, req);

            user.save((err: WriteError) => {
                if (err) {
                    if (err.code === 11000) {
                        const message = "The email address you have entered is already associated with an account.";
                        const payload = { redirect: "/account" };
                        return res.status(409).json(new ConflictException(message, payload).response);
                    }
                    return next(err);
                }
                const response: TResponse = {
                    status: "OK",
                    code: 200,
                    message: "Profile information has been updated.",
                    payload: {
                        data: user,
                        redirect: "/account"
                    }
                };
                res.status(200).json(response);
            });
        });
    }

    private updateProfile(user: UserDoc, req: Request) {
        user.profile.firstName = req.body.firstName || "";
        user.profile.lastName = req.body.lastName || "";
        user.profile.gender = req.body.gender || "";
        user.profile.location = req.body.location || "";
        user.profile.website = req.body.website || "";
    }

    @Delete(":id")
    public deleteAccount(req: Request, res: Response, next: NextFunction) {
        User.findById(req.params.id).exec((errFind, user) => {
            if (errFind) {
                return next(errFind);
            }
            if (!user) {
                const message = "User ID does not match database record";
                return res.status(404).json(new NotFoundException(message).response);
            }
            // selects the user by its ID, then removes it.
            User.deleteOne({ _id: req.params.id }, (errRemove) => {
                if (errRemove) {
                    return next(errRemove);
                }
                else {
                    const response: TResponse = {
                        status: "OK",
                        code: 200,
                        payload: {
                            redirect: "/"
                        },
                        message: "User has been deleted"
                    };
                    req.logout();
                    return res.status(200).json(response);
                }
            });
        });
    }

    @Put("password/:id")
    public putAccountPassword(req: Request, res: Response, next: NextFunction) {
        Logger.Info(req.body, true);

        check("password", "Password cannot be empty").exists({ checkNull: true, checkFalsy: true });
        check("password", "Password must be at least 4 characters long").isLength({ min: 4 });
        check("confirmPassword", "Passwords do not match").equals(req.body.password);
        try {
            validationResult(req).throw();
        }
        catch (errs) {
            Log.Err(errs.array());
            return res.status(422).json(errs.array());
        }

        User.findById(req.params.id, (errFind, user: UserDoc) => {
            if (errFind) {
                return next(errFind);
            }
            if (!user) {
                const message = "User not found by id";
                return res.status(404).json(new NotFoundException(message).response);
            }

            user.password = req.body.password;

            user.save((err: WriteError) => {
                if (err) {
                    return next(err);
                }
                const response: TResponse = {
                    status: "OK",
                    code: 200,
                    message: "Password has been updated.",
                    payload: {
                        data: user,
                        redirect: "/account"
                    }
                };
                res.status(200).json(response);
            });
        });
    }
}
