import React, { Component } from "react";
import {
    withRouter,
} from "react-router-dom";

class ScrollToTopComponent extends Component<any, any> {

    componentWillReceiveProps(prevProps: any) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

export let ScrollToTop = withRouter(ScrollToTopComponent);
