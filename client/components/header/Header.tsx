import React, { Component } from "react";
import { LoginModal, RegisterModal } from "./AuthModal";
import { UserDoc } from "../../../server/models/User";

export type HeaderProps = {
    currUser?: UserDoc;
};

export type HeaderStates = {
    isOpen: boolean;
};

export class Header extends Component<HeaderProps, HeaderStates> {
    readonly state: Readonly<HeaderStates> = {
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
                        <a className="navbar-brand" href="/">BCD<span className="sr-only">(current)</span></a>

                        <button
                            className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation"
                        >
                            <span className="fas fa-bars burger-icon" />
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item"><a className="nav-link" href="/">Profile</a></li>
                                <li className="nav-item"><a className="nav-link" href="/">Projects</a></li>
                                <li className="nav-item"><a className="nav-link" href="/">Contact</a></li>
                            </ul>
                            <div className="dropdown-divider"></div>
                            {this._renderTopRightCorner()}
                        </div>
                    </div>
                </nav>
            </div>
        );
    }

    _renderTopRightCorner = (): React.ReactNode => {
        if (!this.props.currUser) {
            return this._renderNotLoggedIn();
        }
        else {
            return this._renderLoggedIn();
        }
    }

    _renderNotLoggedIn = (): React.ReactNode => {
        return (
            <div className="navbar-nav">
                <div>
                    <button
                        type="button" className="btn" onClick={this._toggleModal}
                        data-toggle="modal" data-target="#loginModal"
                    >Log In</button>
                    <LoginModal id="loginModal" isOpen={this.state.isOpen} toggle={this._toggleModal} />
                </div>
                <div>
                    <button
                        type="button" className="btn" onClick={this._toggleModal}
                        data-toggle="modal" data-target="#registerModal"
                    >Register</button>
                    <RegisterModal id="registerModal" isOpen={this.state.isOpen} toggle={this._toggleModal} />
                </div>
            </div>
        );
    }

    _renderLoggedIn = (): React.ReactNode => {
        const user = this.props.currUser;
        if (user) {
            return (
                <div className="navbar-nav">
                    <li id="account" className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" data-toggle="dropdown">
                            <img className="avatar" src={user.profile.picture} alt={user.profile.firstName || user.email} />
                            <span>&emsp;</span>
                            <span>{user.profile.firstName || user.email}</span>
                        </a>
                        <ul className="dropdown-menu">
                            <li className="nav-item"><a className="nav-link" href="/account">My Account</a></li>
                            <li className="dropdown-divider"></li>
                            <li className="nav-item"><a className="nav-link" href="/api/logout">Logout</a></li>
                        </ul>
                    </li>
                </div>
            );
        }
    }
}
