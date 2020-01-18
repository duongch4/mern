import { notesReducer } from "../components/note/reducer";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
    reducerNotes: notesReducer
});

export type ReduxStates = ReturnType<typeof rootReducer>;
