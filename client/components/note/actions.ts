import { EReduxActionType, ReduxBaseAction } from "../../redux/actions";

export type AddNoteAction = {
    type: EReduxActionType.ADD_NOTE;
    title: string;
    content: string;
} & ReduxBaseAction;

export const addNote = (title: string, content: string): AddNoteAction => (
    {
        type: EReduxActionType.ADD_NOTE,
        title: title,
        content: content
    }
);

export type DelNoteAction = {
    type: EReduxActionType.DEL_NOTE;
    id: number;
} & ReduxBaseAction;

export const delNote = (id: number): DelNoteAction => (
    {
        type: EReduxActionType.DEL_NOTE,
        id: id
    }
);

export type ShowAllAction = {
    type: EReduxActionType.SHOW_ALL;
} & ReduxBaseAction;

export const showAll = (): ShowAllAction => (
    { type: EReduxActionType.SHOW_ALL }
);
