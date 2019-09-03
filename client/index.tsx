import React from "react";
import ReactDOM from "react-dom";

import {
    BrowserRouter as Router,
    Route,
    Switch,
    withRouter,
} from "react-router-dom";

import { ScrollToTop } from "./components/utils/ScrollToTop";
import { MainRoutes } from "./pages/MainRoutes";

ReactDOM.render(
    <Router>
        <ScrollToTop>
            <Switch>
                <Route path={"/"} component={MainRoutes} />
            </Switch>
        </ScrollToTop>
    </Router>
    ,
    document.getElementById("root"),
);
