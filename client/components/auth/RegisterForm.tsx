import React, { ReactElement } from "react";
import { AjaxHandler } from "../utils/AjaxHandler";
import { LoginForm, LoginFormProps, LoginFormStates } from "./LoginForm";
import { EmptyException, InvalidLengthException, NotMatchException } from "./Exception";

export type IRegisterFormProps = {
    idConfirmPassword?: string;
} & LoginFormProps;

export type IRegisterFormStates = {
    valConfirmPassword: string;
} & LoginFormStates;

export class RegisterForm extends LoginForm<IRegisterFormProps, IRegisterFormStates> {
    readonly state: Readonly<IRegisterFormStates> = {
        isClicked: false,
        message: "",
        valEmail: "",
        valPassword: "",
        valConfirmPassword: "",
    };

    static getDerivedStateFromProps(nextProps: LoginFormProps, prevState: LoginFormStates) {
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

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                {this.displayMessage()}
                {this.getFormGroupEmail()}
                {this.getFormGroupPassword()}
                {this.getFormGroupConfirmPassword()}
                <button type="submit" className="btn">{this.props.textButton}</button>
            </form>
        );
    }

    onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        console.log("submit");
        event.preventDefault();
        try {
            this.checkEmptyFields();
            this.checkPasswordLength();
            this.checkConfirmPassword();
        }
        catch (error) {
            switch (true) {
                case error instanceof EmptyException:
                    this.setState({ message: error.message });
                    return;
                case error instanceof InvalidLengthException:
                    this.setState({
                        valPassword: "",
                        valConfirmPassword: "",
                        message: error.message
                    });
                    return;
                case error instanceof NotMatchException:
                    this.setState({
                        valPassword: "",
                        valConfirmPassword: "",
                        message: error.message
                    });
                default:
                    this.setState({
                        valEmail: "",
                        valPassword: "",
                        valConfirmPassword: "",
                        message: error.message
                    });
                    return;
            }
        }
        this.submit();
    }

    async submit(): Promise<any> {
        console.log("Submitting form to: ", this.props.postToUrl);
        const data = {
            email: this.state.valEmail,
            password: this.state.valPassword,
            confirmPassword: this.state.valConfirmPassword
        };

        try {
            const response = await AjaxHandler.postRequest(this.props.postToUrl, data);
            console.log("YAY!!!");
            console.log(response);
            this.setState({ message: response.message });
            window.location = response.payload.redirect;
        }
        catch (error) {
            console.log(`NAY: ${error}`);
            this.setState({
                message: error.message,
                valEmail: "",
                valPassword: "",
                valConfirmPassword: "",
            });
        }
    }

    checkConfirmPassword(): void {
        if (
            (this.state.valConfirmPassword === "") || (this.state.valPassword !== this.state.valConfirmPassword)
        ) {
            throw new NotMatchException("Password fields do not match. Please try again!");
        }
    }

    getFormGroupConfirmPassword(): ReactElement {
        return (
            <div className="form-group">
                <input
                    type="password" className="form-control"
                    id={this.props.idConfirmPassword} value={this.state.valConfirmPassword}
                    placeholder="Confirm Password" onChange={this.onInputChange("valConfirmPassword")}
                />
            </div>
        );
    }
}
