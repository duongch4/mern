import * as React from "react";

import * as homeImg from "../assets/png/titleImg.png";

export class Home extends React.Component<any, any> {
    public render() {
        return (
            <div id="home" className="container-fluid">
                <div className="row">
                    <div className="col-md-4 img-sect d-none d-md-block">
                        <img src={homeImg} className="home-img img-fluid" alt="HomeImage" />
                    </div>
                </div>
            </div>
        );
    }
}
