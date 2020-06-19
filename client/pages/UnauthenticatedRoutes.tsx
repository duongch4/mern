import React from "react";
import {
    Route,
    Switch,
    Redirect as _,
} from "react-router-dom";

import { ModalProvider } from "../contexts/ModalContext";

import { Header, renderNotLoggedIn } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";

import { UnauthenticatedHomePage } from "./home/UnauthenticatedHomePage";
import { StatusPage } from "./status/StatusPage";
import { NotFoundPage } from "./notfound/NotFoundPage";

const UnauthenticatedRoutes = () => (
    <ModalProvider>
        <div id="main-routes">
            <Header renderTopRightCorner={renderNotLoggedIn} />
            <div className="container-main">NOT Authenticated: 401</div>
            <Switch>
                <Route exact path={`/`} component={UnauthenticatedHomePage} />
                <Route path={`/status`} component={StatusPage} />
                <Route component={NotFoundPage} />
            </Switch>
            <Footer />
        </div>
    </ModalProvider>
);

export default UnauthenticatedRoutes;
