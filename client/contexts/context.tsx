import React from "react";
import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";

export const ContextProviders = ({ children }: { children: any }) => (
    <AuthProvider>
        <UserProvider>
            {children}
        </UserProvider>
    </AuthProvider>
);
