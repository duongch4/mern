import * as mongoose from "mongoose";
import Auth from "../utils/Auth";
import * as crypto from "crypto";

export interface IAuthToken {
    accessToken: string;
    kind: string;
}

export interface IUser extends mongoose.Document {
    email: string;
    password: string;
    passwordResetToken: string;
    passwordResetExpires: Date;

    facebook: string;
    tokens: IAuthToken;

    profile: {
        firstName: string;
        lastName: string;
        gender: string,
        location: string,
        website: string,
        picture: string
    };

    getGravatar: (size: number) => string;
    getFullName: () => string;
}

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

        genres: [String],
        movies: [String],
    },
    {
        timestamps: true
    }
);

UserSchema.pre<IUser>("save", function save(next) {
    const user = this;

    if (!user.isModified("password")) {
        return next();
    }

    if (user.password) {
        Auth.hashPassword(user.password, 12, (err: mongoose.Error, hash) => {
            if (err) {
                return next(err);
            }
            else {
                user.password = hash;
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

export const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", UserSchema);

// /**
//  * Get a user
//  *
//  * @class UsersApi
//  * @method get
//  * @param req {Request} The express request object.
//  * @param res {Response} The express response object.
//  * @param next {NextFunction} The next function to continue.
//  */
// public get(req: Request, res: Response, next: NextFunction) {
//     //verify the id parameter exists
//     const PARAM_ID: string = "id";
//     if (typeof req.params[PARAM_ID] === "undefined" || req.params[PARAM_ID] === null) {
//       res.sendStatus(404);
//       next();
//       return;
//     }

//     //get the id
//     var id = req.params[PARAM_ID];

//     //get authorized user
//     this.authorize(req, res, next).then((user: IUserModel) => {
//       //make sure the user being deleted is the authorized user
//       if (user._id !== id) {
//         res.sendStatus(401);
//         next();
//         return;
//       }

//       //log
//       console.log(`[UsersApi.get] Retrieving user: {id: ${req.params.id}}.`);

//       //find user
//       User.findById(id).then((user: IUserModel) => {
//         //verify user was found
//         if (user === null) {
//           res.sendStatus(404);
//           next();
//           return;
//         }

//         //send json response
//         res.json(user);
//         next();
//       }).catch(next);
//     }).catch(next);
//   }
