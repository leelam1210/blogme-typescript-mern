import { IUserRegister } from "./TypeScript";


export const validRegister = (formAuth: IUserRegister) => {
    const { firstName, lastName, account, password, confirmPassword } = formAuth;
    const errors: string[] = [];

    if (!firstName || !lastName) {
        errors.push("Please add First Name and Last Name!.");
    }
    // } else if ((`${firstName} ${lastName}`).length > 20) {
    //     errors.push("Your name is up to 20 chars long.");
    // }

    if (!account) {
        errors.push("Please add your email or phone number.");
    } else if (!validPhone(account) && !validateEmail(account)) {
        errors.push("Email or phone number format is incorrect.");
    }

    // if (password.length < 6) {
    //     errors.push("Password must be at least 6 chars.");
    // } else if (password !== confirmPassword) {
    //     errors.push("Confirm password did not match.");
    // }

    const msg = checkPassword(password, confirmPassword);
    if (msg) errors.push(msg);

    return {
        errMsg: errors,
        errLength: errors.length,
    }
}

export const checkPassword = (password: string, confirmPassword: string) => {
    if (password.length < 6) {
        return ("Password must be at least 6 chars.");
    } else if (password !== confirmPassword) {
        return ("Confirm password did not match.");
    }

}

export const validPhone = (phone: string) => {
    const re = /^[+]/g
    return re.test(phone)
}

export const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}