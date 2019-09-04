import React, { Component } from "react";

export class ProgressBar extends Component<any, any> {
    render() {
        const progressBarStyle = {
            width: "100%",
        };

        return (
            <div className="progress">
                <div className="progress-bar progress-bar-striped active" style={progressBarStyle} />
            </div>
        );
    }
}
