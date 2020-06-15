import React, { Component } from "react";

import { Home } from "../../components/home/Home";
import { Notes } from "../../components/note/Notes";
import { ProfileInfo } from "../../components/account/ProfileInfo";

import { UserPayload } from "../../pages/MainRoutes";

type HomePageProps = {
    currUser: UserPayload;
};

export class HomePage extends Component<HomePageProps, any> {
    public render() {
        return (
            <div id="home-page">
                {
                    this.props.currUser ? <ProfileInfo currUser={this.props.currUser} /> : undefined
                }
                <Home />
                <Notes />
            </div>
        );
    }
}
