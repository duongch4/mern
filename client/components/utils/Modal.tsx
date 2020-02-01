import React, { Component } from "react";

export type ModalProps = {
    id: string;
    isOpen: boolean;
    toggle: () => void;
    title?: string;
    body?: React.ReactNode;
    closeTitle?: string;
};

export type ModalStates = {
    isOpen: boolean;
};

export class Modal extends Component<ModalProps, ModalStates> {
    public readonly state: Readonly<ModalStates> = {
        isOpen: this.props.isOpen
    };

    public static getDerivedStateFromProps(nextProps: ModalProps, prevState: ModalStates) {
        if (nextProps.isOpen !== prevState.isOpen) {
            return { isOpen: nextProps.isOpen };
        }
        else {
            return undefined; // Triggers no change in the state
        }
    }

    private listenKeyboard = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Escape" || event.keyCode === 27) {
            this.toggle();
        }
    }

    private onDialogClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
    }

    private toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
        this.props.toggle();
    }

    public render() {
        // console.log(this.state);
        return (
            <div
                className="modal fade"
                id={this.props.id} tabIndex={-1} role="dialog"
                aria-labelledby="exampleModalLabel" aria-hidden="true" onClick={this.toggle}
                onKeyDown={this.listenKeyboard}
            >
                <div className="modal-dialog modal-dialog-centered" role="document" onClick={this.onDialogClick}>
                    <div className="modal-content">
                        {this.renderModalHead()}
                        <div className="modal-body">{this.props.body}</div>
                        {this.renderModalFoot()}
                    </div>
                </div>
            </div>
        );
    }

    private renderModalHead = (): React.ReactNode => {
        return (
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">{this.props.title}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                    onClick={this.toggle}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        );
    }

    private renderModalFoot = (): React.ReactNode => {
        return (
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal"
                    onClick={this.toggle}
                >
                    {this.props.closeTitle}
                </button>
            </div>
        );
    }
}
