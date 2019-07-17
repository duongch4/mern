import { Request, Response } from "express";

import "../auth/passport";

import { Controller, Middleware, Get, Put, Post, Delete } from "@overnightjs/core";
import { TResponse } from "./TypeResponse";

@Controller("auth/logout")
export class Logout {
    @Get()
    getLogin(req: Request, res: Response) {
        req.logout();
        res.redirect("/");
    }
}
