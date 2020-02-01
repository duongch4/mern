import { Request, Response } from "express";

import "../auth/passport";

import { Controller, Get } from "@overnightjs/core";

@Controller("api/logout")
export class Logout {
    @Get()
    public getLogout(req: Request, res: Response) {
        req.logout();
        res.redirect("/");
    }
}
