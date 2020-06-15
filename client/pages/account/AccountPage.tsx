import React, { Component } from "react";
import { ProfileForm } from "../../components/account/ProfileForm";

export class AccountPage extends Component<any, any> {
    public render() {
        return (
            <div id="account-page" className="container-fluid">
                <h1>AuthPage2: Only Authenticated Users See This Page.</h1>
                <ProfileForm idEmail={"id-email"} idPassword={"id-password"} textButton={"Update Profile"} postToUrl={"/api/account/profile"} />
            </div>
        );
    }
}
