import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAoMQa6rAG15fwiICkK3bOxf6xybXiKXTk",
    authDomain: "artisanal-restraunt.firebaseapp.com",
    projectId: "artisanal-restraunt",
    storageBucket: "artisanal-restraunt.appspot.com",
    messagingSenderId: "130378194728",
    appId: "1:130378194728:web:aa13a40d89847c79077a1d",
    measurementId: "G-CGNSRCM4PG",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Try to upload a simple file/buffer
const storageRef = ref(storage, 'test-images/test.txt');
const data = new Uint8Array([72, 101, 108, 108, 111]); // Hello

const uploadTask = uploadBytesResumable(storageRef, data);
console.log("Upload started...");
uploadTask.on('state_changed',
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
  },
  (error) => {
    console.error("Upload failed:", error);
    process.exit(1);
  },
  () => {
    console.log("Upload succeeded!");
    process.exit(0);
  }
);
