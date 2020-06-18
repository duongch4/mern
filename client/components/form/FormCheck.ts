import { EmptyException, InvalidLengthException } from "../../communication/Exception";

export const checkEmptyFields = (fields: string[]) => {
    for (const field of fields) {
        if (field === "") {
            throw new EmptyException("This field cannot be empty");
        }
    }
};

export const checkPasswordLength = (length: number) => {
    if (length < 4) {
        throw new InvalidLengthException("Password must be at least 4 characters long");
    }
};
