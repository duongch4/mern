import React from "react";

import { AjaxHandler } from "../../utils/AjaxHandler";
import { EmptyException, InvalidLengthException } from "../../communication/Exception";
import { AlertMessage } from "../utils/AlertMessage";
import { FormGroupText } from "./FormGroupText";
import { checkEmptyFields, checkPasswordLength } from "./FormCheck";

import Log from "../../utils/Log";
import { useModal } from "../../contexts/ModalContext";

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
        Log.trace("Submitting form to: ", props.postToUrl);
        const data = {
            email: state.valEmail,
            password: state.valPassword
        };

        try {
            const response = await AjaxHandler.postRequest(props.postToUrl, data);
            Log.info("YAY!!!");
            Log.trace(response);
            setState({
                ...state,
                message: response.message
            });
            window.location = window.location;
        }
        catch (err) {
            Log.error(`NAY: ${err}`);
            setState({
                ...state,
                message: err.message,
                valEmail: "",
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
                        ...state,
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
            <button type="submit" className="btn">{props.textButton}</button>
        </form>
    );
};
