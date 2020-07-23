import React from "react";
import { APP_ROOT } from "../../config/config";

export const StatusPage = () => (
    <div id="status-page">
        <object type="text/html" data={`${APP_ROOT}/status`} />
    </div>
);

