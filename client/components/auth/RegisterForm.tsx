import * as React from "react";
import { AjaxHandler } from "../utils/AjaxHandler";
import { LoginForm, ILoginFormProps, ILoginFormStates } from "./LoginForm";
import { EmptyException, InvalidLengthException, NotMatchException } from "./Exception";

export interface IRegisterFormProps extends ILoginFormProps {
    idConfirmPassword?: string;
}

export interface IRegisterFormStates extends ILoginFormStates {
    valConfirmPassword: string;
}

export class RegisterForm extends LoginForm<IRegisterFormProps, IRegisterFormStates> {
    public readonly state: Readonly<IRegisterFormStates> = {
        isClicked: false,
        message: "",
        valEmail: "",
        valPassword: "",
        valConfirmPassword: ""
    };

    public static getDerivedStateFromProps(nextProps: ILoginFormProps, prevState: ILoginFormStates) {
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
                {this.displayMessage()}
                {this.getFormGroupEmail()}
                {this.getFormGroupPassword()}
                {this.getFormGroupConfirmPassword()}
                <button type="submit" className="btn">{this.props.textButton}</button>
            </form>
        );
    }

    protected onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
                    this.setState({});
                    return;
            }
        }
        this.submit();
    }

    private checkConfirmPassword(): void {
        if (
            (this.state.valConfirmPassword === "") || (this.state.valPassword !== this.state.valConfirmPassword)
        ) {
            throw new NotMatchException("Password fields do not match. Please try again!");
        }
    }

    private getFormGroupConfirmPassword(): JSX.Element {
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
