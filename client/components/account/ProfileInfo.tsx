import React from "react";
import { UserPayload } from "../../models/User";

type ProfileInfoProps = {
    currUser: UserPayload;
};

export const ProfileInfo = (props: ProfileInfoProps) => (
    <div id="profile-info">
        <h1>Only Authenticated Users See Their Info Here!</h1>
        <h2>Hello: {props.currUser.email}</h2>
    </div>
);
