import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from "react-router-dom";

import { PrivateRoute } from "./PrivateRoute";

const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb: any) {
        this.isAuthenticated = true;
        setTimeout(cb, 100);
    },
    signout(cb: any) {
        this.isAuthenticated = false;
        setTimeout(cb, 100);
    }
};

const Public = () => <h3>Public</h3>;
const Protected = () => <h3>Protected</h3>;

class Login extends Component<any, any> {
    state = {
        redirectToReferrer: false
    };
    login = () => {
        fakeAuth.authenticate(() => {
            this.setState(() => ({
                redirectToReferrer: true
            }));
        });
    }
    render() {
        const { from } = this.props.location.state || { from: { pathname: "/" } };
        const { redirectToReferrer } = this.state;

        if (redirectToReferrer === true) {
            return <Redirect to={from} />;
        }

        return (
            <div>
                <p>You must log in to view the page</p>
                <button onClick={this.login}>Log in</button>
            </div>
        );
    }
}

const AuthButton = withRouter(({ history }) => (
    fakeAuth.isAuthenticated ? (
        <p>
            Welcome! <button onClick={() => {
                fakeAuth.signout(() => history.push("/"));
            }}>Sign out</button>
        </p>
    ) : (
            <p>You are not logged in.</p>
        )
));

export default function AuthExample() {
    return (
        <Router>
            <div>
                <AuthButton />
                <ul>
                    <li><Link to="/">Public Page</Link></li>
                    <li><Link to="/protected">Protected Page</Link></li>
                </ul>
                <Route path="/" component={Public} />
                <Route path="/login" component={Login} />
                <PrivateRoute isLoggedIn={fakeAuth.isAuthenticated} path="/protected" component={Protected} />
            </div>
        </Router>
    );
}
