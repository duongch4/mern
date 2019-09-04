import React, { Component } from "react";
import { AjaxHandler } from "../../utils/AjaxHandler";
import { EmptyException, InvalidLengthException } from "../../utils/Exception";
import { AlertMessage } from "../utils/AlertMessage";
import { FormGroup } from "../utils/FormGroup";

export type AccountFormProps = {
    idEmail?: string;
    idPassword?: string;
    textButton: string;
    postToUrl: string;
};

export type AccountFormStates = {
    message: string;
    valEmail: string;
    valPassword: string;
};

export class AccountForm extends Component<AccountFormProps, AccountFormStates> {

    readonly state: Readonly<AccountFormStates> = {
        message: "",
        valEmail: "",
        valPassword: ""
    };

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <AlertMessage message={this.state.message} />
                {this._renderFormGroupEmail()}
                {this._renderFormGroupEmail()}
                {this._renderFormGroupEmail()}
                {this._renderFormGroupEmail()}
                {this._renderFormGroupPassword()}
                <button type="submit" className="btn">{this.props.textButton}</button>
            </form>
        );
    }

    _renderFormGroupEmail = (): React.ReactElement => {
        return (
            <FormGroup
                type={"email"} id={this.props.idEmail} value={this.state.valEmail}
                placeholder={"Enter Email"} onChange={this.onInputChange("valEmail")}
            />
        );
    }

    _renderFormGroupPassword = (): React.ReactElement => {
        return (
            <FormGroup
                type={"password"} id={this.props.idPassword} value={this.state.valPassword}
                placeholder={"Password"} onChange={this.onInputChange("valPassword")}
            />
        );
    }

    onInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [field]: event.target.value
        } as Pick<AccountFormStates, any>);
    }

    onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            this.checkEmptyFields();
            this.checkPasswordLength();
        }
        catch (err) {
            switch (true) {
                case err instanceof EmptyException:
                    console.log(err);
                    this.setState({ message: err.message });
                    return;
                case err instanceof InvalidLengthException:
                    this.setState({
                        valPassword: "",
                        message: err.message
                    });
                    return;
                default:
                    this.setState({
                        valEmail: "",
                        valPassword: "",
                        message: err.message
                    });
                    return;
            }
        }
        console.log(this.state);
        this.submit();
    }

    async submit(): Promise<any> {
        console.log("Submitting form to: ", this.props.postToUrl);
        const data = {
            email: this.state.valEmail,
            password: this.state.valPassword
        };

        try {
            const response = await AjaxHandler.postRequest(this.props.postToUrl, data);
            console.log("YAY!!!");
            console.log(response);
            this.setState({ message: response.message });
            window.location = window.location;
        }
        catch (err) {
            console.log(`NAY: ${err}`);
            this.setState({
                message: err.message,
                valEmail: "",
                valPassword: ""
            });
        }
    }

    checkEmptyFields(): void {
        if (this.state.valEmail === "") {
            throw new EmptyException("Please enter an email address!");
        }
        if (this.state.valPassword === "") {
            throw new EmptyException("Please enter a password!");
        }
    }

    checkPasswordLength(): void {
        if (this.state.valPassword.length < 4) {
            throw new InvalidLengthException("Password must be at least 4 characters long");
        }
    }
}
