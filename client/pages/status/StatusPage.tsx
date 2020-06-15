import React, { Component } from "react";
import { APP_ROOT } from "../../config/config";

export class StatusPage extends Component<any, any> {
    public render() {
        return (
            <div id="status-page">
                <object type="text/html" data={`${APP_ROOT}/status`} />
            </div>
        );
    }
}
