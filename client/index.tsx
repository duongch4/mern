import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    withRouter as _withRouter,
} from "react-router-dom";

import { ScrollToTop } from "./components/utils/ScrollToTop";
import { MainRoutes } from "./pages/MainRoutes";
import store from "./redux/store";

const rootElem = document.getElementById("root");
let render = () => {
    ReactDOM.render(
        <Provider store={store}>
            <Router>
                <ScrollToTop>
                    <Switch>
                        <Route path={"/"} component={MainRoutes} />
                    </Switch>
                </ScrollToTop>
            </Router>
        </Provider>
        ,
        rootElem
    );
};

if (module.hot) {
    const renderApp = render;
    const renderErr = (err: Error) => {
        const RedBox = require("redbox-react").default;
        ReactDOM.render(
            <RedBox error={err} />,
            rootElem
        );
    };
    render = () => {
        try {
            renderApp();
        }
        catch (error) {
            const log = require("./utils/Log").default;
            log.error(error);
            renderErr(error);
        }
    };

    module.hot.accept("./pages/MainRoutes", () => render());
}

render();
