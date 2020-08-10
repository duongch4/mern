import React from "react";
import { RouteComponentProps, Link } from "react-router-dom";

type MatchParams = {
    name: string;
};

export const NotFoundPage = (props: RouteComponentProps<MatchParams>) => (
    <div id="not-found-page" className="container-fluid container-main text-center">
        <div className="pb-2 mt-2 mb-4">
            <h1>HTTP ERROR 404</h1>
            <h3>Requested Path: '{`${props.location.pathname.substr(0, 20)}...`}' Does Not Exist</h3>
            <Link className="btn not-found-link" to="/">Back To Home Page</Link>
        </div>
    </div>
);
