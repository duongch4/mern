import React from "react";

import { AjaxHandler } from "../../utils/AjaxHandler";
import { AlertMessage } from "../utils/AlertMessage";
import { FormGroupText } from "./FormGroupText";
import { FormGroupRadio } from "./FormGroupRadio";
import { useUserAuthenticated } from "../../contexts/UserContext";

import Log from "../../utils/Log";

export type ProfileFormStates = {
    message: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    location: string;
    website: string;
};

export const ProfileForm = () => {
    const { user, setUser } = useUserAuthenticated();
    const url = `/api/account/profile/${user.id}`;
    const textButton = "Update Profile";

    const [state, setState] = React.useState({
        message: "",
        email: user.email,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        gender: user.profile.gender,
        location: user.profile.location,
        website: user.profile.website
    });

    const onInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [field]: event.target.value
        });
    };

    const submit = async (): Promise<any> => {
        Log.trace("Submitting form to: ", url);
        const data = {
            email: state.email,
            firstName: state.firstName,
            lastName: state.lastName,
            gender: state.gender,
            location: state.location,
            website: state.website
        };

        try {
            const response = await AjaxHandler.putRequest(url, data);
            Log.trace("YAY!!!");
            Log.trace(response);
            setState({
                ...state,
                message: response.message
            });
            setUser({
                ...user,
                email: state.email,
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
        try {
            submit();
        }
        catch (err) {
            setState({
                ...state,
                message: err.message
            });
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <AlertMessage message={state.message} />
            <form>
                <FormGroupText
                    type={"email"} id={"profile-id-email"} value={state.email}
                    onChange={onInputChange("email")}
                    label={"Email"}
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
            </form>
            <button type="submit" className="btn">{textButton}</button>
        </form>
    );
};
