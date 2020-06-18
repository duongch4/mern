import React from "react";
import { useModal } from "../../context/ModalContext";

export type ModalProps = {
    id: string;
    titles: string[];
    bodies: React.ReactElement[];
    closeTitle: string;
};

export const Modal = (props: ModalProps) => {
    const { state, setState } = useModal();

    const toggle = () => setState({ isOpen: !state.isOpen });

    const listenKeyboard = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Escape" || event.keyCode === 27) {
            toggle();
        }
    };

    const onDialogClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => event.stopPropagation();

    const renderModalTabsHeads = (): React.ReactElement[] => {
        const result: React.ReactElement[] = [];
        let count = 0;
        for (const title of props.titles) {
            result.push(
                <li className={count === 0 ? "active" : undefined}>
                    <a data-toggle="pill" href={`#tab-${count}`}>
                        <h5 className="modal-title btn">{title}</h5>
                    </a>
                </li>
            );
            count++;
        }
        return result;
    };

    const renderModalHead = (): React.ReactElement => (
        <div className="modal-header">
            <ul className="nav nav-pills">{renderModalTabsHeads()}</ul>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={toggle}>
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    );

    const renderModalFoot = (): React.ReactElement => (
        <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={toggle}>
                {props.closeTitle}
            </button>
        </div>
    );

    const renderModalBodies = (): React.ReactElement[] => {
        const result: React.ReactElement[] = [];
        let count = 0;
        for (const body of props.bodies) {
            result.push(
                <div id={`tab-${count}`} className={`tab-pane fade in ${count === 0 ? "active show" : undefined}`}>{body}</div>
            );
            count++;
        }
        return result;
    };

    return (
        <div
            className="modal fade"
            id={props.id} tabIndex={-1} role="dialog"
            aria-labelledby="exampleModalLabel" aria-hidden="true"
            onClick={toggle} onKeyDown={listenKeyboard}
        >
            <div className="modal-dialog modal-dialog-centered" role="document" onClick={onDialogClick}>
                <div className="modal-content">
                    {renderModalHead()}
                    <div className="modal-body"><div className="tab-content">{renderModalBodies()}</div></div>
                    {renderModalFoot()}
                </div>
            </div>
        </div>
    );
};
