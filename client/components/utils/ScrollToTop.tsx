import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

const ScrollToTopComponent = (props: RouteComponentProps): React.ReactElement => {
    React.useEffect(() => {
        const unlisten = props.history.listen(() => window.scrollTo(0, 0));
        return () => unlisten();
    }, [props.history]);

    return <noscript></noscript>;
};

export const ScrollToTop = withRouter(ScrollToTopComponent);
