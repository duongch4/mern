import { Request, Response } from "express";
import { Controller, Middleware as _, Get, Put, Post, Delete } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";

@Controller("api/more/")
export class ControllerOne {

    @Get(":msg")
    public getMessage(req: Request, res: Response) {
        Logger.Info(req.params.msg);
        res.status(200).json({
            message: req.params.msg,
        });
    }

    @Put(":msg")
    public putMessage(req: Request, res: Response) {
        Logger.Info(req.params.msg);
        return res.status(400).json({
            error: req.params.msg,
        });
    }

    @Post(":msg")
    public postMessage(req: Request, res: Response) {
        Logger.Info(req.params.msg);
        return res.status(400).json({
            error: req.params.msg,
        });
    }

    @Delete(":msg")
    public delMessage(req: Request, res: Response) {
        try {
            throw new Error(req.params.msg);
        }
        catch (err) {
            Logger.Err(err, true);
            return res.status(400).json({
                error: req.params.msg,
            });
        }
    }
}
