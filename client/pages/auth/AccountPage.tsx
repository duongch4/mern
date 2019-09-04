import React, { Component } from "react";
import { UserDoc } from "../../../server/models/User";
import { ProfileForm } from "../../components/account/ProfileForm";

export class AccountPage extends Component<any, any> {
    render() {
        return (
            <div id="account-page" className="container-fluid">
                <h1>AuthPage2: Only Authenticated Users See This Page.</h1>
                <ProfileForm textButton={"Update Profile"} postToUrl={"/api/account/profile"} />
            </div>
        );
    }
}
