import React from "react";
import {
    Route,
    Switch,
    Redirect as _,
} from "react-router-dom";

import { Header, renderLoggedIn } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";

import { HomePage } from "./home/HomePage";
import { AccountPage } from "./account/AccountPage";
import { StatusPage } from "./status/StatusPage";
import { NotFoundPage } from "./notfound/NotFoundPage";

const AuthenticatedRoutes = () => (
    <div id="main-routes">
        <Header renderTopRightCorner={renderLoggedIn} />
        <div className="container-main">Authenticated</div>
        <Switch>
            <Route exact path={`/`} component={HomePage} />
            <Route exact path={`/account`} component={AccountPage} />
            <Route path={`/status`} component={StatusPage} />
            <Route component={NotFoundPage} />
        </Switch>
        <Footer />
    </div>
);

export default AuthenticatedRoutes;
