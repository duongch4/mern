import { Request, Response } from "express";

import "../auth/passport";

import { Controller, Middleware, Get, Put, Post, Delete } from "@overnightjs/core";

@Controller("api/logout")
export class Logout {
    @Get()
    getLogout(req: Request, res: Response) {
        req.logout();
        res.redirect("/");
    }
}
