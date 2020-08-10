import { Request, Response } from "express";

import "../auth/passport";

import { Controller, Get } from "@overnightjs/core";

import { Logger } from "@overnightjs/logger";

@Controller("api/logout")
export class Logout {
    @Get()
    public getLogout(req: Request, res: Response) {
        req.logout();
        req.session?.destroy((err) => {
            if (err) {
                Logger.Err("Error : Failed to destroy the session during logout.");
                Logger.Err(err, true);
            }
            req.user = undefined;
            res.redirect("/");
        });
    }
}
