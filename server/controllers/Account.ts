import "../auth/passport"; // passport config
import passport from "passport";
import { IVerifyOptions } from "passport-local";

import { Request, Response, NextFunction } from "express";
import { check, sanitize, validationResult } from "express-validator";

import { User, UserDoc } from "../models/User";

import crypto from "crypto";
import { Controller, Middleware, Get, Put, Post, Delete } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import { NotFoundException } from "./Exception";
import { TResponse } from "./TypeResponse";

@Controller("account")
export class Account {

    @Get(":id")
    getAccount(req: Request, res: Response) {
        User.findById(req.params.id, (error, user: UserDoc) => {
            if (error) {
                res.send(error);
            }
            else {
                res.json(user);
            }
        });
    }

    @Put(":id")
    putAccount(req: Request, res: Response) {
        Logger.Info(req.body, true);

        User.findById(req.params.id, (error, user: UserDoc) => {
            if (error) {
                return res.send(error);
            }
            if (!user) {
                return res.json({ message: "User not found by id... no action performed" });
            }
            // if (!user._id.equals(req.user._id)) return res.json({message: 'User details do not match.'})
            if (user) {
                this.checkUsername(req.body, function (err, existingUser) {
                    if (err) {
                        return res.json(err);
                    }
                    // username or displayname exist
                    if (existingUser) {
                        return res.json(existingUser);
                    }
                    // update user
                    user.update(req.body)
                        .exec((errorUpdate) => {
                            if (errorUpdate) { res.send(err); }
                            return res.json({ message: "User has been updated" });
                        });
                });
            }
        });
    }

    @Delete(":id")
    deleteAccount(req: Request, res: Response) {
        User.findById(req.user._id)
            .exec(function (err, user) {
                if (!user._id.equals(req.user._id)) {
                    return res.json({ message: "Users do not match" });
                }
                // selects the user by its ID, then removes it.
                User.remove({ _id: req.params.user_id }, (error) => {
                    if (error) { res.send(error); }
                    return res.json({ message: "User has been deleted" });
                });
            });
    }

    checkUsername = (body: any, cb: (error: any, existingUser: UserDoc | boolean | {}) => void) => {
        const {
            _id: userId,
            username,
            displayName
        } = body;

        User.find({ username })
            .where("_id").ne(userId)
            .exec((errUsername, user) => {
                if (errUsername) {
                    return cb(errUsername, false);
                }
                // User exists
                if (user.length !== 0) {
                    return cb(undefined, { message: "Username currently exists." });
                }

                User.find({ displayName })
                    .where("_id").ne(userId)
                    .exec((errDisplayname, name) => {
                        if (errDisplayname) {
                            return cb(errDisplayname, false);
                        }

                        // displayName exists
                        if (name.length !== 0) {
                            return cb(undefined, { message: "DisplayName currently exists" });
                        }

                        // neither username or displayName exists
                        return cb(undefined, false);
                    });
            });
    }
}
