import * as React from "react";
import { withRouter } from "react-router-dom";


export class Navbar extends React.Component {
    public render() {
        return (
            <div id="navigation">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
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
                    </div>
                </nav>
            </div>
        );
    }
}

/*----------------------
    NAV COMPONENT:
    if user is logged in, shows add review button and edit user options. 
    Otherwise, shows option to log in.
------------------------*/

// import React, { Component } from "react";
// import { withRouter } from "react-router-dom";
// import Button from "../atoms/Button";
// import { Modal, ModalHeader, ModalBody } from "reactstrap";
// import logo from "../../images/logo.svg"
// import defaultAvatar from "../../images/default-avatar.png";
// // import githubLogin from "../../images/github-login.svg";
// import facebookLogin from "../../images/facebook-login.svg";
// import googleLogin from "../../images/google-login.svg";
// import LoginForm from "./LoginForm";
// import RegisterForm from "./RegisterForm";


// class Nav extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             dropdown: false,
//             items: ["Profile", "Logout"],
//             showModal: false
//         };

//         this.toggleModal = this.toggleModal.bind(this);
//     }

//     toggleModal() {
//         this.setState({
//             showModal: !this.state.showModal
//         });
//     }

//     handleClick = e => {
//         console.log("handleclick: ", e.target.id);
//         switch (e.target.id) {
//             case "add-review":
//                 this.props.history.push("/review/add/");
//                 break;
//             case "profile":
//                 this.props.history.push("/user/view/" + this.props.user._id);
//                 break;
//             case "logout":
//                 this.props.history.push("/");
//                 this.props.logoutUser();
//                 break;
//             case "navbar-brand":
//                 this.props.history.push("/");
//                 break;
//             case "dashboard":
//                 this.props.history.push("/dashboard");
//                 break;
//             case "tmdb":
//                 this.props.history.push("/tmdb");
//                 break;
//             default:
//         }
//     };
//     render() {
//         console.log("Nav", this.props);
//         return (
//             <div>
//                 <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//                     <a id="navbar-brand" className="navbar-brand" onClick={this.handleClick}>
//                         <img id="navbar-brand" className="logo" src={logo} alt="M-Geeks" />
//                     </a>

//                     <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//                         <span className="fas fa-bars burger-icon" />
//                     </button>

//                     <div className="collapse navbar-collapse justify-content-between">
//                         <div>
//                             {this.props.user ?
//                                 <ul className="navbar-nav mr-auto">
//                                     <li className="nav-item">
//                                         <Button label="Add a Review" id="add-review" redirect={`/review/add`} />
//                                     </li>
//                                     <li className="nav-item">
//                                         <Button label="Browse Movies" id="tmdb" redirect={`/tmdb`} />
//                                     </li>
//                                 </ul> :
//                                 null
//                                 // <Button label="Popular" id="tmdb" redirect="/tmdb" />
//                             }
//                         </div>

//                         <div>
//                             <ul className="nav navbar-nav">
//                                 {this.props.user ?
//                                     <li className="dropdown">
//                                         <img id="avatar" alt="avatar" className="nav-avatar-img dropdown-toggle" data-toggle="dropdown" src={this.props.user.avatar} onError={e => {
//                                             console.log("no avatar", e.target.src);
//                                             e.target.src = defaultAvatar;
//                                         }} width="50px" height="50px" />
//                                         <ul className="dropdown-menu dropdown-menu-right">
//                                             {this.state.items.map(item => {
//                                                 return (
//                                                     <li key={item} className="nav-dropdown-item" id={item.toLowerCase()} onClick={this.handleClick}>
//                                                         <span id={item.toLowerCase()}>{item}</span>
//                                                     </li>
//                                                 );
//                                             })}
//                                         </ul>
//                                     </li> :
//                                     <li>
//                                         <button className="btn" onClick={this.toggleModal}>
//                                             Login/Register
//                     </button>

//                                         <Modal isOpen={this.state.showModal} toggle={this.toggleModal} className={this.props.className}>
//                                             <ModalHeader toggle={this.toggleModal}>
//                                                 Login/Register
//                       </ModalHeader>
//                                             <ModalBody className="text-center">
//                                                 {/* <a href={`${window.location.origin}/auth/github/`}>
//                           <img src={githubLogin} className="social-login" alt="Sign in with GitHub" />
//                         </a> */}
//                                                 <a href={`${window.location.origin}/auth/google/`}>
//                                                     <img src={googleLogin} className="social-login" alt="Sign in with Google" />
//                                                 </a>
//                                                 <a href={`${window.location.origin}/auth/facebook/`}>
//                                                     <img src={facebookLogin} className="social-login" alt="Sign in with Facebook." />
//                                                 </a>
//                                                 <p>
//                                                     <strong>Sign in with your email</strong>
//                                                 </p>
//                                                 <LoginForm submitWord="Login" url="/auth/login" />
//                                                 <p>
//                                                     <strong>Don"t have an account? Register with us</strong>
//                                                 </p>
//                                                 <RegisterForm submitWord="Register" url="/auth/register" />
//                                             </ModalBody>
//                                         </Modal>
//                                     </li>}
//                             </ul>
//                         </div>
//                     </div>
//                 </nav>

//                 <div className="collapse navbar-collapse" id="navbarSupportedContent">
//                     {this.props.user ?
//                         <ul className="navbar-nav mr-auto">
//                             <li id="add-review" className="nav-dropdown-item" onClick={this.handleClick}>Add a Review</li>
//                             <li id="profile" className="nav-dropdown-item" onClick={this.handleClick}>Profile</li>
//                             {/* <li id="dashboard" className="nav-dropdown-item" onClick={this.handleClick}>Dashboard</li> */}
//                             <li id="tmdb" className="nav-dropdown-item" onClick={this.handleClick}>Browse Movies</li>
//                             <li id="logout" className="nav-dropdown-item" onClick={this.handleClick}>Logout</li>
//                         </ul> :
//                         <ul className="navbar-nav mr-auto">
//                             <li className="nav-dropdown-item" onClick={this.toggleModal}>Login/Register</li>
//                         </ul>}
//                 </div>

//             </div>
//         );
//     }
// }

// export default withRouter(Nav);

