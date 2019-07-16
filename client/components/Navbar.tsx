import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { LoginModal, RegisterModal } from "../components/auth/AuthModal";

export type NavbarStates = {
    isOpen: boolean;
};

export class Navbar extends Component<any, NavbarStates> {
    readonly state: Readonly<NavbarStates> = {
        isOpen: false
    };

    _toggleModal = () => {
        this.setState(
            { isOpen: !this.state.isOpen }
        );
    }

    render() {
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
                                type="button" className="btn" onClick={this._toggleModal}
                                data-toggle="modal" data-target="#loginModal"
                            >
                                Log In
                            </button>
                            <LoginModal id="loginModal" isOpen={this.state.isOpen} toggle={this._toggleModal} />
                        </div>
                        {/* <!-- Button trigger modal --> */}
                        <div>
                            <button
                                type="button" className="btn" onClick={this._toggleModal}
                                data-toggle="modal" data-target="#registerModal"
                            >
                                Register
                            </button>
                            <RegisterModal id="registerModal" isOpen={this.state.isOpen} toggle={this._toggleModal} />
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}
