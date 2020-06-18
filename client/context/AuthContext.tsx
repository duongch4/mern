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

type AuthContextValue = {
    state: AuthState;
    setState: React.Dispatch<React.SetStateAction<AuthState>>;
};

const initialState: AuthState = {
    status: "loading",
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

    React.useEffect(fetchUserData, []);

    return (
        <AuthContext.Provider value={{state, setState}}>
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
    const contextValue = React.useContext(AuthContext);
    if (typeof contextValue === "undefined") {
        throw new Error("AuthContext value is 'undefined' => Must Be Set!");
    }
    const isLoading = contextValue.state.status === "loading";
    const isError = contextValue.state.status === "error";
    const isSuccess = contextValue.state.status === "success";
    const isAuthenticated = contextValue.state.data && isSuccess;
    return { ...contextValue, isLoading, isError, isSuccess, isAuthenticated };
};
