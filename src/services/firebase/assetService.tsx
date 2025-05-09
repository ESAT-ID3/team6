import firebase from "./firebaseTransactions"; // Assuming getData is a function that fetches data from Firestore
import { DocumentData } from "firebase/firestore";

const collectionName = "financial_assets_parameters";

// Function to handle specific type fetching
async function getFirebaseData(type: string | null): Promise<DocumentData | undefined> {
    const transformation: { [key: string]: string } = {
        Stocks: "companies_stocks",
        Cryptocurrencies: "cryptos",
        ETFs: "etfs",
        Forex: "forex"
    };

    if (!type) {
        console.log("Type is null!");
        return;
    }

    const transformedType = transformation[type];
    if (transformedType) {
        // Await the result of getData, which returns a Promise
        const data = await firebase.getData(collectionName, transformedType);
        return data; // This will now return the resolved data object
    } else {
        console.log("Unknown type:", type);
    }
}

export default { getFirebaseData };