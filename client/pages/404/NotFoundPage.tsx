import React, { Component } from "react";

export class NotFoundPage extends Component<any, any> {
    public render() {
        return (
            <div id="not-found-page">
                <h1>404</h1>
                <h1>Requested Path: "{this.props.location.pathname}" Does Not Exist</h1>
            </div>
        );
    }
}
