import firebase from "./firebaseTransactions";
import bcrypt from "bcryptjs";

export interface Transaction {
  amount: number;
  business: string;
  category: string;
  date: string; // Puedes convertirlo a `Date` si lo deseas
  icon: string;
  id: number;
}

export interface BankAccountDetails {
    account_number: string;
    bank_name: string;
    cvv: string;
    expiration_date: string;
    data: Transaction[];
}

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

const getBankInfo = async (userId: string | undefined) => {
    if (!userId) {
        return null;
    }
    const userBankData = await firebase.getData("bank_data", userId);
    if (userBankData) {
        return userBankData;
    }
    return null
}

const getInfoPerMonth = (banks_info: BankAccountDetails[]) => {
    let labels : string[] = [];
    let incomeData : number[] = [];
    let outcomeData : number[] = [];

    banks_info.forEach((bank) => {
        const transactions = bank.data;
        transactions.forEach((transaction) => {
            let date = transaction.date.split("/");
            let label = date[1] + "/" + date[2];
            if (!labels.includes(label)) {
                labels.push(label);
                incomeData.push(0);
                outcomeData.push(0);
            }
            let index = labels.indexOf(label);
            if (transaction.amount > 0) {
                incomeData[index] += transaction.amount;
            } else {
                outcomeData[index] += Math.abs(transaction.amount);
            }
        })
    })
    return {
        labels: labels,
        incomeData: incomeData,
        outcomeData: outcomeData
    }
}

const getSpendInfoPerCategory = () => {

}

export default { logIn , getBankInfo , getInfoPerMonth, getSpendInfoPerCategory };