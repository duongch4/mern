import React from "react";
import { ProfileForm } from "../../components/form/ProfileForm";

export const AccountPage = () => {
    return (
        <div id="account-page" className="container-fluid container-main">
            <div className="pb-2 mt-2 mb-4 border-bottom"><h3>Profile Information</h3></div>
            <ProfileForm />
        </div>
    );
};
