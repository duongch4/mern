import React from "react";

import { ProfileInfo } from "../../components/account/ProfileInfo";
import { useUserAuthenticated } from "../../context/UserContext";
import { JsonPrint } from "../../components/utils/JsonPrint";

export const HomePage = () => {
    const user = useUserAuthenticated().state;
    return (
        <div id="home-page" className="container-fluid container-main text-center">
            <ProfileInfo currUser={user} />
            <JsonPrint data={user} />
        </div>
    );
};
