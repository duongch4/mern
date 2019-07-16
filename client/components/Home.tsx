import React, { Component } from "react";

import homeImg from "../assets/png/titleImg.png";

export class Home extends Component<any, any> {
    render() {
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
