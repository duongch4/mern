import React from "react";

import { useAuth } from "./AuthContext";
import { UserPayload } from "../models/User";
import { AsyncStatusType } from "../hooks/hooks";

type UserContextValue = {
    user: UserPayload | undefined;
    setUser: (data: UserPayload) => void;
};

const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export const UserProvider = (props: any) => {
    const { state, dispatchData } = useAuth();
    const user = state.status === AsyncStatusType.SUCCESS ? state.data : undefined;
    return (
        <UserContext.Provider value={{ user, setUser: dispatchData }}>
            {props.children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const contextValue = React.useContext(UserContext);
    if (typeof contextValue === "undefined") {
        throw new Error("UserContextValue is 'undefined' => Must Be Set!");
    }
    return contextValue;
};

export const useUserAuthenticated = () => {
    const { user, setUser } = useUser();
    if (typeof user === "undefined") {
        throw new Error("User is 'undefined' => User Should ALREADY Be Authenticated!");
    }
    return { user, setUser };
};

