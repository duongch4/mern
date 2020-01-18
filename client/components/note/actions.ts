import { EReduxActionType, ReduxBaseAction } from "../../redux/actions"

export type AddNoteAction = {
    type: EReduxActionType.ADD_NOTE;
    title: string;
    content: string;
} & ReduxBaseAction;

export function addNote(title: string, content: string): AddNoteAction {
    return {
        type: EReduxActionType.ADD_NOTE,
        title: title,
        content: content
    };
}

export type DelNoteAction = {
    type: EReduxActionType.DEL_NOTE;
    id: number;
} & ReduxBaseAction;

export function delNote(id: number): DelNoteAction {
    return {
        type: EReduxActionType.DEL_NOTE,
        id: id
    };
}

export type ShowAllAction = {
    type: EReduxActionType.SHOW_ALL;
} & ReduxBaseAction;

export function showAll(): ShowAllAction {
    return { type: EReduxActionType.SHOW_ALL };
}
