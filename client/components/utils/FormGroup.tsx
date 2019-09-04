import React from "react";

type FormGroupProps = {
    type: string;
    id: string;
    value: string;
    placeholder: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    smallHelpId?: string;
    smallHelp?: string;

};

export const FormGroup = (props: FormGroupProps): React.ReactElement => {
    return (
        <div className="form-group">
            <input
                className="form-control"
                type={props.type}
                id={props.id}
                value={props.value}
                aria-describedby={props.smallHelpId}
                placeholder={props.placeholder}
                onChange={props.onChange}
            />
            {
                props.smallHelp ?
                    <small id={props.smallHelpId} className="form-text text-muted">{props.smallHelp}</small> :
                    <small>{undefined}</small>
            }
        </div>
    );
};
