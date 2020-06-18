import React from "react";

type AlertMessageProps = {
    message: string;
};

export const AlertMessage = (props: AlertMessageProps): React.ReactElement => (
    <div className="alert alert-warning">{props.message ? props.message : undefined}</div>
);
