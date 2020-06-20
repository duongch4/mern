import React from "react";

import { useAuth } from "./AuthContext";
import { UserPayload } from "../models/User";
import { AsyncStatusType } from "../hooks/hooks";

type UserContextValue = {
    state: UserPayload;
    setState: React.Dispatch<React.SetStateAction<UserPayload>>;
};

const UserContext = React.createContext<UserContextValue|undefined>(undefined);

export const UserProvider = (props: any) => {
    const authContextValue = useAuth();
    const user = authContextValue.state.status === AsyncStatusType.SUCCESS ? authContextValue.state.data.data.payload : undefined;
    const [_state, setState] = React.useState(user as UserPayload);
    return <UserContext.Provider value={{ state: user, setState }} {...props} />;
};

export const useUserAuthenticated = () => {
    const contextValue = React.useContext(UserContext);
    if (typeof contextValue?.state === "undefined") {
        throw new Error("User is 'undefined' => User Should ALREADY Be Authenticated!");
    }
    return contextValue;
};

export const useUserCheck = () => React.useContext(UserContext);
