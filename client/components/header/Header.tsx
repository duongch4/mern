import React, { Component } from "react";
import { LoginModal, RegisterModal } from "./AuthModal";
import { UserPayload } from "../../pages/MainRoutes";
import { Link } from "react-router-dom";

export type HeaderProps = {
    currUser?: UserPayload;
};

export type HeaderStates = {
    isOpen: boolean;
};

export class Header extends Component<HeaderProps, HeaderStates> {
    public readonly state: Readonly<HeaderStates> = {
        isOpen: false
    };

    private toggleModal = () => {
        this.setState(
            { isOpen: !this.state.isOpen }
        );
    }

    public render() {
        return (
            <div id="navigation">
                <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
                    <div className="container">
                        <Link className="navbar-brand" to="/">BCD<span className="sr-only">(current)</span></Link>

                        <button
                            className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation"
                        >
                            <span className="fas fa-bars burger-icon" />
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item"><Link className="nav-link" to="/">Profile</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/">Projects</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/">Contact</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/status">Status</Link></li>
                            </ul>
                            <div className="dropdown-divider"></div>
                            {this.renderTopRightCorner()}
                        </div>
                    </div>
                </nav>
            </div>
        );
    }

    private renderTopRightCorner = (): React.ReactNode => {
        if (!this.props.currUser) {
            return this.renderNotLoggedIn();
        }
        else {
            return this.renderLoggedIn(this.props.currUser);
        }
    }

    private renderNotLoggedIn = (): React.ReactNode => {
        return (
            <div className="navbar-nav">
                <div>
                    <button
                        type="button" className="btn" onClick={this.toggleModal}
                        data-toggle="modal" data-target="#loginModal"
                    >Log In</button>
                    <LoginModal id="loginModal" isOpen={this.state.isOpen} toggle={this.toggleModal} />
                </div>
                <div>
                    <button
                        type="button" className="btn" onClick={this.toggleModal}
                        data-toggle="modal" data-target="#registerModal"
                    >Register</button>
                    <RegisterModal id="registerModal" isOpen={this.state.isOpen} toggle={this.toggleModal} />
                </div>
            </div>
        );
    }

    private renderLoggedIn = (user: UserPayload): React.ReactNode => {
        return (
            <div className="navbar-nav">
                <li id="account" className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" data-toggle="dropdown">
                        <img className="avatar" src={user.profile.picture}
                            alt={user.profile.firstName || user.email} />
                        <span>&emsp;</span>
                        <span>{user.profile.firstName || user.email}</span>
                    </a>
                    <ul className="dropdown-menu">
                        {/* Use <Link> so that the page is not refreshed which causes constant not logged in state! */}
                        <li className="nav-item"><Link className="nav-link" to="/account">My Account</Link></li>
                        <li className="dropdown-divider"></li>
                        <li className="nav-item"><a className="nav-link" href="/api/logout">Logout</a></li>
                    </ul>
                </li>
            </div>
        );
    }
}
