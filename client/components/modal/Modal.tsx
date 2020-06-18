import React from "react";
import { useModal } from "../../context/ModalContext";

export type ModalProps = {
    id: string;
    title?: string;
    body?: React.ReactElement;
    closeTitle?: string;
};

export const Modal = (props: ModalProps) => {
    const { state, setState } = useModal();

    const toggle = () => setState({ isOpen: !state.isOpen });

    const listenKeyboard = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Escape" || event.keyCode === 27) {
            toggle();
        }
    };

    const onDialogClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
    };

    const renderModalHead = (): React.ReactElement => {
        return (
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">{props.title}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                    onClick={toggle}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        );
    };

    const renderModalFoot = (): React.ReactElement => {
        return (
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal"
                    onClick={toggle}
                >
                    {props.closeTitle}
                </button>
            </div>
        );
    };

    return (
        <div
            className="modal fade"
            id={props.id} tabIndex={-1} role="dialog"
            aria-labelledby="exampleModalLabel" aria-hidden="true"
            onClick={toggle}
            onKeyDown={listenKeyboard}
        >
            <div className="modal-dialog modal-dialog-centered" role="document"
                onClick={onDialogClick}
            >
                <div className="modal-content">
                    {renderModalHead()}
                    <div className="modal-body">{props.body}</div>
                    {renderModalFoot()}
                </div>
            </div>
        </div>
    );
};
