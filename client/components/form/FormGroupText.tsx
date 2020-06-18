import React from "react";

type FormGroupProps = {
    type: string;
    id: string;
    value: string;
    placeholder?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    smallHelpId?: string;
    smallHelp?: string;
    label?: string;
};

const setInputFormControl = (props: FormGroupProps): React.ReactElement => (
    <input
        className="form-control"
        type={props.type}
        id={props.id}
        value={props.value}
        aria-describedby={props.smallHelpId}
        placeholder={props.placeholder}
        onChange={props.onChange}
        required
    />
);

const setSmallHelpMessage = (props: FormGroupProps): React.ReactElement => {
    if (props.smallHelp) {
        return <small id={props.smallHelpId} className="form-text text-muted">{props.smallHelp}</small>;
    }
    else {
        return <div>{undefined}</div>;
    }
};

export const FormGroupText = (props: FormGroupProps): React.ReactElement => {
    if (props.label) {
        return (
            <div className="form-group row">
                <label htmlFor={props.id} className="col-md-3 col-form-label font-weight-bold text-right">{props.label}</label>
                <div className="col-md-7">
                    {setInputFormControl(props)}
                </div>
                {setSmallHelpMessage(props)}
            </div>
        );
    }
    else {
        return (
            <div className="form-group">
                {setInputFormControl(props)}
                {setSmallHelpMessage(props)}
            </div>
        );
    }
};
