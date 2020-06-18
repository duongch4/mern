import { EReduxActionType } from "../../redux/actions";
import { AddNoteAction, DelNoteAction, ShowAllAction } from "./actions";
import { NotesFormStates } from "./NotesForm";

type NoteAction = AddNoteAction | DelNoteAction | ShowAllAction;

type NoteStates = {
    notes: NotesFormStates[];
    vis: string;
};

const initState: NoteStates = {
    notes: [
        { title: "T1", content: "C1" },
        { title: "T2", content: "C2" },
        { title: "T3", content: "C3" }
    ],
    vis: "AWESOME_TAG"
};

export const notesReducer = (state: NoteStates = initState, action: NoteAction) => {
    switch (action.type) {
        case EReduxActionType.ADD_NOTE:
            return {
                ...state,
                notes: [
                    ...state.notes,
                    {
                        title: action.title,
                        content: action.content
                    }
                ]
            };
        case EReduxActionType.DEL_NOTE:
            return {
                ...state,
                notes: state.notes.filter((_, index) => {
                    // console.log(note);
                    return (index !== action.id);
                })
            };
        case EReduxActionType.SHOW_ALL:
            return {
                ...state,
                vis: "BLEH"
            };
        default:
            return state;
    }
};
