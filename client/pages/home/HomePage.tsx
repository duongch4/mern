import React, { Component } from "react";

import { Home } from "../../components/home/Home";
import { Notes } from "../../components/note/Notes";

export class HomePage extends Component<any, any> {
    public render() {
        return (
            <div id="home-page">
                <Home />
                <Notes />
            </div>
        );
    }
}
