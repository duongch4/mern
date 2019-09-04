import React, { Component } from "react";
import { UserDoc } from "../../../server/models/User";
import { AccountForm } from "../../components/account/AccountForm";

export class AccountPage extends Component<any, any> {
    render() {
        return (
            <div id="account-page" className="container-fluid">
                <h1>AuthPage2: Only Authenticated Users See This Page.</h1>
                <AccountForm textButton={"SENTTTTT"} postToUrl={"/blah"} />
            </div>
        );
    }
}
