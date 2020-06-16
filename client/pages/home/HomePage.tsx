import React from "react";

import { Home } from "../../components/home/Home";
import { Notes } from "../../components/note/Notes";
import { ProfileInfo } from "../../components/account/ProfileInfo";

import { UserPayload } from "../../models/User";

type HomePageProps = {
    currUser: UserPayload;
};

export const HomePage = (props: HomePageProps) => {
    return (
        <div id="home-page" className="container-fluid container-main text-center">
            {
                props.currUser ? <ProfileInfo currUser={props.currUser} /> : undefined
            }
            <Home />
            <Notes />
        </div>
    );
};
