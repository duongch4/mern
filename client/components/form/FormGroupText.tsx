import React from "react";

type FormGroupProps = {
    type: string;
    id: string;
    value: string;
    placeholder?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    smallHelpDiv?: React.ReactElement;
    label?: string;
};

const setInputFormControl = (props: FormGroupProps): React.ReactElement => (
    <input
        className="form-control"
        type={props.type}
        id={props.id}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
        required
    />
);

export const FormGroupText = (props: FormGroupProps): React.ReactElement => {
    const SmallHelpDiv = () => props.smallHelpDiv ? props.smallHelpDiv : <div>{undefined}</div>;
    if (props.label) {
        return (
            <div className="form-group row">
                <label htmlFor={props.id} className="col-sm-3 col-md-3 col-form-label font-weight-bold text-center">{props.label}</label>
                <div className="col-sm-5 col-md-5">
                    {setInputFormControl(props)}
                </div>
                <SmallHelpDiv />
            </div>
        );
    }
    else {
        return (
            <div className="form-group">
                {setInputFormControl(props)}
                <SmallHelpDiv />
            </div>
        );
    }
};
