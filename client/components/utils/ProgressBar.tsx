import React, { Component } from "react";

type ProgressBarProps = {
    percentage: number;
};

type ProgressBarStates = {
    percentage: number;
    hide: boolean;
};

export class ProgressBar extends Component<ProgressBarProps, ProgressBarStates> {

    public readonly state: Readonly<ProgressBarStates> = {
        percentage: 0,
        hide: true,
    };

    public static getDerivedStateFromProps(nextProps: ProgressBarProps, prevState: ProgressBarStates) {

        const nextState = {
            percentage: nextProps.percentage,
            hide: prevState.hide
        };

        if (nextProps.percentage !== prevState.percentage) {
            if (nextProps.percentage === 100 && prevState.percentage === 0) {
                nextState.hide = false;
                setTimeout(() => {
                    nextState.hide = true;
                    return nextState;
                }, 1000);
            }
            else if (nextProps.percentage === 0 && prevState.percentage === 100) {
                nextState.hide = true;
            }
            return nextState;
        }
        else {
            return undefined; // Triggers no change in the state
        }
    }

    public render() {
        const progressStyle = {
            height: "2px",
            visibility: "visible" as "visible" | "hidden"
        };

        const progressBarStyle = {
            width: `${this.state.percentage}%`,
        };

        if (this.state.hide) {
            progressStyle.visibility = "hidden";
        }

        return (
            <div className="progress" style={progressStyle}>
                <div className="progress-bar progress-bar-striped" style={progressBarStyle} />
            </div>
        );
    }
}
