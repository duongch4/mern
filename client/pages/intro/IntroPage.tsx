import React, { Component } from "react";

import { Home } from "../../components/home/Home";
import { Notes } from "../../components/note/Notes";

export class IntroPage extends Component<any, any> {
    public render() {
        return (
            <div id="intro-page">
                <Home />
                <Notes />
            </div>
        );
    }
}
