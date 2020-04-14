import passportLocal from "passport-local";
import { User, UserDoc } from "../models/User";
import Auth from "./Auth";

export const LocalStrategy = new passportLocal.Strategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (errEmail, user: UserDoc) => {
        if (errEmail) {
            return done(errEmail);
        }
        if (!user) {
            return done(undefined, false, { message: `Email "${email}" not found` });
        }
        Auth.compare(password, user.password, (errPassword: Error, isMatch: boolean) => {
            if (errPassword) {
                return done(errPassword);
            }
            if (isMatch) {
                return done(undefined, user);
            }
            return done(undefined, false, { message: "Invalid Password" });
        });
    });
});
