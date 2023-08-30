import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCZ_J7haPU8cMX7D-N-CRISHsUKb_ujjUI",
  authDomain: "typescriptdb.firebaseapp.com",
  projectId: "typescriptdb",
  storageBucket: "typescriptdb.appspot.com",
  messagingSenderId: "276286633699",
  appId: "1:276286633699:web:c550ca31a085c6905ef7d6",
  measurementId: "G-6JV72B0YTL"
};

initializeApp(firebaseConfig);

const db = getFirestore()

export { db }