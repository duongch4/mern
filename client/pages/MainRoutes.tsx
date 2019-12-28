import React, { Component } from "react";
import {
    Route,
    Switch,
    Redirect,
} from "react-router-dom";

import { IntroPage } from "./intro/IntroPage";
import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";
import { AjaxHandler } from "../utils/AjaxHandler";
import { AuthPage } from "./auth/AuthPage";
import { PropsRoute } from "../utils/CustomRoute";
import { UserDoc } from "../../server/models/User";
import { AccountPage } from "./auth/AccountPage";
import { NotFoundPage } from "./404/NotFoundPage";

type MainStates = {
    currUser?: UserDoc;
};

export class MainRoutes extends Component<any, MainStates> {
    readonly state: Readonly<MainStates> = {
        currUser: undefined
    };

    componentDidMount = () => {
        this.getUser();
    }

    updateUser = (states: MainStates) => {
        this.setState(states);
    }

    getUser = async () => {
        try {
            const response = await AjaxHandler.getRequest("/api/account");
            this.setState({
                currUser: response.payload
            });
        }
        catch (err) {
            console.log(err);
            this.setState({
                currUser: undefined
            });
        }
    }

    render() {
        console.log(this.state);
        if (!this.state.currUser) {
            return this._renderNotLoggedIn();
        }
        else {
            return this._renderLoggedIn();
        }
    }

    _renderNotLoggedIn = (): React.ReactNode => {
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

    _renderLoggedIn = (): React.ReactNode => {
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
