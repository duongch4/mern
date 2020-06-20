import React from "react";
import { AxiosResponse } from "axios";
import { AjaxHandlerAxios } from "../utils/AjaxHandler";
import { TResponse } from "../communication/TResponse";
import { UserPayload } from "../models/User";
import { FullPageSpinner } from "../pages/spinner/SpinnerPage";

import { useAsync, AsyncState, AsyncStatusType } from "../hooks/hooks";

// import Log from "../utils/Log";

type AuthContextValue = {
    state: AsyncState<AxiosResponse<TResponse<UserPayload>>>;
    dispatchData: (data: AxiosResponse<TResponse<UserPayload>>) => void;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

// type AuthFormData = {
//     email: string;
//     password: string;
// };

export const AuthProvider = (props: any) => {
    const { state, run, dispatchData } = useAsync<AxiosResponse<TResponse<UserPayload>>>();

    const url = "/api/login/check";

    const fetchUserData = () => {
        run(AjaxHandlerAxios.getRequest(url));
    };

    React.useEffect(fetchUserData, [run]);

    // TODO: Add ErrorFallBackPage
    return (
        <AuthContext.Provider value={{ state, dispatchData }}>
            {state.status === AsyncStatusType.LOADING && <FullPageSpinner />}
            {state.status === AsyncStatusType.FAILURE && <div>Error...</div>}
            {state.status === AsyncStatusType.SUCCESS && props.children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const contextValue = React.useContext(AuthContext);
    if (typeof contextValue === "undefined") {
        throw new Error("AuthContext value is 'undefined' => Must Be Set!");
    }
    const isError = contextValue.state.status === AsyncStatusType.FAILURE;
    const isSuccess = contextValue.state.status === AsyncStatusType.SUCCESS;
    const isAuthenticated = contextValue.state.status === AsyncStatusType.SUCCESS && contextValue.state.data.data.payload;
    return { ...contextValue, isError, isSuccess, isAuthenticated };
};
