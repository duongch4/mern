import bcrypt from "bcryptjs";

export default class Auth {

     static hashPassword(
        password: string, saltRounds: number, callback: (err: Error, hash: string) => void
    ): void {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            callback(err, hash);
        });
    }

     static compare(
        password: string, dbHash: string, callback: (err: Error, isMatch: boolean) => void
    ): void {
        bcrypt.compare(password, dbHash, (err, isMatch) => {
            callback(err, isMatch);
        });
    }
}
