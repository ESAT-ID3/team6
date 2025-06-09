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

async function getCurrentMonthData(userId: string | undefined) {
  if (!userId) {
    return null;
  }

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-indexed: Enero = 0
  const currentYear = currentDate.getFullYear();

  const bankInfo = await firebase.getData("bank_data", userId);
  if (bankInfo) {
    let monthSpend: any[] = [];

    bankInfo.bank_accounts.forEach((bank: BankAccountDetails) => {
      bank.data.forEach((transaction: Transaction) => {
        // Parse "dd/mm/yyyy" to Date object
        const [day, month, year] = transaction.date.split("/");
        const transactionDate = new Date(`${year}-${month}-${day}`);

        const isSameMonth = transactionDate.getMonth() === currentMonth;
        const isSameYear = transactionDate.getFullYear() === currentYear;

        if (isSameMonth && isSameYear && transaction.amount < 0) {
          monthSpend.push(transaction);
        }
      });
    });

    let result: { category: string; spend: number }[] = [];

    monthSpend.forEach((transaction) => {
    let pos = result.findIndex(item => item.category === transaction.category);
    if (pos === -1) {
        result.push({ category: transaction.category, spend: Math.abs(transaction.amount) });
    } else {
        result[pos].spend += Math.abs(transaction.amount);
    }
    });

    return result;
  }

  return null;
}

async function getCurrentBudget(userId: string | undefined) {
    if (!userId) {
        return null;
    }
    const docId = `${userId}`;
    const budgetData = await firebase.getData("current_budget", docId);
    if (budgetData) {
        let result: { category: string; limit: number }[] = [];
        budgetData.limits.forEach((limit: any) => {
            result.push({
                category: limit.category,
                limit: limit.limit
            });
        });
        return result; 
    }
    return null;
}

async function storeCurrentBudget(userId: string | undefined, data: any): Promise<boolean> {
    if (!userId) {
        return false;
    }
    const docId = `${userId}`;
    await firebase.setData("current_budget", docId, data);
    return true;
}


export default { logIn , getBankInfo , getInfoPerMonth, getSpendInfoPerCategory, getSpendCategories, getPreviousBudgets, getCurrentMonthData, getCurrentBudget, storeCurrentBudget };