import { initializeApp } from 'firebase/app';
import {
  getFirestore, onSnapshot, collection,
  addDoc, deleteDoc, doc,
  query, where,
  orderBy, serverTimestamp,
  getDoc
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

// queries
const q = query(colRef, orderBy('createdAt'))

// real-time collection data
onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => { 
    books.push({
      ...doc.data(), 
      id: doc.id,
    });
  });

  console.log(books);
});

// adding docs
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  })
  .then(() => {
    addBookForm.reset()
  })
});

// deleting docs
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'books', deleteBookForm.id.value);

  deleteDoc(docRef)
    .then(() => {
      deleteBookForm.reset()
    })
});

// fetching a single document (& realtime)
const docRef = doc(db, 'books', 'XYVt3ANgQahURaEqymzH')

// get single doc
// getDoc(docRef)
//   .then(doc => {
//     console.log(doc.data(), doc.id)
//   })

onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id)
})