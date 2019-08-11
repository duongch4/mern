import React, { Component } from "react";
import {
    Route,
    Switch,
} from "react-router-dom";

import { IntroPage } from "./intro/IntroPage";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

type MainProps = {
    user: string;
};

type MainStates = {
    urlApp: string;
};

export class MainRoutes extends Component<MainProps, MainStates> {
    readonly state: Readonly<MainStates> = {
        urlApp: process.env.REACT_APP_APPURL || window.location.origin
    };

    render() {
        return (
            <div>
                <Navbar user={this.props.user} />
                <Switch>
                    <Route
                        path={`/`}
                        component={IntroPage}
                    />
                    {/* <Route
                    path={`/the-second-route`}
                    component={Contact}
                /> */}
                </Switch>
                <Footer />
            </div>
        );
    }
}
