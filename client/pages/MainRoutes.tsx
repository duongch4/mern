import React, { Component } from "react";
import {
    Route,
    Switch,
    Redirect as _,
} from "react-router-dom";

import { IntroPage } from "./intro/IntroPage";
import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";
import { AjaxHandler } from "../utils/AjaxHandler";
import { AuthPage } from "./auth/AuthPage";
import { PropsRoute } from "../utils/CustomRoute";
import { AccountPage } from "./auth/AccountPage";
import { NotFoundPage } from "./404/NotFoundPage";
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
        if (!this.state.currUser) {
            return this.renderNotLoggedIn();
        }
        else {
            return this.renderLoggedIn();
        }
    }

    private renderNotLoggedIn = (): React.ReactNode => {
        return (
            <div id="main-routes">
                <Header currUser={this.state.currUser} />
                <Switch>
                    <Route exact path={`/`} component={IntroPage} />
                    <Route component={NotFoundPage} />
                </Switch>
                <Footer />
            </div>
        );
    }

    private renderLoggedIn = (): React.ReactNode => {
        return (
            <div id="main-routes">
                <Header currUser={this.state.currUser} />
                <Switch>
                    <PropsRoute exact path={`/`} component={AuthPage} currUser={this.state.currUser} />
                    <Route path={`/account`} component={AccountPage} />
                    {/* <Redirect to={"/"} /> */}
                    <Route component={NotFoundPage} />
                </Switch>
                <Footer />
            </div>
        );
    }
}
