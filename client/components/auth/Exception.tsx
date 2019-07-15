class BaseCustomException extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        if (typeof Error.captureStackTrace === "function") {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

export class EmptyException extends BaseCustomException { }
export class InvalidLengthException extends BaseCustomException { }
export class NotMatchException extends BaseCustomException { }
