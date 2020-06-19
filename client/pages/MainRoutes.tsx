import React from "react";

import { useUserCheck } from "../contexts/UserContext";
import { FullPageSpinner } from "./spinner/SpinnerPage";

const AuthenticatedRoutes = React.lazy(() => import("./AuthenticatedRoutes"));
const UnauthenticatedRoutes = React.lazy(() => import("./UnauthenticatedRoutes"));

export const MainRoutes = () => {
    const user = useUserCheck()?.state;
    return (
        <React.Suspense fallback={<FullPageSpinner />}>
            {user ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
        </React.Suspense>
    );
};
