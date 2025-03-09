import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDyCDFoItbfwJoELZycsiSwhUumRLC6af4",
    authDomain: "autocare-c1756.firebaseapp.com",
    databaseURL: "https://autocare-c1756-default-rtdb.firebaseio.com",
    projectId: "autocare-c1756",
    storageBucket: "autocare-c1756.appspot.com",
    messagingSenderId: "778505169540",
    appId: "1:778505169540:web:2f728cbd471f239375f0d1",
    measurementId: "G-2KPZH1FS6J"
  };
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };