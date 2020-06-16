import React, { Component } from "react";
import { UserPayload } from "../../models/User";

type ProfileInfoProps = {
    currUser: UserPayload;
};

export class ProfileInfo extends Component<ProfileInfoProps, any> {
    public render() {
        return (
            <div id="profile-info">
                <h1>Only Authenticated Users See Their Info Here!</h1>
                <h2>Hello: {this.props.currUser.email}</h2>
            </div>
        );
    }
}
