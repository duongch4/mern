import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { delNote } from "./actions";
import { ReduxStates } from "../../redux/reducers";
import { Dispatch, AnyAction, bindActionCreators } from "redux";
import { NotesFormStates } from "./NotesForm";

type OwnProps = {
    propFromParent?: number;
};

type StateProps = {
    notes: NotesFormStates[];
};

type DispatchProps = {
    delNote: (id: number) => void;
};

type AllNotesProps = OwnProps & StateProps & DispatchProps;

class AllNotes extends Component<AllNotesProps, any> {
    render() {
        const notesItems = this.props.notes.map((note: NotesFormStates, index: number) => {
            return (
                <li key={index}>
                    <b>{note.title}</b>
                    <button onClick={() => this.props.delNote(index)}>x</button>
                    <br />
                    <span>{note.content}</span>
                </li>
            );
        });
        return (
            <Fragment>
                <h3>All Notes</h3>

                <ul>
                    {notesItems}
                </ul>
            </Fragment>
        );
    }
}

const mapStateToProps = (state: ReduxStates, _: OwnProps): StateProps => {
    return {
        notes: state.reducerNotes.notes
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>, _: OwnProps): DispatchProps => {
    return bindActionCreators({ delNote }, dispatch);
};

export default connect<StateProps, DispatchProps, OwnProps, ReduxStates>(mapStateToProps, mapDispatchToProps)(AllNotes);
