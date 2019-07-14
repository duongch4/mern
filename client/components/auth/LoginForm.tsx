import * as React from "react";
import { AjaxHandler } from "../utils/AjaxHandler";

export interface IAuthFormProps {
    idEmail?: string;
    idPassword?: string;
    idConfirmPassword?: string;
    textButton: string;
    postToUrl: string;
}

export interface IAuthFormStates {
    message: string;
    valEmail: string;
    valPassword: string;
    valConfirmPassword: string;
}

export class LoginForm extends React.Component<IAuthFormProps, IAuthFormStates> {
    public readonly state: IAuthFormStates = {
        message: "",
        valEmail: "",
        valPassword: "",
        valConfirmPassword: ""
    };

    public render() {
        return (
            <form onSubmit={this.onSubmit}>
                {this.displayMessage()}
                {this.getFormGroupEmail()}
                {this.getFormGroupPassword()}
                <button type="submit" className="btn">{this.props.textButton}</button>
            </form>
        );
    }

    protected onInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [field]: event.target.value
        } as Pick<IAuthFormStates, any>);
    }

    protected onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        console.log("submit");
        event.preventDefault();
        this.checkEmptyFields();
        this.checkPasswordLength();
        this.submit();
    }

    protected checkEmptyFields(): void {
        if (this.state.valEmail === "") {
            this.setState({
                message: "Please enter an email address!"
            });
        }
        if (this.state.valPassword === "") {
            this.setState({
                message: "Please enter a password!"
            });
        }
    }

    protected checkPasswordLength(): void {
        if (this.state.valPassword.length < 9) {
            this.setState({
                valPassword: "",
                valConfirmPassword: "",
                message: "Password must be longer than 8 characters"
            });
        }
    }

    protected async submit(): Promise<any> {
        console.log("Submitting form to: ", this.props.postToUrl);
        const data = {
            email: this.state.valEmail,
            password: this.state.valPassword
        };

        try {
            const result = await AjaxHandler.postRequest(this.props.postToUrl, data);
            console.log(`YAY: ${result}`);
            // Redirect or something here!!!
            // window.location = response.;
        }
        catch (error) {
            console.log(`NAY: ${error}`);
            // this.setState({
            //     message: "Some error! Need to figure out how to get proper error message",
            //     valEmail: "",
            //     valPassword: "",
            //     valConfirmPassword: ""
            // });
        }

        // this.setState({
        //     message: ""
        // });
    }

    protected displayMessage(): JSX.Element {
        let message: JSX.Element;
        if (this.state.message) {
            message = <div className="alert alert-warning">{this.state.message}</div>;
        }
        else {
            message = undefined;
        }
        return message;
    }

    protected getFormGroupEmail(): JSX.Element {
        return (
            <div className="form-group">
                <input
                    type="email" className="form-control"
                    id={this.props.idEmail} value={this.state.valEmail}
                    aria-describedby="emailHelp" placeholder="Enter email" onChange={this.onInputChange("valEmail")}
                />
                <small id="emailHelp" className="form-text text-muted">
                    We'll never share your email with anyone else. LIES!!
                </small>
            </div>
        );
    }

    protected getFormGroupPassword(): JSX.Element {
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
