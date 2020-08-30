import React from "react";
import { Link } from "react-router-dom";

import { AuthModal } from "../modal/AuthModal";
import { useUserAuthenticated } from "../../contexts/UserContext";

import { useModal } from "../../contexts/ModalContext";

type HeaderProps = {
    TopRightCorner: () => React.ReactElement;
};

export const Header = (props: HeaderProps) => (
    <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
            <Link className="navbar-brand" to="/">BCD<span className="sr-only">(current)</span></Link>

            <div className="navbar__burger">
                <button
                    className="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#navbar__support-content" aria-controls="navbar__support-content"
                    aria-expanded="false" aria-label="Toggle navigation"
                >
                    <span className="fas fa-bars navbar__burger-icon" />
                </button>
            </div>
            <div id="navbar__support-content" className="collapse navbar-collapse">
                <ul className="navbar-nav mr-auto text-upper">
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
);

export const AuthenticatedCorner = () => {
    const { user } = useUserAuthenticated();
    return (
        <div className="navbar-nav navbar-nav--authenticated">
            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" data-toggle="dropdown">
                    <img className="navbar-nav--authenticated-avatar" src={user.profile.picture}
                        alt={user.profile.firstName || user.email} />
                    <span>&emsp;</span>
                    <span>{user.profile.firstName || user.email}</span>
                </a>
                <ul className="dropdown-menu navbar-nav--authenticated-dropdown-menu">
                    {/* Use <Link> so that the page is not refreshed which causes constant not logged in state! */}
                    <li className="nav-item"><Link className="nav-link" to={`/users/${user.id}`}>My Account</Link></li>
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
