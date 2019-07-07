
/// <reference types="express" />

// Add RequestValidation Interface on to Express's Request Interface.
// tslint:disable-next-line: no-namespace
declare namespace Express {
// tslint:disable-next-line: no-empty-interface
    interface IRequest extends IFlash {}
}

interface IFlash {
    flash(type: string, message: any): void;
}

declare module "express-flash";
