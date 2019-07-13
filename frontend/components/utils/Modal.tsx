import * as React from "react";

export interface IModalProps {
    id: string;
    title?: string;
    body?: JSX.Element;
    closeTitle?: string;
}

export const Modal: React.FunctionComponent<IModalProps> = (
    {
        id = "exampleModal",
        title = "Title",
        body = (<span>Put Your Body Here</span>),
        closeTitle = "Close"
    }
) => {
    return (
        <div
            className="modal fade" id={id} tabIndex={-1} role="dialog"
            aria-labelledby="exampleModalLabel" aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{title}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">{body}</div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">
                            {closeTitle}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
