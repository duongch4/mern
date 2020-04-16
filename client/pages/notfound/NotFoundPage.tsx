import React from "react";
import { RouteComponentProps, Link } from "react-router-dom";

type MatchParams = {
    name: string;
};

export const NotFoundPage = (props: RouteComponentProps<MatchParams>) => (
    <div id="not-found-page" className="App">
        <h1>HTTP ERROR 404</h1>
        <h1>Requested Path: "{props.location.pathname}" Does Not Exist</h1>
        <button type="button" className="btn"><Link className="not-found-link" to="/">Back To Home Page</Link></button>
    </div>
);
