import React, { Component } from "react";
import { AjaxHandler } from "../../utils/AjaxHandler";
import { EmptyException, InvalidLengthException } from "../../communication/Exception";
import { AlertMessage } from "../utils/AlertMessage";
import { FormGroup } from "../utils/FormGroup";
import Log from "../../utils/Log";

export type ProfileFormProps = {
    textButton: string;
    postToUrl: string;
};

export type ProfileFormStates = {
    message: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: string;
    location: string;
    website: string;
};

export class ProfileForm extends Component<ProfileFormProps, ProfileFormStates> {

    public readonly state: Readonly<ProfileFormStates> = {
        message: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        gender: "",
        location: "",
        website: ""
    };

    public render() {
        return (
            <form onSubmit={this.onSubmit}>
                <AlertMessage message={this.state.message} />
                <form className="form-row">
                    <div className="col-md-6 mb-3">{this._renderFormGroupEmail()}</div>
                    <div className="col-md-6 mb-3">{this._renderFormGroupPassword()}</div>
                </form>
                <button type="submit" className="btn">{this.props.textButton}</button>
            </form>
        );
    }

    private _renderFormGroupEmail = (): React.ReactElement => {
        return (
            <FormGroup
                type={"email"} id={"profile-id-email"} value={this.state.email}
                placeholder={"Enter Email"} onChange={this.onInputChange("email")}
                label={"Email"}
            />
        );
    }

    private _renderFormGroupPassword = (): React.ReactElement => {
        return (
            <FormGroup
                type={"password"} id={"profile-id-password"} value={this.state.password}
                placeholder={"Password"} onChange={this.onInputChange("password")}
                label={"Password"}
            />
        );
    }

    public onInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [field]: event.target.value
        } as Pick<ProfileFormStates, any>);
    }

    public onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
                        password: "",
                        message: err.message
                    });
                    return;
                default:
                    this.setState({
                        email: "",
                        password: "",
                        message: err.message
                    });
                    return;
            }
        }
        Log.trace(this.state);
        this.submit();
    }

    public async submit(): Promise<any> {
        Log.trace("Submitting form to: ", this.props.postToUrl);
        const data = {
            email: this.state.email,
            password: this.state.password
        };

        try {
            const response = await AjaxHandler.postRequest(this.props.postToUrl, data);
            Log.trace("YAY!!!");
            Log.trace(response);
            this.setState({ message: response.message });
            window.location = window.location;
        }
        catch (err) {
            Log.error(`NAY: ${err}`);
            this.setState({
                message: err.message,
                email: "",
                password: ""
            });
        }
    }

    public checkEmptyFields(): void {
        if (this.state.email === "") {
            throw new EmptyException("Please enter an email address!");
        }
        if (this.state.password === "") {
            throw new EmptyException("Please enter a password!");
        }
    }

    public checkPasswordLength(): void {
        if (this.state.password.length < 4) {
            throw new InvalidLengthException("Password must be at least 4 characters long");
        }
    }
}
