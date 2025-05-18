import firebase from "./firebaseTransactions";
import bcrypt from "bcryptjs";

const logIn = async (userId: string, password: string) => {
    const userData = await firebase.getData("user_data", userId);
    if (userData) {
        const isMatch = await bcrypt.compare(password, userData.password);
        if (isMatch) {
            return userData;
        } 
    } 
    return null;
}

export default { logIn }