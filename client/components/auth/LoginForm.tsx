import React, { Component, ReactElement } from "react";
import { AjaxHandler } from "../utils/AjaxHandler";
import { EmptyException, InvalidLengthException } from "./Exception";

export type LoginFormProps = {
    idEmail?: string;
    idPassword?: string;
    isClicked: boolean;
    textButton: string;
    postToUrl: string;
};

export type LoginFormStates = {
    isClicked: boolean;
    message: string;
    valEmail: string;
    valPassword: string;
};

export class LoginForm<T extends LoginFormProps, S extends LoginFormStates> extends Component<T, S> {

    readonly state: Readonly<LoginFormStates | any> = {
        isClicked: false,
        message: "",
        valEmail: "",
        valPassword: ""
    };

    static getDerivedStateFromProps(nextProps: LoginFormProps, prevState: LoginFormStates) {
        if (nextProps.isClicked !== prevState.isClicked) {
            return {
                isClicked: nextProps.isClicked,
                message: "",
                valEmail: "",
                valPassword: ""
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
                <button type="submit" className="btn">{this.props.textButton}</button>
            </form>
        );
    }

    onInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [field]: event.target.value
        } as Pick<LoginFormStates, any>);
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

    displayMessage(): ReactElement {
        let message: ReactElement;
        if (this.state.message) {
            message = <div className="alert alert-warning">{this.state.message}</div>;
        }
        else {
            message = undefined;
        }
        return message;
    }

    getFormGroupEmail(): ReactElement {
        const emailHelp = "We'll never share your email with anyone else. LIES!!";
        return (
            <div className="form-group">
                <input
                    type="email" className="form-control"
                    id={this.props.idEmail} value={this.state.valEmail}
                    aria-describedby="emailHelp" placeholder="Enter email" onChange={this.onInputChange("valEmail")}
                />
                <small id="emailHelp" className="form-text text-muted">{emailHelp}</small>
            </div>
        );
    }

    getFormGroupPassword(): ReactElement {
        return (
            <div className="form-group">
                <input
                    type="password" className="form-control"
                    id={this.props.idPassword} value={this.state.valPassword}
                    placeholder="Password" onChange={this.onInputChange("valPassword")}
                />
            </div>
        );
    }
}
