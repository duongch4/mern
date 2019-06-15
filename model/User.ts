export interface IUser {
    email?: string;
    firstName?: string;
    lastName?: string;
}

import { Document, Schema, Model, model} from "mongoose";
// import { IUser } from "../interfaces/user";

export interface IUserModel extends IUser, Document {
  fullName(): string;
}

export var UserSchema: Schema = new Schema({
  createdAt: Date,
  email: String,
  firstName: String,
  lastName: String
});
UserSchema.pre("save", (next) => {
  let now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});
UserSchema.methods.fullName = function(): string {
  return (this.firstName.trim() + " " + this.lastName.trim());
};

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