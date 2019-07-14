import * as React from "react";
import { Modal, IModalProps } from "../utils/Modal";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export const AuthModal: React.FunctionComponent<IModalProps> = ({ id }) => {
    return (
        <Modal id={id} title="Login/Register" body={getBody()} closeTitle="Close" />
    );
};

const getBody = (): JSX.Element => {
    return (
        <div>
            <p className="text-left">
                <strong>Sign in with your email</strong>
            </p>
            <LoginForm textButton="Login" postToUrl="/auth/login" />
            <p className="text-left">
                <strong>Register</strong>
            </p>
            <RegisterForm textButton="Register" postToUrl="/auth/register" />
        </div>
    );
};
