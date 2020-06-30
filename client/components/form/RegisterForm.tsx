import React from "react";

import { AjaxHandler } from "../../utils/AjaxHandler";
import { EmptyException, InvalidLengthException, NotMatchException } from "../../communication/Exception";
import { AlertMessage } from "../utils/AlertMessage";
import { FormGroupText } from "./FormGroupText";
import { checkEmptyFields, checkPasswordLength, checkConfirmPassword } from "./FormCheck";
import { LoginFormProps, LoginFormStates } from "./LoginForm";

import Log from "../../utils/Log";
import { useModal } from "../../contexts/ModalContext";

export type RegisterFormProps = LoginFormProps;

export type RegisterFormStates = {
    valConfirmPassword: string;
} & LoginFormStates;

const initialState: RegisterFormStates = {
    message: "",
    valEmail: "",
    valPassword: "",
    valConfirmPassword: "",
};

export const RegisterForm = (props: RegisterFormProps) => {
    const [state, setState] = React.useState<RegisterFormStates>(initialState);
    const modalState = useModal().state;

    React.useEffect(() => {
        return () => setState(initialState); // Return a function => Cleanup work
    }, [modalState.isOpen]);

    const onInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [field]: event.target.value
        });
    };

    const submit = async (): Promise<any> => {
        Log.info("Submitting form to: ", props.postToUrl);
        const data = {
            email: state.valEmail,
            password: state.valPassword,
            confirmPassword: state.valConfirmPassword
        };

        try {
            const response = await AjaxHandler.postRequest(props.postToUrl, data);
            Log.info("YAY!!!");
            Log.trace(response);
            setState({
                ...state,
                message: response.message
            });
            window.location.href = response.extra ? response.extra.redirect : "/";
        }
        catch (err) {
            Log.error(`NAY: ${err}`);
            setState({
                message: err.message,
                valEmail: "",
                valPassword: "",
                valConfirmPassword: "",
            });
        }
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        Log.info("submit");
        event.preventDefault();
        try {
            checkEmptyFields([state.valEmail, state.valPassword]);
            checkPasswordLength(state.valPassword.length);
            checkConfirmPassword(state.valPassword, state.valConfirmPassword);
            submit();
        }
        catch (err) {
            switch (true) {
                case err instanceof EmptyException:
                    setState({
                        ...state,
                        message: err.message
                    });
                    break;
                case err instanceof InvalidLengthException:
                    setState({
                        ...state,
                        valPassword: "",
                        valConfirmPassword: "",
                        message: err.message
                    });
                    break;
                case err instanceof NotMatchException:
                    setState({
                        ...state,
                        valPassword: "",
                        valConfirmPassword: "",
                        message: err.message
                    });
                    break;
                default:
                    setState({
                        valEmail: "",
                        valPassword: "",
                        valConfirmPassword: "",
                        message: err.message
                    });
                    break;
            }
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <AlertMessage message={state.message} />
            <FormGroupText
                type={"email"} id={"register-id-email"} value={state.valEmail}
                placeholder={"Enter Email"} onChange={onInputChange("valEmail")}
            />
            <FormGroupText
                type={"password"} id={"register-id-password"} value={state.valPassword}
                placeholder={"Password"} onChange={onInputChange("valPassword")}
            />
            <FormGroupText
                type={"password"} id={"register-id-confirmPassword"} value={state.valConfirmPassword}
                placeholder={"Confirm Password"} onChange={onInputChange("valConfirmPassword")}
            />
            <button type="submit" className="btn">{props.textButton}</button>
        </form>
    );
};
