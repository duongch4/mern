import React from "react";

import { Home } from "../../components/home/Home";
import { Notes } from "../../components/note/Notes";

export const UnauthenticatedHomePage = () => {
    return (
        <div id="home-page" className="container-fluid container-main text-center">
            <Home />
            <Notes />
        </div>
    );
};
