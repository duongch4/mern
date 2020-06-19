import React from "react";

import { useUserCheck } from "../contexts/UserContext";
import { StatusPage } from "./status/StatusPage";

import Log from "../utils/Log";

const AuthenticatedRoutes = React.lazy(() => import("./AuthenticatedRoutes"));
const UnauthenticatedRoutes = React.lazy(() => import("./UnauthenticatedRoutes"));

export const MainRoutes = () => {
    const user = useUserCheck()?.state;
    Log.info("In MainRoutes");
    Log.info(user);

    // TODO: FALL BACK to LOADING/SPINNER
    return (
        <React.Suspense fallback={<StatusPage />}>
            {user ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
        </React.Suspense>
    );
};
