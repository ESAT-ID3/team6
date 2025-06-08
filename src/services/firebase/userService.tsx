import firebase from "./firebaseTransactions";
import bcrypt from "bcryptjs";

export interface Transaction {
  amount: number;
  business: string;
  category: string;
  date: string; 
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
        console.log("Labels:", labels);
        console.log("Income Data:", incomeData);
        console.log("Outcome Data:", outcomeData);
        return {
            labels: labels,
            incomeData: incomeData,
            outcomeData: outcomeData
        }
}

const getSpendInfoPerCategory = (banks_info: BankAccountDetails[], date: string) => {
    let labels : string[] = [];
    let data : number[] = [];
    banks_info.forEach((bank) => {
        let transactions = bank.data.filter((transaction) => transaction.amount < 0);
        transactions = transactions.filter((transaction) => {
            let transactionDate = transaction.date.split("/");
            return transactionDate[1] + "/" + transactionDate[2] === date;
        })
        transactions.forEach((transaction) => {
            let index = labels.indexOf(transaction.category);
            if (index === -1) {
                labels.push(transaction.category);
                data.push(Math.abs(transaction.amount));
            } else {
                data[index] += Math.abs(transaction.amount);
            }
        })
    })

    return {
        categories: labels,
        spend: data
    }
}

const getSpendCategories = async () => {
    const categoriesData = await firebase.getData("categories_data", "cat");
    if (categoriesData) {
        return categoriesData.categories;
    }
    return null;
}

const getPreviousBudgets = async (userId: string | undefined) => {
    if (!userId) {
        return null;
    }
    const budgetsData = await firebase.getData("previous_budgets", userId);
    if (budgetsData) {
        console.log("Budgets Data:", budgetsData);
        return getLastSixMonthsBudgets(budgetsData);
    }
    return null;
}

function getLastSixMonthsBudgets(budgetsData : any) {
  const result = [];
  
  let date = new Date();
  date.setDate(1); // set to first day to avoid edge cases
  date.setMonth(date.getMonth() - 1); // start from previous month

  for (let i = 0; i < 6; i++) {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const key = `${mm}/${yyyy}`;

    if (budgetsData[key]) {
      result.push(budgetsData[key]);
    }

    date.setMonth(date.getMonth() - 1); // go to previous month
  }

  return result;
}


export default { logIn , getBankInfo , getInfoPerMonth, getSpendInfoPerCategory, getSpendCategories, getPreviousBudgets };