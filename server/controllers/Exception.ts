import { TResponse } from "./TypeResponse";

class BaseCustomException extends Error {
    readonly response: TResponse;

    constructor(
        message: string, payload: object = {}, status: string = "Known Exception", code: number = 400
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
        message: string, payload: object = {}, status: string = "Not Found Exception", code: number = 404
    ) {
        super(message, payload, status, code);
    }
}

export class ConflictException extends BaseCustomException {
    constructor(
        message: string, payload: object = {}, status: string = "Conflict Exception", code: number = 409
    ) {
        super(message, payload, status, code);
    }
}
