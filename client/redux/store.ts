import { createStore } from "redux";
import { rootReducer, ReduxStates } from "./reducers";

const initState: ReduxStates = {
    reducerNotes: {
        notes:[
            { title: "T1", content: "C1" },
            { title: "T2", content: "C2" },
            { title: "T3", content: "C3" }
        ],
        vis: "AWESOME_TAG"
    }
};

export const store = createStore(
    rootReducer,
    initState, // or undefined if dont want initState
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
