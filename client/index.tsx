import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import { ScrollToTop } from "./components/utils/ScrollToTop";
import { MainRoutes } from "./pages/MainRoutes";
import store from "./redux/store";
import { ContextProviders } from "./contexts/context";

import { Footer } from "./components/footer/Footer";

import { disableConsoleWindowIfNotSupported } from "./utils/NoConsoleSupport";
import { loadServiceWorker } from "./serviceworker/LoadingServiceWorker";

disableConsoleWindowIfNotSupported();
loadServiceWorker();

const rootElem = document.getElementById("root");
let render = () => {
    ReactDOM.render(
        <Provider store={store}>
            <Router>
                <ScrollToTop />
                <ContextProviders>
                    <MainRoutes />
                </ContextProviders>
                <Footer />
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

    module.hot.accept("./index", () => render());
    // module.hot.accept("./pages/MainRoutes", () => render());
}

render();
