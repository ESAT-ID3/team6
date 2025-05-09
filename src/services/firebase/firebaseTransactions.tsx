import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, DocumentSnapshot, DocumentData } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAIMfFhN4sARnaHPYRn0ujFv8TT1-zCmY8",
    authDomain: "t6-dashflow.firebaseapp.com",
    projectId: "t6-dashflow",
    storageBucket: "t6-dashflow.firebasestorage.app",
    messagingSenderId: "351631918445",
    appId: "1:351631918445:web:53fb8ffd51a658a1c7c664",
    measurementId: "G-G8DQ1EET46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Function to get data from Firestore by collection name and document ID
async function getData(collectionName: string, docId: string): Promise<DocumentData | undefined> {
    const docRef = doc(db, collectionName, docId);  // Reference to the document
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(docRef);  // Get the document snapshot

    if (docSnap.exists()) {
        return docSnap.data()
    } else {
        console.log("No such document!");  // If document doesn't exist
    }
}

export default { getData };