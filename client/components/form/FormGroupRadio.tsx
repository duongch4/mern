import React from "react";

type FormGroupRadioProps = {
    label: string;
    currValue: string;
    values: string[];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const setInputFormControl = (props: FormGroupRadioProps): React.ReactElement[] => {
    const result: React.ReactElement[] = [];
    for (const value of props.values) {
        result.push(
            <div className="form-check form-check-inline">
                <input className="form-check-input"
                    type="radio" name={props.label} value={value} data-toggle="radio"
                    checked={props.currValue.toLowerCase() === value.toLowerCase()}
                    onChange={props.onChange}
                />
                <label className="form-check-label">{value}</label>
            </div>
        );
    }
    return result;
};

export const FormGroupRadio = (props: FormGroupRadioProps): React.ReactElement => (
    <div className="form-group row">
        <legend className="col-md-3 pt-0 col-form-label font-weight-bold text-right">{props.label}</legend>
        <div className="col-md-6">
            {setInputFormControl(props)}
        </div>
    </div>
);
