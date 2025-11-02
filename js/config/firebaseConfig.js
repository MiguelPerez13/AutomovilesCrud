import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyByQrC_p0S5IKBmPSHHr1OPe4Hp0z1SJJo",
  authDomain: "proyectowebfinal-9a441.firebaseapp.com",
  projectId: "proyectowebfinal-9a441",
  storageBucket: "proyectowebfinal-9a441.firebasestorage.app",
  messagingSenderId: "601889162451",
  appId: "1:601889162451:web:69beb90d57f7630d62c026"
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export {db};