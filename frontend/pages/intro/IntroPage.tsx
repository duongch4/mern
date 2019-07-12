import * as React from "react";

import { Navbar } from "../../components/Navbar";
import { Home } from "../../components/Home";
import { Footer } from "../../components/Footer";

export class IntroPage extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <div className="App">

                <Navbar />
                <Home />
                <Footer />

            </div>
        );
    }
}
