import React from "react";
import {
    // Route,
    // Switch,
    Redirect as _,
    // Link
} from "react-router-dom";

// import { AxiosResponse } from "axios";

// import { Header } from "../components/header/Header";
import { Header, renderLoggedIn } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";

// import { AjaxHandlerAxios } from "../utils/AjaxHandler";
// import { PropsRoute, PrivateRoute } from "../utils/CustomRoute";

// import { HomePage } from "./home/HomePage";
// import { AccountPage } from "./account/AccountPage";
// import { StatusPage } from "./status/StatusPage";
// import { NotFoundPage } from "./notfound/NotFoundPage";

// import { UserPayload } from "../models/User";
// import { useGetRequest } from "../hooks/hooks";

// import Log from "../utils/Log";
// import { AuthProvider } from "../context/AuthContext";
// import { useUser } from "../context/UserContext";

const AuthenticatedRoutes = () => (
    <div id="main-routes">
        <Header renderTopRightCorner={renderLoggedIn} />
        <div className="container-main">Authenticated</div>
        {/* <Switch>

            <Route exact path={`/`} component={AccountPage} />

            <PropsRoute exact path={`/`} component={HomePage} currUser={currUser} />
            <PrivateRoute
                isLoggedIn={currUser} redirectTo={`/`}
                path={`/account`} component={AccountPage} currUser={currUser}
            />
            <Route path={`/status`} component={StatusPage} />
            <Route component={NotFoundPage} />
        </Switch> */}
        <Footer />
    </div>
);

export default AuthenticatedRoutes;
