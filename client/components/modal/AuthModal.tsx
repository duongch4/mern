import React from "react";
import { Modal } from "./Modal";
import { LoginForm } from "../form/LoginForm";
import { RegisterForm } from "../form/RegisterForm";

const getBody = (title: string, form: React.ReactElement): React.ReactElement => (
    <div>
        <p className="text-left">
            <strong>{title}</strong>
        </p>
        {form}
    </div>
);

export const AuthModal = ({ id }: { id: string }): React.ReactElement => {
    const titleLogin: string = "Log In To Access Site";
    const titleRegister: string = "Create An Account";
    const formLogin = <LoginForm textButton="Login" postToUrl="/api/login" />;
    const formRegister = <RegisterForm textButton="Register" postToUrl="/api/register" />;
    return (
        <Modal
            id={id} closeTitle="Close"
            titles={["Log In", "Register"]}
            bodies={[getBody(titleLogin, formLogin), getBody(titleRegister, formRegister)]}
        />
    );
};
