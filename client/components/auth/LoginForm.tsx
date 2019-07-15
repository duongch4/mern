import * as React from "react";
import { AjaxHandler } from "../utils/AjaxHandler";
import { EmptyException, InvalidLengthException } from "./Exception";

export interface ILoginFormProps {
    isClicked: boolean;
    idEmail?: string;
    idPassword?: string;
    textButton: string;
    postToUrl: string;
}

export interface ILoginFormStates {
    isClicked: false;
    message: string;
    valEmail: string;
    valPassword: string;
}

export class LoginForm<T extends ILoginFormProps = ILoginFormProps, S extends ILoginFormStates = ILoginFormStates>
    extends React.Component<T, S> {

    public readonly state: Readonly<ILoginFormStates | any> = {
        isClicked: false,
        message: "",
        valEmail: "",
        valPassword: ""
    };

    public static getDerivedStateFromProps(nextProps: ILoginFormProps, prevState: ILoginFormStates) {
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
        } as Pick<ILoginFormStates, any>);
    }

    protected onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            this.checkEmptyFields();
            this.checkPasswordLength();
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
                default:
                    this.setState({});
                    return;
            }
        }
        this.submit();
    }

    protected checkEmptyFields(): void {
        console.log(this.state.valEmail);
        if (this.state.valEmail === "") {
            throw new EmptyException("Please enter an email address!");
        }
        if (this.state.valPassword === "") {
            throw new EmptyException("Please enter a password!");
        }
    }

    protected checkPasswordLength(): void {
        if (this.state.valPassword.length < 9) {
            throw new InvalidLengthException("Password must be longer than 8 characters");
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
            this.setState({
                message: error.message,
                valEmail: "",
                valPassword: ""
            });
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
