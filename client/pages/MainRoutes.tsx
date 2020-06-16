import React, { Component } from "react";
import {
    Route,
    Switch,
    Redirect as _,
} from "react-router-dom";


import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";
import { AjaxHandler } from "../utils/AjaxHandler";
import { PropsRoute, PrivateRoute } from "../utils/CustomRoute";

import { HomePage } from "./home/HomePage";
import { AccountPage } from "./account/AccountPage";
import { StatusPage } from "./status/StatusPage";
import { NotFoundPage } from "./notfound/NotFoundPage";

import { UserPayload } from "../models/User";

import Log from "../utils/Log";

type MainStates = {
    currUser?: UserPayload;
};

export class MainRoutes extends Component<any, MainStates> {
    public readonly state: Readonly<MainStates> = {
        currUser: undefined
    };

    public componentDidMount = () => {
        this.getUser();
    }

    private updateUser = (states: MainStates) => {
        this.setState(states);
    }

    private getUser = async () => {
        try {
            const response = await AjaxHandler.getRequest("/api/account");
            this.setState({
                currUser: response.payload
            });
        }
        catch (err) {
            Log.error(err);
            this.setState({
                currUser: undefined
            });
        }
    }

    public render() {
        return (
            <div id="main-routes">
                <Header currUser={this.state.currUser} />
                <Switch>
                    {/* <Route exact path={`/`} component={AccountPage} /> */}
                    <PropsRoute exact path={`/`} component={HomePage} currUser={this.state.currUser} />
                    <PrivateRoute
                        isLoggedIn={this.state.currUser} redirectTo={`/`}
                        path={`/account`} component={AccountPage} currUser={this.state.currUser}
                    />
                    <Route path={`/status`} component={StatusPage} />
                    <Route component={NotFoundPage} />
                </Switch>
                <Footer />
            </div>
        );
    }
}
