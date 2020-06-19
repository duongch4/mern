import React from "react";

import { useAuth } from "./AuthContext";
import { UserPayload } from "../models/User";

type UserContextValue = {
    state: UserPayload;
    setState: React.Dispatch<React.SetStateAction<UserPayload>>;
};

const UserContext = React.createContext<UserContextValue|undefined>(undefined);

export const UserProvider = (props: any) => {
    const authContextValue = useAuth();
    const user = authContextValue.state.data?.payload as UserPayload;
    const [_state, setState] = React.useState(user);
    return <UserContext.Provider value={{ state: authContextValue.state.data?.payload, setState }} {...props} />;
};

export const useUserAuthenticated = () => {
    const contextValue = React.useContext(UserContext);
    if (typeof contextValue?.state === "undefined") {
        throw new Error("User is 'undefined' => User Should ALREADY Be Authenticated!");
    }
    return contextValue;
};

export const useUserCheck = () => React.useContext(UserContext);
