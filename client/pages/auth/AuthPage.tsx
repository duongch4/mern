import React, { Component } from "react";
import { UserDoc } from "../../../server/models/User";

type AuthPageProps = {
    currUser: UserDoc
};

export class AuthPage extends Component<AuthPageProps, any> {
    render() {
        return (
            <div id="auth-page">
                <h1>Only Authenticated Users See This Page.</h1>
                <h2>Hello: {this.props.currUser.email}</h2>
            </div>
        );
    }
}
