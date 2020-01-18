import React, { Component, Fragment, ChangeEvent, FormEvent } from "react";
import { connect } from "react-redux";
import { addNote } from "./actions"; // used only in mapDispatchToProps
import { Dispatch, bindActionCreators, AnyAction } from "redux";
import { ReduxStates } from "../../redux/reducers";

type OwnProps = {
    propFromParent?: number;
};

type DispatchProps = {
    addNote: (title: string, content: string) => void;
};

type NotesFormProps = OwnProps & DispatchProps;

export type NotesFormStates = {
    title: string;
    content: string;
};

class NotesForm extends Component<NotesFormProps, NotesFormStates> {
    readonly state: Readonly<NotesFormStates> = {
        title: "",
        content: ""
    };

    handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        this.setState({
            [e.target.name]: e.target.value
        } as Pick<NotesFormStates, any>);
    }

    handleSubmission = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { title, content } = this.state;
        this.props.addNote(title, content); // addNote here is a component's prop injected by mapDispatchToProps

        this.setState({
            title: "",
            content: ""
        });
    }

    render() {
        return (
            <Fragment>
                <h3>Add a Note</h3>

                <form onSubmit={this.handleSubmission}>
                    Title: <br />
                    <input type="text" name="title" value={this.state.title} onChange={this.handleChange} /><br />

                    Content: <br />
                    <textarea name="content" value={this.state.content} onChange={this.handleChange}></textarea><br />

                    <button type="submit">Add Note</button>
                </form>
            </Fragment>
        )
    }
}

const mapStateToProps = undefined; // dont care about the redux store state, component will not subscribe to store

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => { // inject ActionCreator "addNote" to the component's props
    return bindActionCreators({ addNote }, dispatch);
};

export default connect<{}, DispatchProps, OwnProps, ReduxStates>(mapStateToProps, mapDispatchToProps)(NotesForm);
