import React from "react";
import { AjaxHandlerAxios } from "../utils/AjaxHandler";
import { TResponse } from "../communication/TResponse";
import { UserPayload } from "../models/User";
import { FullPageSpinner } from "../pages/spinner/SpinnerPage";

import { useAsync, AsyncState, AsyncStatusType } from "../hooks/hooks";

// import Log from "../utils/Log";

type AuthContextValue = {
    state: AsyncState<UserPayload>;
    dispatchData: (data: UserPayload) => void;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

// type AuthFormData = {
//     email: string;
//     password: string;
// };

export const AuthProvider = (props: any) => {
    const { state, run, dispatchData } = useAsync<UserPayload>();

    React.useEffect(() => {
        const getUser = () => AjaxHandlerAxios.getRequest("/api/login/check").then(
            (res: TResponse<UserPayload>) => res.payload,
            (err: any) => err
        );
        run(getUser());
    }, [run]);

    // TODO: Add ErrorFallBackPage
    return (
        <AuthContext.Provider value={{ state, dispatchData }}>
            {state.status === AsyncStatusType.LOADING && <FullPageSpinner />}
            {state.status === AsyncStatusType.FAILURE && <div>Error...</div>}
            {state.status === AsyncStatusType.SUCCESS && props.children}
            {state.status === AsyncStatusType.EMPTY && props.children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const contextValue = React.useContext(AuthContext);
    if (typeof contextValue === "undefined") {
        throw new Error("AuthContextValue is 'undefined' => Must Be Set!");
    }
    // const isError = contextValue.state.status === AsyncStatusType.FAILURE;
    // const isSuccess = contextValue.state.status === AsyncStatusType.SUCCESS;
    // const isAuthenticated = contextValue.state.status === AsyncStatusType.SUCCESS && contextValue.state.data;
    // return { ...contextValue, isError, isSuccess, isAuthenticated };
    return contextValue;
};
