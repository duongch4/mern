import { createStore, applyMiddleware } from "redux";
import { load, save } from "redux-localstorage-simple";
import reduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import rootReducer from "./reducers";

// For IE11 testing bundling and not in watch-mode: has to be here!!! cannot be in "index.tsx"
if (!localStorage) {
    location.href = location.protocol + "//127.0.0.1" + location.pathname.replace(/(^..)(:)/, "$1$$");
}

// Only Logging debug info to console in dev mode
if (process.env.NODE_ENV !== "production" && typeof Storage !== "undefined") {
    localStorage.setItem("debug", "client:*");
}
else if (process.env.NODE_ENV !== "production" && typeof Storage === "undefined") {
    alert("Sorry, your browser does not support Web Storage...");
}

const middlewares = (process.env.NODE_ENV !== "production") ?
    [reduxThunk, require("redux-immutable-state-invariant").default(), require("redux-logger").default] :
    [reduxThunk];

const store = createStore(
    rootReducer,
    load(), // load from current saved redux-state in local storage
    // composeWithDevTools(applyMiddleware(...middlewares))
    composeWithDevTools(applyMiddleware(...middlewares, save()))
);

if (module.hot) {
    module.hot.accept("./reducers", () => {
        const newRootReducer = require("./reducers").default;
        store.replaceReducer(newRootReducer);
    });
}

export default store;
