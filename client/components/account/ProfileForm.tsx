import React, { Component } from "react";
import { AjaxHandler } from "../../utils/AjaxHandler";
import { EmptyException, InvalidLengthException } from "../../communication/Exception";
import { AlertMessage } from "../utils/AlertMessage";
import { FormGroupText } from "../form/FormGroupText";
import { FormGroupRadio } from "../form/FormGroupRadio";
import { UserPayload } from "../../models/User";

import Log from "../../utils/Log";

export type ProfileFormProps = {
    currUser: UserPayload;
    textButton: string;
    postToUrl: string;
};

export type ProfileFormStates = {
    message: string;
    email: string;
    // password: string;
    firstName: string;
    lastName: string;
    gender: string;
    location: string;
    website: string;
};

export class ProfileForm extends Component<ProfileFormProps, ProfileFormStates> {

    public readonly state: Readonly<ProfileFormStates> = {
        message: "",
        email: this.props.currUser.email,
        // password: "",
        firstName: this.props.currUser.profile.firstName,
        lastName: this.props.currUser.profile.lastName,
        gender: this.props.currUser.profile.gender,
        location: this.props.currUser.profile.location,
        website: this.props.currUser.profile.website
    };

    public render() {
        return (
            <form onSubmit={this.onSubmit}>
                <AlertMessage message={this.state.message} />
                <form>
                    <FormGroupText
                        type={"email"} id={"profile-id-email"} value={this.state.email}
                        onChange={this.onInputChange("email")}
                        label={"Email"}
                    />
                    <FormGroupText
                        type={"text"} id={"profile-id-firstName"} value={this.state.firstName}
                        onChange={this.onInputChange("firstName")}
                        label={"First Name"}
                    />
                    <FormGroupText
                        type={"text"} id={"profile-id-lastName"} value={this.state.lastName}
                        onChange={this.onInputChange("lastName")}
                        label={"Last Name"}
                    />
                    <FormGroupText
                        type={"text"} id={"profile-id-location"} value={this.state.location}
                        onChange={this.onInputChange("location")}
                        label={"Location"}
                    />
                    <FormGroupText
                        type={"text"} id={"profile-id-website"} value={this.state.website}
                        onChange={this.onInputChange("website")}
                        label={"Website"}
                    />
                    <FormGroupRadio
                        label="Gender" values={["Male", "Female", "Other"]}
                        currValue={this.state.gender} onChange={this.onInputChange("gender")}
                    />
                </form>
                <button type="submit" className="btn">{this.props.textButton}</button>
            </form>
        );
    }

    private onInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [field]: event.target.value
        } as Pick<ProfileFormStates, any>);
    }

    private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            // this.checkEmptyFields();
            // this.checkPasswordLength();
        }
        catch (err) {
            switch (true) {
                case err instanceof EmptyException:
                    Log.error(err);
                    this.setState({ message: err.message });
                    return;
                case err instanceof InvalidLengthException:
                    this.setState({
                        // password: "",
                        message: err.message
                    });
                    return;
                default:
                    this.setState({
                        email: "",
                        // password: "",
                        message: err.message
                    });
                    return;
            }
        }
        Log.trace(this.state);
        this.submit();
    }

    private async submit(): Promise<any> {
        Log.trace("Submitting form to: ", this.props.postToUrl);
        const data = {
            email: this.state.email,
            // password: this.state.password
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
                // password: ""
            });
        }
    }

    // private checkEmptyFields(): void {
    //     if (this.state.email === "") {
    //         throw new EmptyException("Please enter an email address!");
    //     }
    //     if (this.state.password === "") {
    //         throw new EmptyException("Please enter a password!");
    //     }
    // }

    // private checkPasswordLength(): void {
    //     if (this.state.password.length < 4) {
    //         throw new InvalidLengthException("Password must be at least 4 characters long");
    //     }
    // }
}
