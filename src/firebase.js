  // Import the functions you need from the SDKs you need
  import { initializeApp } from "firebase/app";
  import { getAnalytics } from "firebase/analytics";
  import { getAuth } from "firebase/auth";
  import { getFirestore, collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp} from "firebase/firestore";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyChIJOmnmdOSLxBFh9-9f73jqAsaFffsrg",
    authDomain: "modelame-e9645.firebaseapp.com",
    projectId: "modelame-e9645",
    storageBucket: "modelame-e9645.appspot.com",
    messagingSenderId: "645395908549",
    appId: "1:645395908549:web:5cf5f68dd8fe83bc09adac",
    measurementId: "G-2ZXYDBB9P7"
  };


  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  const auth = getAuth(app);
  const dataBase = getFirestore(app);

  export { auth, dataBase };
