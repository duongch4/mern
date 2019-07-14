import * as React from "react";
import { AjaxHandler } from "../utils/AjaxHandler";
import { LoginForm } from "./LoginForm";

// export interface IAuthFormProps {
//     idEmail?: string;
//     idPassword?: string;
//     idConfirmPassword?: string;
//     textButton: string;
//     postToUrl: string;
// }

// export interface IAuthFormStates {
//     message: string;
//     valEmail: string;
//     valPassword: string;
//     valConfirmPassword: string;
// }

export class RegisterForm extends LoginForm {

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
        this.checkEmptyFields();
        this.checkPasswordLength();
        this.checkConfirmPassword();
        this.submit();
    }

    private checkConfirmPassword(): void {
        if (
            (this.state.valConfirmPassword === "") || (this.state.valPassword !== this.state.valConfirmPassword)
        ) {
            this.setState({
                valPassword: "",
                valConfirmPassword: "",
                message: "Password fields do not match. Please try again!"
            });
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
