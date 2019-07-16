import { IResponse } from "./InterfaceResponse";

class BaseCustomException extends Error {
     readonly response: IResponse;

    constructor(
        message: string, status: string = "Known Exception", code: number = 400, payload: object = {}
    ) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.response = {
            status: status,
            code: code,
            payload: payload,
            message: message
        };
    }
}

export class NotFoundException extends BaseCustomException {
    constructor(
        message: string, status: string = "Not Found Exception", code: number = 404, payload: object = {}
    ) {
        super(message, status, code, payload);
    }
}

export class ConflictException extends BaseCustomException {
    constructor(
        message: string, status: string = "Conflict Exception", code: number = 409, payload: object = {}
    ) {
        super(message, status, code, payload);
    }
}
