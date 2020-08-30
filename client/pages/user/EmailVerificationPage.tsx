import React from "react";
import { useLocation, Link } from "react-router-dom";
import querystring from "querystring";
import { useUserAuthenticated } from "../../contexts/UserContext";

export const EmailVerificationPage = () => {
    const { user } = useUserAuthenticated();
    const query = querystring.parse(useLocation().search.replace("?", ""));
    return (
        <div id="verified-email-page" className="container-fluid container-main">
            <div className="pb-2 mt-2 mb-4">
                <h3>{query.message}</h3>
                <Link className="btn not-found-link" to={`/users/${user.id}`}>Go To Account Page</Link>
            </div>
        </div>
    );
};
