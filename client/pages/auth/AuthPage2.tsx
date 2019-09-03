import React, { Component } from "react";
import { UserDoc } from "../../../server/models/User";

export class AuthPage2 extends Component<any, any> {
    render() {
        return (
            <div id="auth-page-2">
                <h1>AuthPage2: Only Authenticated Users See This Page.</h1>
            </div>
        );
    }
}
