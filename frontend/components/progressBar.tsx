import * as React from "react";

export class ProgressBar extends React.Component<any, any> {
    public render() {
        const progressBarStyle = {
            width: "100%",
        };

        return (
            <div className="progress">
                <div className="progress-bar progress-bar-striped active" style={progressBarStyle}/>
            </div>
        );
    }
}
