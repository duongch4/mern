import React from "react";
import { useAuth } from "./AuthContext";
import { UserPayload } from "../models/User";

const UserContext = React.createContext<UserPayload|undefined>(undefined);

export const UserProvider = (props: any) => <UserContext.Provider value={useAuth().data?.payload} {...props} />;

export const useUser = () => React.useContext(UserContext);
