import React, { Component } from "react";
import {
    Route,
    Switch,
    Redirect as _,
} from "react-router-dom";

import { HomePage } from "./home/HomePage";
import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";
import { AjaxHandler } from "../utils/AjaxHandler";
import { PropsRoute } from "../utils/CustomRoute";
import { AccountPage } from "./account/AccountPage";
import { StatusPage } from "./status/StatusPage";
import { NotFoundPage } from "./notfound/NotFoundPage";
import Log from "../utils/Log";

export type UserProfile = {
    firstName: string;
    lastName: string;
    gender: string;
    location: string;
    website: string;
    picture: string;
};

export type UserPayload = {
    id: string;
    email: string;
    facebook: string;
    profile: UserProfile;
};

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
        Log.trace(this.state);
        return (
            <div id="main-routes">
                <Header currUser={this.state.currUser} />
                <Switch>
                    <PropsRoute exact path={`/`} component={HomePage} currUser={this.state.currUser} />
                    <Route path={`/account`} component={AccountPage} />
                    <Route path={`/status`} component={StatusPage} />
                    <Route component={NotFoundPage} />
                </Switch>
                <Footer />
            </div>
        );
    }
}
