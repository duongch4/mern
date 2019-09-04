import React, { Component } from "react";
import { AjaxHandler } from "../../utils/AjaxHandler";
import { EmptyException, InvalidLengthException } from "../../utils/Exception";
import { AlertMessage } from "../utils/AlertMessage";
import { FormGroup } from "../utils/FormGroup";

export type ProfileFormProps = {
    idEmail?: string;
    idPassword?: string;
    textButton: string;
    postToUrl: string;
};

export type ProfileFormStates = {
    message: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    location: string;
    website: string;
};

export class ProfileForm extends Component<ProfileFormProps, ProfileFormStates> {

    readonly state: Readonly<ProfileFormStates> = {
        message: "",
        email: "",
        firstName: "",
        lastName: "",
        gender: "",
        location: "",
        website: ""
    };

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <AlertMessage message={this.state.message} />
                <form className="form-row">
                    <div className="col-md-6 mb-3">{this._renderFormGroupEmail()}</div>
                    <div className="col-md-6 mb-3">{this._renderFormGroupEmail()}</div>
                </form>
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
                type={"email"} id={this.props.idEmail} value={this.state.email}
                placeholder={"Enter Email"} onChange={this.onInputChange("valEmail")}
                label={"Email"}
            />
        );
    }

    _renderFormGroupPassword = (): React.ReactElement => {
        return (
            <FormGroup
                type={"password"} id={this.props.idPassword} value={this.state.firstName}
                placeholder={"Password"} onChange={this.onInputChange("valPassword")}
            />
        );
    }

    onInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [field]: event.target.value
        } as Pick<ProfileFormStates, any>);
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
                        firstName: "",
                        message: err.message
                    });
                    return;
                default:
                    this.setState({
                        email: "",
                        firstName: "",
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
            email: this.state.email,
            password: this.state.firstName
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
                email: "",
                firstName: ""
            });
        }
    }

    checkEmptyFields(): void {
        if (this.state.email === "") {
            throw new EmptyException("Please enter an email address!");
        }
        if (this.state.firstName === "") {
            throw new EmptyException("Please enter a password!");
        }
    }

    checkPasswordLength(): void {
        if (this.state.firstName.length < 4) {
            throw new InvalidLengthException("Password must be at least 4 characters long");
        }
    }
}
