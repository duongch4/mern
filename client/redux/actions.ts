export enum EReduxActionType {
    ADD_NOTE = "ADD_NOTE",
    DEL_NOTE = "DEL_NOTE",
    SHOW_ALL = "SHOW_ALL"
}

export type ReduxBaseAction = {
    type: EReduxActionType;
};
