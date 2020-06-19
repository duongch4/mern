import React from "react";
import { AxiosResponse } from "axios";
import { AjaxHandlerAxios } from "../utils/AjaxHandler";
import { TResponse } from "../communication/TResponse";
import { UserPayload } from "../models/User";
import { FullPageSpinner } from "../pages/spinner/SpinnerPage";

import Log from "../utils/Log";

export enum AuthStatusType {
    EMPTY = "EMPTY",
    LOADING = "LOADING",
    FAILURE = "FAILURE",
    SUCCESS = "SUCCESS"
}

type AuthState =
    | { status: AuthStatusType.EMPTY }
    | { status: AuthStatusType.LOADING }
    | { status: AuthStatusType.FAILURE; error: any }
    | { status: AuthStatusType.SUCCESS; data: TResponse<UserPayload> };

export enum AuthActionType {
    REQUEST = "REQUEST",
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE"
}

type AuthAction =
    | { type: AuthActionType.REQUEST }
    | { type: AuthActionType.FAILURE; error: any }
    | { type: AuthActionType.SUCCESS; data: TResponse<UserPayload> };

const reducer = (_state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case AuthActionType.REQUEST: return { status: AuthStatusType.LOADING };
        case AuthActionType.FAILURE: return { status: AuthStatusType.FAILURE, error: action.error };
        case AuthActionType.SUCCESS: return { status: AuthStatusType.SUCCESS, data: action.data };
    }
};

type AuthContextValue = {
    state: AuthState;
    dispatch: React.Dispatch<AuthAction>;
};

const initialState: AuthState = {
    status: AuthStatusType.EMPTY
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = (props: any) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    const url = "/api/login/check";
    const fetchUserData = () => {
        AjaxHandlerAxios.getRequest(
            url
        ).then((response: AxiosResponse) =>
            dispatch({
                type: AuthActionType.SUCCESS,
                data: response.data
            })
        ).catch((err) => {
            Log.error(err);
            dispatch({
                type: AuthActionType.FAILURE,
                error: err
            });
        });
    };

    React.useEffect(fetchUserData, []);

    // TODO: Add ErrorFallBackPage
    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {state.status === AuthStatusType.LOADING && <FullPageSpinner />}
            {state.status === AuthStatusType.FAILURE && <div>Error...</div>}
            {state.status === AuthStatusType.SUCCESS && props.children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const contextValue = React.useContext(AuthContext);
    if (typeof contextValue === "undefined") {
        throw new Error("AuthContext value is 'undefined' => Must Be Set!");
    }
    const isError = contextValue.state.status === AuthStatusType.FAILURE;
    const isSuccess = contextValue.state.status === AuthStatusType.SUCCESS;
    const isAuthenticated = contextValue.state.status === AuthStatusType.SUCCESS && contextValue.state.data.payload;
    return { ...contextValue, isError, isSuccess, isAuthenticated };
};
