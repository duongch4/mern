import * as React from "react";
import { withRouter } from "react-router-dom";
import { AuthModal } from "../components/auth/AuthModal";

export class Navbar extends React.Component {
    public render() {
        return (
            <div id="navigation">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container">
                        <a className="navbar-brand" href="#home">BCD<span className="sr-only">(current)</span></a>

                        <button
                            className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation"
                        >
                            <span className="fas fa-bars burger-icon" />
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item"><a className="nav-link" href="#profile">Profile</a></li>
                                <li className="nav-item"><a className="nav-link" href="#projects">Projects</a></li>
                                <li className="nav-item"><a className="nav-link" href="#contact">Contact</a></li>
                            </ul>
                        </div>
                        {/* <!-- Button trigger modal --> */}
                        <div>
                            <button
                                type="button" className="btn"
                                data-toggle="modal" data-target="#exampleModal"
                            >
                                Login
                            </button>
                            <AuthModal id="exampleModal" />
                        </div>
                        {/* <!-- Button trigger modal --> */}
                        <div>
                            <button
                                type="button" className="btn"
                                data-toggle="modal" data-target="#exampleModal2"
                            >
                                Register
                            </button>
                            <AuthModal id="exampleModal2" />
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}
