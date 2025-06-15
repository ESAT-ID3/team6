import firebase from "./firebaseTransactions"; // Assuming getData is a function that fetches data from Firestore
import { DocumentData } from "firebase/firestore";

const collectionName = "financial_assets_parameters";
const apiKey = "38ebe4f9460149ef898cd38c67f27db9"

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

function formatStockData(data : any[]) {
    const rawData = data[0]; // es un objeto, no un array
    const result: any[] = [];

    for (const key in rawData) {
        result.push({
            name: key,
            type: "Acciones"
        });
    }

    return result;
}

function formatCryptoData(data : any[]) {
    const rawData = data[1]; // es un objeto, no un array
    const result: any[] = [];

    for (const key in rawData) {
        result.push({
            name: key,
            type: "Criptomonedas"
        });
    }

    return result;
}

function formatETFData(data : any[]) {
    const rawData = data[2]; // es un objeto, no un array
    const result: any[] = [];

    for (const key in rawData) {
        result.push({
            name: key,
            type: "ETFs"
        });
    }

    return result;
}

function formatForexData(data : any[]) {
    const rawData = data[3]; // es un objeto, no un array
    const result: any[] = [];

    for (const key in rawData) {
        result.push({
            name: key,
            type: "Divisas"
        });
    }

    return result;
}

// Function to format the date in the way the API expects it
function getFormattedDate(date : Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');  // Add 1 because months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function getMarketData(interval : string, type = "", ticket : string, exchange = "", startDate : string, endDate : string) {
  // Get the current date and calculate the start and end dates. By default gets the last 2 years of data.
  let now = new Date();
  let start = getFormattedDate(startDate ? new Date(startDate) : new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30));
  let end = getFormattedDate(endDate ? new Date(endDate) : now);

  const url = `https://api.twelvedata.com/time_series?`;
  let aux = "";

  if (type) {
    aux += `&type=${type}`;
  }

  if (exchange) {
    aux += `&exchange=${exchange}`;
  }

  const customUrl = `${url}&interval=${interval}${aux}&apikey=${apiKey}&format=JSON&start_date=${start}&end_date=${end}&timezone=utc&symbol=${ticket}`;
  try {
    // Fetch data from the API
    const response = await fetch(customUrl);

    // Check if the response is successful (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response body as JSON
    const data = await response.json();
    console.log(data.values);
    return data.values;

  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to fetch market data');
  }
}

export default { getFirebaseData , formatStockData , formatCryptoData , formatETFData , formatForexData , getMarketData};