export type UserProfile = {
    firstName: string;
    lastName: string;
    gender: string;
    location: string;
    website: string;
    picture: string;
};

export type UserPayload = {
    id: string;
    email: string;
    facebook: string;
    profile: UserProfile;
};
