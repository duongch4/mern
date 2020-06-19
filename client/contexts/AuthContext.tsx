import React from "react";
import { AxiosResponse } from "axios";
import { AjaxHandlerAxios } from "../utils/AjaxHandler";
import Log from "../utils/Log";
import { TResponse } from "../communication/TResponse";

type AuthState = {
    isLoading: boolean;
    error?: any;
    data?: TResponse;
};

type AuthContextValue = {
    state: AuthState;
    setState: React.Dispatch<React.SetStateAction<AuthState>>;
};

const initialState: AuthState = {
    isLoading: true,
    error: undefined,
    data: undefined
};

const AuthContext = React.createContext<AuthContextValue|undefined>(undefined);

export const AuthProvider = (props: any) => {
    const [state, setState] = React.useState(initialState);
    const url = "/api/account";

    const fetchUserData = () => {
        AjaxHandlerAxios.getRequest(
            url
        ).then((response: AxiosResponse) =>
            setState({
                isLoading: false,
                error: undefined,
                data: response.data
            })
        ).catch((err) => {
            Log.error(err);
            setState({
                isLoading: false,
                error: err,
                data: undefined
            });
        }
        );
    };

    React.useEffect(fetchUserData, []);

    return (
        <AuthContext.Provider value={{state, setState}}>
            {props.children}
            {/* {
                state.isLoading === "loading" ? (
                    <div>Loading...</div>
                ) : state.isLoading === "error" ? (
                    <div>Error</div>
                ) : {...props}
            } */}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const contextValue = React.useContext(AuthContext);
    if (typeof contextValue === "undefined") {
        throw new Error("AuthContext value is 'undefined' => Must Be Set!");
    }
    const isError = typeof contextValue.state.error !== "undefined" && contextValue.state.isLoading;
    const isSuccess = typeof contextValue.state.data !== "undefined" && contextValue.state.isLoading;
    const isAuthenticated = contextValue.state.data && !contextValue.state.isLoading;
    return { ...contextValue, isError, isSuccess, isAuthenticated };
};
