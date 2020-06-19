import React from "react";
import { Link } from "react-router-dom";

import { AuthModal } from "../modal/AuthModal";
import { useUserAuthenticated } from "../../contexts/UserContext";

import { useModal } from "../../contexts/ModalContext";

type HeaderProps = {
    TopRightCorner: () => React.ReactElement;
};

export const Header = (props: HeaderProps) => (
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
                    {props.TopRightCorner()}
                </div>
            </div>
        </nav>
    </div>
);

export const AuthenticatedCorner = () => {
    const user = useUserAuthenticated().state;
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
};

export const UnauthenticatedCorner = () => {
    const { state, setState } = useModal();
    const toggleButton = () => setState({ isOpen: !state.isOpen });
    const id = "auth-modal";
    return (
        <div className="navbar-nav">
            <div>
                <button
                    type="button" className="btn" onClick={toggleButton}
                    data-toggle="modal" data-target={`#${id}`}
                >Log In / Register</button>
                <AuthModal id={id} />
            </div>
        </div>
    );
};
