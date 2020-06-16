import React from "react";
import { ProfileForm } from "../../components/account/ProfileForm";

import { UserPayload } from "../../pages/MainRoutes";

type AccountPageProps = {
    currUser: UserPayload;
};

export const AccountPage = (props: AccountPageProps) => {
    return (
        <div id="account-page" className="container-fluid container-main">
            <div className="pb-2 mt-2 mb-4 border-bottom"><h3>Profile Information</h3></div>
            <ProfileForm currUser={props.currUser} textButton={"Update Profile"} postToUrl={"/api/account/profile"} />
        </div>
    );
};
