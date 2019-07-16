import React, { ReactElement } from "react";
import { Modal, ModalProps } from "../utils/Modal";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export const LoginModal = (props: ModalProps) => {
    const title: string = "Log In to Access Site";
    const form = <LoginForm isClicked={props.isOpen} textButton="Login" postToUrl="/auth/login" />;
    return (
        <Modal
            id={props.id} isOpen={props.isOpen} toggle={props.toggle}
            title="Log In" body={getBody(title, form)} closeTitle="Close"
        />
    );
};

export const RegisterModal = (props: ModalProps) => {
    const title: string = "Create an account";
    const form = <RegisterForm isClicked={props.isOpen} textButton="Register" postToUrl="/auth/register" />;
    return (
        <Modal id={props.id} isOpen={props.isOpen} toggle={props.toggle}
            title="Register" body={getBody(title, form)} closeTitle="Close"
        />
    );
};

const getBody = (title: string, form: ReactElement): ReactElement => {
    return (
        <div>
            <p className="text-left">
                <strong>{title}</strong>
            </p>
            {form}
        </div>
    );
};
