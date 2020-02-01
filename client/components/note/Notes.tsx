import React, { Component, Fragment } from "react";
import NotesForm from "./NotesForm";
import AllNotes from "./AllNotes";

export class Notes extends Component {
    public render() {
        return (
            <Fragment>
                <h1>React Redux Notes App</h1>

                <NotesForm />
                <hr />
                <AllNotes />
            </Fragment>
        );
    }
}
