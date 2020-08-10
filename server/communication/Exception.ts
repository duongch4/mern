import { TResponse } from "./TResponse";

class BaseCustomException extends Error {
    public readonly response: TResponse<undefined>;

    constructor(
        message: string, extra = { redirect: "/" }, status = "Known Exception", code = 400
    ) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.response = {
            status: status,
            code: code,
            message: message,
            extra: extra
        };
    }
}

export class NotFoundException extends BaseCustomException {
    constructor(
        message: string, extra = undefined, status = "Not Found Exception", code = 404
    ) {
        super(message, extra, status, code);
    }
}

export class ConflictException extends BaseCustomException {
    constructor(
        message: string, extra = undefined, status = "Conflict Exception", code = 409
    ) {
        super(message, extra, status, code);
    }
}

export class InternalServerException extends BaseCustomException {
    constructor(
        message: string, extra = undefined, status = "Internal Server Exception", code = 500
    ) {
        super(message, extra, status, code);
    }
}

export class BadRequestException extends BaseCustomException {
    constructor(
        message: string, extra = undefined, status = "Bad Request Exception", code = 400
    ) {
        super(message, extra, status, code);
    }
}
