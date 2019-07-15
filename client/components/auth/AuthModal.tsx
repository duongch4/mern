import * as React from "react";
import { Modal, IModalProps } from "../utils/Modal";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export const LoginModal: React.FunctionComponent<IModalProps> = ({ id, isOpen, toggle }) => {
    const title: string = "Log In to Access Site";
    const form: JSX.Element = <LoginForm isClicked={isOpen} textButton="Login" postToUrl="/auth/login" />;
    return (
        <Modal id={id} isOpen={isOpen} toggle={toggle} title="Log In" body={getBody(title, form)} closeTitle="Close" />
    );
};

export const RegisterModal: React.FunctionComponent<IModalProps> = ({ id, isOpen, toggle }) => {
    const title: string = "Create an account";
    const form: JSX.Element = <RegisterForm isClicked={isOpen} textButton="Register" postToUrl="/auth/register" />;
    return (
        <Modal id={id} isOpen={isOpen} toggle={toggle}
            title="Register" body={getBody(title, form)} closeTitle="Close"
        />
    );
};

const getBody = (title: string, form: JSX.Element): JSX.Element => {
    return (
        <div>
            <p className="text-left">
                <strong>{title}</strong>
            </p>
            {form}
        </div>
    );
};
