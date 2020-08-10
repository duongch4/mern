export type TResponse<TPayload> = {
    status: string;
    code: number;
    payload?: TPayload;
    message: string;
    extra?: {
        [key: string]: any;
    };
};

export const getResponse200 = <TPayload>(payload: TPayload, message: string, extra?: { [key: string]: any }): TResponse<TPayload> => ({
    status: "OK",
    code: 200,
    payload: payload,
    message: message,
    extra: extra
});
