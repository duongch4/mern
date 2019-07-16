import bcrypt from "bcryptjs";

export default class Auth {

     static hashPassword(
        password: string, saltRounds: number, callback: (error: Error, hash: string) => void
    ): void {
        bcrypt.hash(password, saltRounds, (error, hash) => {
            callback(error, hash);
        });
    }

     static compare(
        password: string, dbHash: string, callback: (error: Error, isMatch: boolean) => void
    ): void {
        bcrypt.compare(password, dbHash, (error, isMatch) => {
            callback(error, isMatch);
        });
    }
}
