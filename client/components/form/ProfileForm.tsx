import React from "react";

import { AjaxHandler, AjaxHandlerAxios } from "../../utils/AjaxHandler";
import { AlertMessage } from "../utils/AlertMessage";
import { FormGroupText } from "./FormGroupText";
import { FormGroupRadio } from "./FormGroupRadio";
import { useUserAuthenticated } from "../../contexts/UserContext";

import Log from "../../utils/Log";

export type ProfileFormStates = {
    message: string;
    email: string;
    emailVerified: boolean;
    firstName: string;
    lastName: string;
    gender: string;
    location: string;
    website: string;
};

export const ProfileForm = () => {
    const { user, setUser } = useUserAuthenticated();
    const urlProfile = `/api/users/${user.id}/profile`;
    const urlEmailVerification = `/api/users/${user.id}/verify`;
    const textButton = "Update Profile";

    const [state, setState] = React.useState({
        message: "",
        email: user.email,
        emailVerified: user.emailVerified,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        gender: user.profile.gender,
        location: user.profile.location,
        website: user.profile.website
    });

    const onInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            message: "",
            [field]: event.target.value
        });
    };

    const submit = async (): Promise<any> => {
        Log.trace("Submitting form to: ", urlProfile);
        const data = {
            email: state.email,
            firstName: state.firstName,
            lastName: state.lastName,
            gender: state.gender,
            location: state.location,
            website: state.website
        };

        try {
            const response = await AjaxHandler.putRequest(urlProfile, data);
            Log.trace("YAY!!!");
            Log.trace(response);
            setState({
                ...state,
                emailVerified: response.payload.emailVerified,
                message: response.message
            });
            setUser({
                ...user,
                email: state.email,
                emailVerified: state.emailVerified,
                profile: {
                    ...user.profile,
                    firstName: state.firstName,
                    lastName: state.lastName,
                    gender: state.gender,
                    location: state.location,
                    website: state.website
                }
            });
        }
        catch (err) {
            Log.error(`NAY: ${err}`);
            setState({
                ...state,
                message: err.message,
            });
        }
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submit();
    };

    const verifyEmail = async () => {
        try {
            const response = await AjaxHandlerAxios.getRequest(urlEmailVerification);
            Log.info(response);
            setState({
                ...state,
                message: response.message
            });
        }
        catch (err) {
            Log.error(err);
            setState({
                ...state,
                message: err.message
            });
        }
    };

    const EmailVerification = () => (
        <div className="offset-sm-3 col-sm-5 pl-3">
            {
                state.emailVerified ?
                    <div className="email-verification font-italic text-success">Verified</div> :
                    <div className="email-verification">
                        <span className="font-italic text-danger">Unverified: </span>
                        <a className="font-italic text-underline" onClick={verifyEmail}>Send verification email</a>
                    </div>
            }
        </div>
    );

    return (
        <form onSubmit={onSubmit}>
            <AlertMessage message={state.message} />
            <FormGroupText
                type={"email"} id={"profile-id-email"} value={state.email}
                onChange={onInputChange("email")}
                label={"Email"}
                smallHelpDiv={EmailVerification()}
                required={true}
            />
            <FormGroupText
                type={"text"} id={"profile-id-firstName"} value={state.firstName}
                onChange={onInputChange("firstName")}
                label={"First Name"}
            />
            <FormGroupText
                type={"text"} id={"profile-id-lastName"} value={state.lastName}
                onChange={onInputChange("lastName")}
                label={"Last Name"}
            />
            <FormGroupText
                type={"text"} id={"profile-id-location"} value={state.location}
                onChange={onInputChange("location")}
                label={"Location"}
            />
            <FormGroupText
                type={"text"} id={"profile-id-website"} value={state.website}
                onChange={onInputChange("website")}
                label={"Website"}
            />
            <FormGroupRadio
                label="Gender" values={["Male", "Female", "Other"]}
                currValue={state.gender} onChange={onInputChange("gender")}
            />
            <button type="submit" className="btn">{textButton}</button>
        </form>
    );
};
