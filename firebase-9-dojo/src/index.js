import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  getDocs,
  collection,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCSQNYIkehaGompCMgLXXbPVk-VEvgxrKE",
  authDomain: "netninja-fb9-dojo.firebaseapp.com",
  projectId: "netninja-fb9-dojo",
  storageBucket: "netninja-fb9-dojo.appspot.com",
  messagingSenderId: "1027421951075",
  appId: "1:1027421951075:web:aea8eeb20226666b045456"
};

// init firebase app
initializeApp(firebaseConfig);

// init services
const db = getFirestore();

// collection ref
const colRef = collection(db, 'books');

// get collection data
getDocs(colRef)
  .then((snapshot) => {
    let books = [];
    snapshot.docs.forEach((doc) => { 
      books.push({
        ...doc.data(), 
        id: doc.id,
      });
    });

    console.log(books);
  })
  .catch((error) => {
    console.error(error);
  })