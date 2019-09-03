import React, { Component } from "react";
import { LoginModal, RegisterModal } from "../components/auth/AuthModal";
import { UserDoc } from "../../server/models/User";

export type NavbarProps = {
    currUser: UserDoc;
};

export type NavbarStates = {
    isOpen: boolean;
};

export class Navbar extends Component<NavbarProps, NavbarStates> {
    readonly state: Readonly<NavbarStates> = {
        isOpen: false
    };

    _toggleModal = () => {
        this.setState(
            { isOpen: !this.state.isOpen }
        );
    }

    // componentDidMount = () => {
    //     console.log(this.props);
    // }

    // _handleClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    //     console.log("handleclick: ", (e.target as HTMLLIElement).id);
    //     switch ((e.target as HTMLLIElement).id) {
    //         case "account":
    //             this.props.history.push("/user/view/" + this.props.user._id);
    //             break;
    //         case "logout":
    //             this.props.history.push("/");
    //             this.props.logoutUser();
    //             break;
    //         default:
    //     }
    // };

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
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item"><a className="nav-link" href="#profile">Profile</a></li>
                                <li className="nav-item"><a className="nav-link" href="#projects">Projects</a></li>
                                <li className="nav-item"><a className="nav-link" href="#contact">Contact</a></li>
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
        return (
            <div className="navbar-nav">
                <li id="account" className="nav-dropdown-item">Account</li>
                <li id="logout" className="nav-dropdown-item">
                    <a className="nav-link" href="/auth/logout">Logout</a></li>
            </div>
        );
    }
}
