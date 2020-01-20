import { createStore, applyMiddleware } from "redux";
import { load, save } from "redux-localstorage-simple";
import reduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import rootReducer from "./reducers";

const middlewares = (process.env.NODE_ENV !== "production") ?
    [reduxThunk, require("redux-immutable-state-invariant").default(), require("redux-logger").default] :
    [reduxThunk];

const store = createStore(
    rootReducer,
    load(), // load from current saved redux-state in local storage
    composeWithDevTools(applyMiddleware(...middlewares, save()))
);

if (module.hot) {
    module.hot.accept("./reducers", () => {
        const newRootReducer = require("./reducers").default;
        store.replaceReducer(newRootReducer);
    });
}

export default store;
