import { initializeApp } from 'firebase/app';
import {
  getFirestore, onSnapshot, collection,
  addDoc, deleteDoc, doc,
  query, where,
  orderBy, serverTimestamp,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';


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
const auth = getAuth();

// collection ref
const colRef = collection(db, 'books');

// queries
const q = query(colRef, orderBy('createdAt'))

// real-time collection data
const unSubCollection = onSnapshot(q, (snapshot) => {
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

// get single doc onload
// getDoc(docRef)
//   .then(doc => {
//     console.log(doc.data(), doc.id)
//   })

const unSubDocument = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id)
})

// updating a document
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
  e.preventDefault()

  let docRef = doc(db, 'books', updateForm.id.value)

  updateDoc(docRef, {
    title: 'updated title'
  })
  .then(() => {
    updateForm.reset()
  })
})


// signing users up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredentials => {
      console.log('user created:', userCredentials.user)
      signupForm.reset()
    })
    .catch(error => {
      console.log(error.message)
    })
})

// logging in and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      console.log('user signed out')
    })
    .catch(error => {
      console.log(error.message)
    })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email, password)
    .then(userCredentials => {
      console.log('user logged in:', userCredentials.user)
      loginForm.reset()
    })
    .catch(error => {
      console.log(error.message)
    })
})

// subscribing to auth changes
const unSubAuthentication = onAuthStateChanged(auth, (user) => {
  console.log('user status changed:', user)
})

// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
  console.log('unsubscribing');
  unSubCollection();
  unSubDocument()
  unSubAuthentication();
})