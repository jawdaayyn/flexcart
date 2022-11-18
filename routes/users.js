const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { initializeApp } = require("firebase/app");
const {
  doc,
  addDoc,
  collection,
  getDoc,
  getDocs,
  getFirestore,
  serverTimestamp,
  deleteDoc,
  updateDoc,
} = require("firebase/firestore");
const {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  deleteUser,
} = require("firebase/auth");
const { uuidv4 } = require("@firebase/util");
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

const usersCol = collection(db, "users");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const usersCol = collection(db, "users");
    const userSnapshot = await getDocs(usersCol);
    const usersList = userSnapshot.docs.map((doc) => doc.data());
    res.status(200).send(usersList);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    res.status(200).send(docSnap.data());
  } else {
    res.status(404).send("Utilisateur non trouvé !");
  }
});
router.delete(":id", async (req, res) => {
  const { id } = req.params;
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    deleteDoc(docRef);
    deleteUser();
    res.status(200).send("L'utilisateur a bien été supprimé.");
  } else {
    res.status(404).send("Utilisateur non trouvé !");
  }
});

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    addDoc(usersCol, {
      uid: auth.currentUser.uid,
      email: email,
      password: password,
      cart_id: uuidv4(),
      createdAt: serverTimestamp(),
    }).then(() => {
      res.send("Vous vous êtes bien enregistrés");
    });
  } catch (error) {
    console.log(`Il y a eu une erreur : ${error}`);
    res.status(400).send(error);
  }
});
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    await signInWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        const user = userCredential.user;
        res.status(200).send({ message: user });
      }
    );
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

module.exports = router;
