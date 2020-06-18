import React, { Fragment } from "react";
import NotesForm from "./NotesForm";
import AllNotes from "./AllNotes";

export const Notes = () => (
    <Fragment>
        <h1>React Redux Notes App</h1>

        <NotesForm />
        <hr />
        <AllNotes />
    </Fragment>
);
