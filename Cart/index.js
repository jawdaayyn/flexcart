import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDwoPARgZLamPGVATDIe7_RQPGeQ3IrT4M",
  authDomain: "flexcart-fa4cf.firebaseapp.com",
  databaseURL:
    "https://flexcart-fa4cf-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "flexcart-fa4cf",
  storageBucket: "flexcart-fa4cf.appspot.com",
  messagingSenderId: "992535071966",
  appId: "1:992535071966:web:c10dcf020488728bf9464f",
  measurementId: "G-05FK7EST5D",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const loginAccount = async (login, password) => {
  await signInWithEmailAndPassword(auth, login, password);
  const user = auth.currentUser;
  return user.uid;
};

const cartCol = collection(db, "cart");
const auth = getAuth();

const addCart = async () => {
  const uid = await loginAccount();
  try {
    addDoc(cartCol, {
      content: {
        product: {
          brand: "nike",
          id: "1",
          image:
            "https://img01.ztat.net/article/spp-media-p1/a785c4d4bc6643b89efbcbc19f8ff19d/242d3612878e44f0ab55efe31d35b779.jpg?imwidth=1800",
          name: "AIR FORCE 1",
          price: "119,95€",
          url: "https://www.zalando.fr/nike-sportswear-air-force-1-baskets-basses-greenoff-white-ni112o0qs-m11.html",
        },
      },
      user_id: uid,

      createdAt: serverTimestamp(),
    }).then(() => {
      console.log(cartCol);
    });
  } catch (error) {
    console.log(error);
  }
};

addCart();
