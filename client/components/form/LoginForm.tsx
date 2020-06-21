import React from "react";

import { TResponse } from "../../communication/TResponse";
import { EmptyException, InvalidLengthException } from "../../communication/Exception";

import { AjaxHandler } from "../../utils/AjaxHandler";
import { AlertMessage } from "../utils/AlertMessage";

import { FormGroupText } from "./FormGroupText";
import { checkEmptyFields, checkPasswordLength } from "./FormCheck";

import { useModal } from "../../contexts/ModalContext";
import { UserPayload } from "../../models/User";

import Log from "../../utils/Log";

export type LoginFormProps = {
    textButton: string;
    postToUrl: string;
};

export type LoginFormStates = {
    message: string;
    valEmail: string;
    valPassword: string;
};

const initialState: LoginFormStates = {
    message: "",
    valEmail: "",
    valPassword: ""
};

export const LoginForm = (props: LoginFormProps) => {
    const [state, setState] = React.useState<LoginFormStates>(initialState);
    const { state: modalState } = useModal();

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
        Log.trace("Submitting form to: ", props.postToUrl);
        const data = {
            email: state.valEmail,
            password: state.valPassword
        };

        try {
            const response = await AjaxHandler.postRequest(props.postToUrl, data) as TResponse<UserPayload>;
            Log.info("YAY!!!");
            Log.trace(response);
            setState({
                ...state,
                message: response.message
            });
            window.location.reload();
        }
        catch (err) {
            Log.error(`NAY: ${err}`);
            setState({
                ...state,
                message: err.message,
                valPassword: ""
            });
        }
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            checkEmptyFields([state.valEmail, state.valPassword]);
            checkPasswordLength(state.valPassword.length);
        }
        catch (err) {
            switch (true) {
                case err instanceof EmptyException:
                    Log.error(err);
                    setState({
                        ...state,
                        message: err.message
                    });
                    return;
                case err instanceof InvalidLengthException:
                    setState({
                        ...state,
                        valPassword: "",
                        message: err.message
                    });
                    return;
                default:
                    setState({
                        valEmail: "",
                        valPassword: "",
                        message: err.message
                    });
                    return;
            }
        }
        Log.info(state);
        submit();
    };

    return (
        <form onSubmit={onSubmit}>
            <AlertMessage message={state.message} />
            <FormGroupText
                type={"email"} id={"login-id-email"} value={state.valEmail}
                placeholder={"Enter Email"} onChange={onInputChange("valEmail")}
                smallHelpId={"email-small-help"}
                smallHelp={"We'll never share your email with anyone else. LIES!!"}
            />
            <FormGroupText
                type={"password"} id={"login-id-password"} value={state.valPassword}
                placeholder={"Password"} onChange={onInputChange("valPassword")}
            />
            <button type="submit" className="btn">
                {props.textButton}
            </button>
        </form>
    );
};
