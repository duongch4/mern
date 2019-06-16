import * as mongoose from "mongoose";
// import * as bcryptjs from "bcryptjs";
import Auth from "../utils/Auth";
// import { IUser } from "../interfaces/user";

export interface IUser extends mongoose.Document {
    dateCreated: Date;
    email: string;
    firstName: string;
    lastName: string;
    fullName(): string;
}

const UserSchema: mongoose.Schema = new mongoose.Schema(
    {
        dateCreated: Date,
        email: {
            type: String,
            index: { unique: true },
            required: true
        },
        firstName: String,
        lastName: String,
        avatar: {
            type: String,
            default: "Avatar URL"
        },
        genres: [String],
        movies: [String],

        google: {
            id: String
        },
        facebook: {
            id: String
        },
        github: {
            id: String
        },
        local: {
            password: String
        }
    }
);

UserSchema.pre<IUser>("save", function (next) {
    let user = this;
    let now = new Date();
    this.dateCread
    if (!user..dateCreated) {
        user.dateCreated = now;
    }
    if (!user.isModified("password"))
        next();
});

UserSchema.methods.fullName = (): string => {
    return `${this.firstName.trim()} ${this.lastName.trim()}`;
};

UserSchema.methods.getHash = (password: string): string => {
    Auth.hashPassword(password, 12, (err, hash) => {
        if (err) {
            throw Error(`Error while Hashing: ${err.message}`);
        } else {
            // store the new hash in the database etc
        }
    });
}

export const User: Model<IUserModel> = model<IUserModel>("User", UserSchema);


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