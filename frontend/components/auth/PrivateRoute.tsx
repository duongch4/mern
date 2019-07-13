import * as React from "react";
import {
    Route,
    Redirect,
    RouteProps,
} from "react-router-dom";

interface IPrivateRouteProps extends RouteProps {
    component: any;
    isLoggedIn: boolean;
}

export const PrivateRoute = (props: IPrivateRouteProps) => {
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
