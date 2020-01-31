import React, { Component } from "react";
import { UserPayload } from "../../pages/MainRoutes";

type AuthPageProps = {
    currUser: UserPayload;
};

export class AuthPage extends Component<AuthPageProps, any> {
    public render() {
        return (
            <div id="auth-page">
                <h1>Only Authenticated Users See This Page.</h1>
                <h2>Hello: {this.props.currUser.email}</h2>
            </div>
        );
    }
}
