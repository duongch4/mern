import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import { WriteError } from "mongodb";
import mailChecker from "mailchecker";
import { promisify } from "util";
import crypto from "crypto";
import nodemailer from "nodemailer";
import sendgridMailService from "@sendgrid/mail";

import { Controller, Get, Put, Delete, ClassMiddleware } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";

import { User, UserDoc } from "../models/User";
import { isAuthenticated } from "../auth/passport";

import { NotFoundException, ConflictException, BadRequestException, InternalServerException } from "../communication/Exception";
import { getResponse200 } from "../communication/TResponse";


const randomByteAsync = promisify(crypto.randomBytes);
const sendgridTransport = require("nodemailer-sendgrid-transport");

@Controller("api/account")
@ClassMiddleware([isAuthenticated])
export class Account {

    @Get(":id")
    public getAccount(req: Request, res: Response) {
        User.findById(req.params.id, (err, user: UserDoc) => {
            if (err) {
                return res.status(404).json(new NotFoundException(err).response);
            }
            else {
                const message = "Account info found";
                return res.status(200).json(getResponse200(user, message));
            }
        });
    }

    @Put(":id/profile")
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
                        return res.status(409).json(new ConflictException(message).response);
                    }
                    return next(err);
                }
                res.status(200).json(getResponse200(user, "Profile information has been updated."));
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
                    const payload: any = { redirect: "/" };
                    const message = "User has been deleted";
                    req.logout();
                    return res.status(200).json(getResponse200(payload, message));
                }
            });
        });
    }

    @Put(":id/password")
    public putAccountPassword(req: Request, res: Response, next: NextFunction) {
        Logger.Info(req.body, true);

        check("password", "Password cannot be empty").exists({ checkNull: true, checkFalsy: true });
        check("password", "Password must be at least 4 characters long").isLength({ min: 4 });
        check("confirmPassword", "Passwords do not match").equals(req.body.password);
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

            user.password = req.body.password;

            user.save((err: WriteError) => {
                if (err) {
                    return next(err);
                }
                const message = "Password has been updated.";
                res.status(200).json(getResponse200(user, message));
            });
        });
    }

    @Get(":id/verify")
    public getVerifyEmail(req: Request, res: Response) {
        User.findById(req.params.id, (err, user: UserDoc) => {
            if (err) {
                return res.status(404).json(new NotFoundException(err).response);
            }

            if (user.emailVerified) {
                const message = "The email address has been verified";
                return res.status(200).json(getResponse200(undefined, message));
            }

            if (!mailChecker.isValid(user.email)) {
                return res.status(400).json(new BadRequestException("Invalid Email").response);
            }

            const getRandomToken = randomByteAsync(16).then((buffer) => buffer.toString("hex"));

            const setRandomToken = (token: string) => {
                user.emailVerificationToken = token;
                user.save();
                return token;
            };

            const sendVerifyEmail = (token: string) => {
                const transporter = nodemailer.createTransport(sendgridTransport({
                    auth: {
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        api_key: process.env.SENDGRID_API_KEY
                    }
                }));

                const mailOptions = {
                    to: user.email,
                    from: "mern@bangchi.tk",
                    subject: "Please verify your email address on MERN",
                    html: `Thank you for registering with MERN.\n\n
                    To verify your email address please click on the following link (or paste into your browser):\n\n
                    <a href="${req.protocol}://${req.headers.host}/api/account/${req.params.id}/verify/${token}">Click here</a>.\n\n`
                };

                sendgridMailService.setApiKey(process.env.SENDGRID_API_KEY as string);

                return transporter.sendMail(
                    mailOptions
                ).then(
                    () => res.status(200).json(getResponse200(undefined, `An e-mail has been sent to ${user.email} with further instructions.`))
                ).catch(
                    (errSendMail) => {
                        const message = errSendMail.message ? errSendMail.message : "Unexpected Internal Server Error. Please try again!";
                        return res.status(500).json(new InternalServerException(message).response);
                    }
                );
            };

            getRandomToken.then(setRandomToken).then(sendVerifyEmail);
        });
    }

    @Get(":id/verify/:token")
    public getVerifyEmailToken(req: Request, res: Response) {
        User.findById(req.params.id, (err, user: UserDoc) => {
            if (err) {
                return res.status(404).json(new NotFoundException(err).response);
            }

            if (user.emailVerified) {
                const message = "The email address has been verified";
                return res.status(200).json(getResponse200(undefined, message));
            }

            const isHex = (token: string) => /^[0-9a-fA-F]+$/.test(token);

            if (req.params.token && !isHex(req.params.token)) {
                return res.status(400).json(new BadRequestException("Requested token is invalid. Please send a verification email again.").response);
            }

            if (req.params.token === user.emailVerificationToken) {
                Logger.Imp("Great. This may work");
                user.emailVerificationToken = "";
                user.emailVerified = true;
                user.save().then(
                    () => res.status(200).json(getResponse200(user, "Email verified successfully")).redirect("/account")
                ).catch(
                    (errUserSave) => res.status(500).json(new InternalServerException(errUserSave).response)
                );
            }
            else {
                const message = "The verification link was invalid, or is for a different account";
                Logger.Err(message);
                return res.status(400).json(new BadRequestException(message).response);
            }
        });
    }
}
