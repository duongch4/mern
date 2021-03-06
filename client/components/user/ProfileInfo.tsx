import React from "react";

import { useUserAuthenticated } from "../../contexts/UserContext";
import { JsonPrint } from "../utils/JsonPrint";

export const ProfileInfo = () => {
    const { user } = useUserAuthenticated();
    return (
        <div id="profile-info">
            <h1>Only Authenticated Users See Their Info Here!</h1>
            <h2>Hello: {user.email}</h2>
            <JsonPrint data={user} />
        </div>
    );
};
