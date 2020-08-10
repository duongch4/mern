import React from "react";
import {
    Route,
    Switch,
    Redirect as _,
} from "react-router-dom";

import { Header, AuthenticatedCorner } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";

import { HomePage } from "./home/HomePage";
import { UserPage } from "./user/UserPage";
import { EmailVerificationPage } from "./user/EmailVerificationPage";
import { StatusPage } from "./status/StatusPage";
import { NotFoundPage } from "./notfound/NotFoundPage";

const AuthenticatedRoutes = () => (
    <div id="main-routes">
        <Header TopRightCorner={AuthenticatedCorner} />
        <Switch>
            <Route exact path={`/`} component={HomePage} />
            <Route exact path={`/users/:id`} component={UserPage} />
            <Route exact path={`/users/:id/verification`} component={EmailVerificationPage} />
            <Route path={`/status`} component={StatusPage} />
            <Route component={NotFoundPage} />
        </Switch>
        <Footer />
    </div>
);

export default AuthenticatedRoutes;
