// js/firebase-config.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyBMd0O9WAJokPjcf2lDpS--0DvmUyF7MIw",
  authDomain: "fisiokita-ufdk.firebaseapp.com",
  projectId: "fisiokita-ufdk",
  storageBucket: "fisiokita-ufdk.appspot.com",
  messagingSenderId: "724474359994",
  appId: "1:724474359994:web:e32bc6e63be66d9d039283"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
