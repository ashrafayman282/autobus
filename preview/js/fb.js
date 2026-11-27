import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {connectDatabaseEmulator,getDatabase,ref,onValue,set,update,get,onDisconnect,runTransaction,increment} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {getAuth,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged,connectAuthEmulator,signInWithCredential} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
export default {initializeApp,connectDatabaseEmulator,getDatabase,ref,onValue,set,update,get,onDisconnect,runTransaction,increment,getAuth,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged,connectAuthEmulator,signInWithCredential};
