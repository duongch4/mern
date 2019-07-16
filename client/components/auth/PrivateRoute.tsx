import React from "react";
import {
    Route,
    Redirect,
    RouteProps,
} from "react-router-dom";

type PrivateRouteProps = {
    component: any;
    isLoggedIn: boolean;
} & RouteProps;

export const PrivateRoute = (props: PrivateRouteProps) => {
    const { component: Component, isLoggedIn, ...rest } = props;

    return (
        <Route
            {...rest}
            render={(routeProps) =>
                isLoggedIn ? (
                    <Component {...routeProps} />
                ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: routeProps.location }
                            }}
                        />
                    )
            }
        />
    );
};
