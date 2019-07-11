import * as React from "react";
import * as ReactDOM from "react-dom";

import {
    BrowserRouter as Router,
    Route,
    Switch,
    withRouter,
} from "react-router-dom";

import { ScrollToTop } from "./components/ScrollToTop";
import { MainRoutes } from "./pages/MainRoutes";

ReactDOM.render(
    <Router>
        <ScrollToTop>
            <Switch>
                <Route path="/" component={MainRoutes} />
            </Switch>
        </ScrollToTop>
    </Router>
    ,
    document.getElementById("root"),
);
