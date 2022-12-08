const express = require("express");
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
  query,
  where,
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

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cartsCol = collection(db, "carts");
    const cartsSnapshot = await getDocs(cartsCol);
    const cartsList = cartsSnapshot.docs.map((doc) => doc.data());
    res.status(200).send(cartsList);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const cartRef = doc(db, "carts", id);
  const cartFound = await getDoc(cartRef);

  if (cartFound.exists()) {
    res.status(201).send(cartFound.data());
  } else {
    res.status(404).send("No cart found!zsz");
  }
});

router.put("/:id", async (req, res) => {
  // AJOUTER UN PRODUIT AU PANIER
  const { id } = req.params; // FINIR L'AJOUT DE PRODUIT AU PANIER
  const { brand, description, name, price, url, image } = req.body;
  const cartRef = doc(db, "carts", id);
  const cartFound = await getDoc(cartRef);

  if (cartFound.exists()) {
    //res.status(201).send(cartFound.data());
    let newArray = cartFound.data().content;
    const lastItem = newArray.slice(-1);
    let newId;
    if (lastItem.length == 0) {
      newId = 1;
    } else {
      newId = lastItem[0].itemid + 1;
    }
    console.log(newId);

    newArray.push({
      brand: brand,
      description: description,
      name: name,
      price: price,
      url: url,
      image: image,
      itemid: newId,
    });

    try {
      await updateDoc(cartRef, {
        content: newArray,
      }).then(() => {
        res.status(200).send("Le panier a bien été modifié.");
      });
    } catch (error) {
      res.status(401).send(error);
    }
  } else {
    res.status(404).send("No cart found!");
  }
});

router.get("/products/:id/:itemid", async (req, res) => {
  // GET UN PRODUIT PAR SON ID
  const { id, itemid } = req.params;
  const cartRef = doc(db, "carts", id);
  const cartFound = await getDoc(cartRef);
  if (cartFound.exists()) {
    let newArray = cartFound.data().content;
    const result = newArray.filter((item) => item.itemid === itemid);
    if (result.length === 0) {
      res.status(404).send("cet item n'existe pas");
    } else {
      res.status(201).send(result);
    }
  } else {
    res.status(404).send("No cart found!zzszszs");
  }
});

router.get("/lastitem/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const cartRef = doc(db, "carts", id);
  const cartFound = await getDoc(cartRef);

  if (cartFound.exists()) {
    let newArray = cartFound.data().content;
    const lastItem = newArray.slice(-1);
    if (lastItem) {
      res.status(201).send(lastItem);
    } else {
      res.status(404).send("No products in your cart available !");
    }
  } else {
    res.status(404).send("No cart found!zzszszs");
  }
});
router.delete("/:id/:itemid", async (req, res) => {
  // GET UN PRODUIT PAR SON ID
  const { id, itemid } = req.params;
  const cartRef = doc(db, "carts", id);
  const cartFound = await getDoc(cartRef);
  if (cartFound.exists()) {
    let newArray = cartFound.data().content;

    const indexOfObject = newArray.findIndex((object) => {
      if (!object.itemid == itemid) {
        return null;
      } else {
        return object.itemid == itemid;
      }
    });

    console.log(indexOfObject); // 👉️ 1
    if (indexOfObject < 0) {
      res.status(404).send("didn't found item");
    } else {
      newArray.splice(indexOfObject, 1);

      try {
        await updateDoc(cartRef, {
          content: newArray,
        }).then(() => {
          res.status(200).send("Le produit a bien été supprimé.");
        });
      } catch (error) {
        res.status(401).send(error);
      }
    }
  } else {
    res.status(404).send("Cart not found");
  }
});

module.exports = router;
