import { TResponse } from "./TypeResponse";

class BaseCustomException extends Error {
    public readonly response: TResponse;

    constructor(
        message: string, payload: object = {}, status = "Known Exception", code = 400
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
        message: string, payload: object = {}, status = "Not Found Exception", code = 404
    ) {
        super(message, payload, status, code);
    }
}

export class ConflictException extends BaseCustomException {
    constructor(
        message: string, payload: object = {}, status = "Conflict Exception", code = 409
    ) {
        super(message, payload, status, code);
    }
}
