import React from "react";

type AlertMessageProps = {
    message: string;
};

export const AlertMessage = (props: AlertMessageProps): React.ReactElement => (
    props.message
    ? <div className="alert alert-warning">{props.message}</div>
    : <div>{undefined}</div>
);
