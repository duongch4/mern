import React from "react";
import {
    // Route,
    // Switch,
    Redirect as _,
} from "react-router-dom";

// import { AxiosResponse } from "axios";

import { ModalProvider } from "../context/ModalContext";

// import { Header } from "../components/header/Header";
import { HeaderTest, renderNotLoggedIn } from "../components/header/HeaderTest";
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

const UnauthenticatedRoutes = () => {
    return (
        <ModalProvider>
            <div id="main-routes">
                <HeaderTest renderTopRightCorner={renderNotLoggedIn} />
                <div className="container-main">NOT Authenticated: 401</div>
                <Footer />
            </div>
        </ModalProvider>
    );
};

export default UnauthenticatedRoutes;
