import React, { Component } from "react";
import { AjaxHandler } from "../../utils/AjaxHandler";
import { LoginFormProps, LoginFormStates } from "./LoginForm";
import { EmptyException, InvalidLengthException, NotMatchException } from "../../communication/Exception";
import { AlertMessage } from "../utils/AlertMessage";
import { FormGroup } from "../utils/FormGroup";
import Log from "../../utils/Log";

export type RegisterFormProps = {
    idConfirmPassword?: string;
} & LoginFormProps;

export type RegisterFormStates = {
    valConfirmPassword: string;
} & LoginFormStates;

export class RegisterForm extends Component<RegisterFormProps, RegisterFormStates> {
    public readonly state: Readonly<RegisterFormStates> = {
        isClicked: false,
        message: "",
        valEmail: "",
        valPassword: "",
        valConfirmPassword: "",
    };

    public static getDerivedStateFromProps(nextProps: RegisterFormProps, prevState: RegisterFormStates) {
        if (nextProps.isClicked !== prevState.isClicked) {
            return {
                isClicked: nextProps.isClicked,
                message: "",
                valEmail: "",
                valPassword: "",
                valConfirmPassword: ""
            };
        }
        else {
            return undefined; // Triggers no change in the state
        }
    }

    public render() {
        return (
            <form onSubmit={this.onSubmit}>
                <AlertMessage message={this.state.message} />
                <FormGroup
                    type={"email"} id={this.props.idEmail} value={this.state.valEmail}
                    placeholder={"Enter Email"} onChange={this.onInputChange("valEmail")}
                    smallHelpId={"email-small-help"}
                    smallHelp={"We'll never share your email with anyone else. LIES!!"}
                />
                <FormGroup
                    type={"password"} id={this.props.idPassword} value={this.state.valPassword}
                    placeholder={"Password"} onChange={this.onInputChange("valPassword")}
                />
                <FormGroup
                    type={"password"} id={this.props.idConfirmPassword} value={this.state.valConfirmPassword}
                    placeholder={"Confirm Password"} onChange={this.onInputChange("valConfirmPassword")}
                />
                <button type="submit" className="btn">{this.props.textButton}</button>
            </form>
        );
    }

    private onInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [field]: event.target.value
        } as Pick<LoginFormStates, any>);
    }

    private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        Log.info("submit");
        event.preventDefault();
        try {
            this.checkEmptyFields();
            this.checkPasswordLength();
            this.checkConfirmPassword();
            this.submit();
        }
        catch (err) {
            switch (true) {
                case err instanceof EmptyException:
                    this.setState({ message: err.message });
                    break;
                case err instanceof InvalidLengthException:
                    this.setState({
                        valPassword: "",
                        valConfirmPassword: "",
                        message: err.message
                    });
                    break;
                case err instanceof NotMatchException:
                    this.setState({
                        valPassword: "",
                        valConfirmPassword: "",
                        message: err.message
                    });
                    break;
                default:
                    this.setState({
                        valEmail: "",
                        valPassword: "",
                        valConfirmPassword: "",
                        message: err.message
                    });
                    break;
            }
        }
    }

    private async submit(): Promise<any> {
        Log.info("Submitting form to: ", this.props.postToUrl);
        const data = {
            email: this.state.valEmail,
            password: this.state.valPassword,
            confirmPassword: this.state.valConfirmPassword
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
                valPassword: "",
                valConfirmPassword: "",
            });
        }
    }

    private checkConfirmPassword(): void {
        if (
            (this.state.valConfirmPassword === "") || (this.state.valPassword !== this.state.valConfirmPassword)
        ) {
            throw new NotMatchException("Password fields do not match. Please try again!");
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
