import React from "react";
import {
    Route,
    Switch,
    Redirect as _,
} from "react-router-dom";

import { ModalProvider } from "../contexts/ModalContext";

import { Header, UnauthenticatedCorner } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";

import { UnauthenticatedHomePage } from "./home/UnauthenticatedHomePage";
import { StatusPage } from "./status/StatusPage";
import { NotFoundPage } from "./notfound/NotFoundPage";

const UnauthenticatedRoutes = () => (
    <ModalProvider>
        <div id="main-routes">
            <Header TopRightCorner={UnauthenticatedCorner} />
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
