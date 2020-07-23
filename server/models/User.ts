import mongoose from "mongoose";
import Auth from "../auth/Auth";
import crypto from "crypto";

export type AuthToken = {
    accessToken: string;
    kind: string;
};

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

export type UserDoc = mongoose.Document & {
    _id: string;
    email: string;
    password: string;
    passwordResetToken: string;
    passwordResetExpires: Date;

    facebook: string;
    tokens: AuthToken[];

    profile: UserProfile;

    getGravatar: (size: number) => string;
    getFullName: () => string;
};

const UserSchema: mongoose.Schema = new mongoose.Schema(
    {
        email: { type: String, unique: true },
        password: String,
        passwordResetToken: String,
        passwordResetExpires: Date,

        facebook: String,
        twitter: String,
        google: String,
        tokens: Array,

        profile: {
            firstName: String,
            lastName: String,
            gender: String,
            location: String,
            website: String,
            picture: String
        },

        // genres: [String],
        // movies: [String],
    },
    {
        timestamps: true
    }
);

UserSchema.pre<UserDoc>("save", function save(next) {
    if (!this.isModified("password")) {
        return next();
    }

    if (this.password) {
        Auth.hashPassword(this.password, 12, (err: mongoose.Error, hash) => {
            if (err) {
                return next(err);
            }
            else {
                this.password = hash;
                return next();
            }
        });
    }
});

UserSchema.methods.getFullName = function (): string {
    return `${this.firstName.trim()} ${this.lastName.trim()}`;
};

/**
 * Helper method for getting user's gravatar.
 */
UserSchema.methods.getGravatar = function (size: number = 200): string {
    if (!this.email) {
        return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5 = crypto.createHash("md5").update(this.email).digest("hex");
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

export const User: mongoose.Model<UserDoc> = mongoose.model<UserDoc>("User", UserSchema);
