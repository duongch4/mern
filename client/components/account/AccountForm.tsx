import React, { Component } from "react";
import { AjaxHandler } from "../../utils/AjaxHandler";
import { EmptyException, InvalidLengthException } from "../../communication/Exception";
import { AlertMessage } from "../utils/AlertMessage";
import { FormGroup } from "../utils/FormGroup";
import Log from "../../utils/Log";

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

    public readonly state: Readonly<AccountFormStates> = {
        message: "",
        valEmail: "",
        valPassword: ""
    };

    public render() {
        return (
            <form onSubmit={this.onSubmit}>
                <AlertMessage message={this.state.message} />
                {this.renderFormGroupEmail()}
                {this.renderFormGroupEmail()}
                {this.renderFormGroupEmail()}
                {this.renderFormGroupEmail()}
                {this.renderFormGroupPassword()}
                <button type="submit" className="btn">{this.props.textButton}</button>
            </form>
        );
    }

    private renderFormGroupEmail = (): React.ReactElement => {
        return (
            <FormGroup
                type={"email"} id={this.props.idEmail} value={this.state.valEmail}
                placeholder={"Enter Email"} onChange={this.onInputChange("valEmail")}
            />
        );
    }

    private renderFormGroupPassword = (): React.ReactElement => {
        return (
            <FormGroup
                type={"password"} id={this.props.idPassword} value={this.state.valPassword}
                placeholder={"Password"} onChange={this.onInputChange("valPassword")}
            />
        );
    }

    private onInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [field]: event.target.value
        } as Pick<AccountFormStates, any>);
    }

    private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            this.checkEmptyFields();
            this.checkPasswordLength();
        }
        catch (err) {
            switch (true) {
                case err instanceof EmptyException:
                    Log.error(err);
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
        Log.trace(this.state);
        this.submit();
    }

    private async submit(): Promise<any> {
        Log.info("Submitting form to: ", this.props.postToUrl);
        const data = {
            email: this.state.valEmail,
            password: this.state.valPassword
        };

        try {
            const response = await AjaxHandler.postRequest(this.props.postToUrl, data);
            Log.info("YAY!!!");
            Log.trace(response);
            this.setState({ message: response.message });
            window.location = window.location;
        }
        catch (err) {
            Log.error(`NAY: ${err}`);
            this.setState({
                message: err.message,
                valEmail: "",
                valPassword: ""
            });
        }
    }

    private checkEmptyFields(): void {
        if (this.state.valEmail === "") {
            throw new EmptyException("Please enter an email address!");
        }
        if (this.state.valPassword === "") {
            throw new EmptyException("Please enter a password!");
        }
    }

    private checkPasswordLength(): void {
        if (this.state.valPassword.length < 4) {
            throw new InvalidLengthException("Password must be at least 4 characters long");
        }
    }
}
