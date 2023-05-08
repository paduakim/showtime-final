import firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCFRiSYwkzjzjBf7Cpj0frapObwWu5irmA",
  authDomain: "showtime-bf772.firebaseapp.com",
  projectId: "showtime-bf772",
  storageBucket: "showtime-bf772.appspot.com",
  messagingSenderId: "984493037212",
  appId: "1:984493037212:web:f3f5b0b0cc1ceecd9bff59",
};

firebase.inializeApp(firebaseConfig);

export default firebase;
