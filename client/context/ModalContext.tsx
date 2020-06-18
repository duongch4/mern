import React, { Dispatch, SetStateAction } from "react";

type State = {
    isOpen: boolean;
};

type ContextValue = {
    state: State;
    setState: Dispatch<SetStateAction<State>>;
};

const initialState: State = { isOpen: false };
const ModalContext = React.createContext<ContextValue|undefined>(undefined);

export const ModalProvider = (props: any) => {
    const [state, setState] = React.useState(initialState);
    return <ModalContext.Provider value={{ state, setState }} {...props} />;
};

export const useModal = (): ContextValue => {
    const contextValue = React.useContext(ModalContext);
    if (typeof contextValue === "undefined") {
        throw new Error("Context Value is 'undefined' => Must Be Set!");
    }
    return contextValue;
};

