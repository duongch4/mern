import React from "react";
import { Modal, ModalProps } from "./Modal";
import { LoginForm } from "../form/LoginForm";
// import { RegisterForm } from "../form/RegisterForm";

const getBody = (title: string, form: React.ReactElement): React.ReactElement => {
    return (
        <div>
            <p className="text-left">
                <strong>{title}</strong>
            </p>
            {form}
        </div>
    );
};

export const LoginModal = (props: ModalProps): React.ReactElement => {
    const title: string = "Log In to Access Site";
    const form = <LoginForm textButton="Login" postToUrl="/api/login" />;
    return (
        <Modal
            id={props.id}
            title="Log In" body={getBody(title, form)} closeTitle="Close"
        />
    );
};

// export const RegisterModal = (props: ModalProps): React.ReactElement => {
//     const title: string = "Create an account";
//     const form = <RegisterForm isClicked={props.isOpen} textButton="Register" postToUrl="/api/register" />;
//     return (
//         <Modal id={props.id} isOpen={props.isOpen} toggle={props.toggle}
//             title="Register" body={getBody(title, form)} closeTitle="Close"
//         />
//     );
// };
