import * as React from "react";

import {
    withRouter,
} from "react-router-dom";

class ScrollToTopComponent extends React.Component<any, any> {

    public componentWillReceiveProps(prevProps: any) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0);
        }
    }

    public render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

export let ScrollToTop = withRouter(ScrollToTopComponent);
