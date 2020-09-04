import React from "react";
import { ProfileForm } from "../../components/form/ProfileForm";

export const UserPage = () => {
    return (
        <div id="account-page" className="container-fluid container-main">
            <div className="account-page__hero pb-2 mb-4 border-bottom"><h3>Profile Information</h3></div>
            <ProfileForm />
        </div>
    );
};
