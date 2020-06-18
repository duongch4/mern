import React from "react";
import { AxiosResponse } from "axios";
import { AjaxHandlerAxios } from "../utils/AjaxHandler";
import Log from "../utils/Log";
import { TResponse } from "../communication/TResponse";

type AuthState = {
    status: string;
    error: any;
    data: TResponse|undefined;
};

const initialState: AuthState = {
    status: "loading",
    error: undefined,
    data: undefined
};

const AuthContext = React.createContext<AuthState|undefined>(undefined);

export const AuthProvider = (props: any) => {
    const [state, setState] = React.useState(initialState);

    const sideEffect = () => {
        AjaxHandlerAxios.getRequest(
            "/api/account"
        ).then((response: AxiosResponse) =>
            setState({
                status: "success",
                error: undefined,
                data: response.data
            })
        ).catch((err) => {
            Log.error(err);
            setState({
                status: "error",
                error: err,
                data: undefined
            });
        }
        );
    };

    React.useEffect(sideEffect, []);

    return (
        <AuthContext.Provider value={state}>
            {props.children}
            {/* {
                state.status === "loading" ? (
                    <div>Loading...</div>
                ) : state.status === "error" ? (
                    <div>Error</div>
                ) : {...props}
            } */}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const state = React.useContext(AuthContext);
    if (typeof state === "undefined") {
        throw new Error("AuthContext value is 'undefined' => Must Be Set!");
    }
    const isLoading = state.status === "loading";
    const isError = state.status === "error";
    const isSuccess = state.status === "success";
    const isAuthenticated = state.data && isSuccess;
    return { ...state, isLoading, isError, isSuccess, isAuthenticated };
};
