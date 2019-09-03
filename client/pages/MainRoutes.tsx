import React, { Component } from "react";
import {
    Route,
    Switch,
    Redirect,
} from "react-router-dom";

import { IntroPage } from "./intro/IntroPage";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { AjaxHandler } from "../components/utils/AjaxHandler";
import { AuthPage } from "./auth/AuthPage";
import { PropsRoute } from "../utils/CustomRoute";
import { UserDoc } from "../../server/models/User";
import { AuthPage2 } from "./auth/AuthPage2";
import { NotFoundPage } from "./404/NotFoundPage";

type MainStates = {
    currUser: UserDoc;
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
            const response = await AjaxHandler.getRequest("/account");
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
                <Navbar currUser={this.state.currUser} />
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
                <Navbar currUser={this.state.currUser} />
                <Switch>
                    <PropsRoute exact path={`/`} component={AuthPage} currUser={this.state.currUser} />
                    <Route path={`/aa/bb`} component={AuthPage2} />
                    {/* <Redirect to={"/"} /> */}
                    <Route component={NotFoundPage} />
                </Switch>
                <Footer />
            </div>
        );
    }
}
