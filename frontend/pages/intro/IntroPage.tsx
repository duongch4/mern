import * as React from "react";

import { NavigationBar } from "../../components/NavigationBar";
import { Home } from "../../components/Home";
import { Footer } from "../../components/Footer";

export class IntroPage extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <div className="App">

                <NavigationBar />
                <Home />
                <Footer />

            </div>
        );
    }
}
