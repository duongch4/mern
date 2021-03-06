export type TResponse<TPayload> = {
    status: string;
    code: number;
    payload?: TPayload;
    message: string;
    extra?: {
        [key: string]: any;
    };
};
