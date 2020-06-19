import React from "react";
import { AxiosResponse } from "axios";
import { AjaxHandlerAxios } from "../utils/AjaxHandler";
import Log from "../utils/Log";
import { TResponse } from "../communication/TResponse";

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
    | { status: AuthStatusType.SUCCESS; data: TResponse };

type AuthContextValue = {
    state: AuthState;
    setState: React.Dispatch<React.SetStateAction<AuthState>>;
};

const initialState: AuthState = {
    status: AuthStatusType.EMPTY
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = (props: any) => {
    const [state, setState] = React.useState<AuthState>(initialState);
    const url = "/api/account";

    const fetchUserData = () => {
        AjaxHandlerAxios.getRequest(
            url
        ).then((response: AxiosResponse) =>
            setState({
                status: AuthStatusType.SUCCESS,
                data: response.data
            })
        ).catch((err) => {
            Log.error(err);
            setState({
                status: AuthStatusType.FAILURE,
                error: err
            });
        }
        );
    };

    React.useEffect(fetchUserData, []);

    return (
        <AuthContext.Provider value={{ state, setState }}>
            {/* {state.status === AuthStatusType.LOADING && <div>Loading...</div>}
            {state.status === AuthStatusType.FAILURE && <div>Error...</div>}
            {state.status === AuthStatusType.SUCCESS && props.children} */}
            {props.children}
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
    const isAuthenticated = contextValue.state.status === AuthStatusType.SUCCESS && contextValue.state.data;
    return { ...contextValue, isError, isSuccess, isAuthenticated };
};
