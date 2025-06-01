import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth, signInAnonymously } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, updateDoc, doc, getDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBaggkpmiwJJbVWRMr5HabKAghQdoPvAY0',
  authDomain: 'todo-app-a7757.firebaseapp.com',
  projectId: 'todo-app-a7757',
  storageBucket: 'todo-app-a7757.firebasestorage.app',
  messagingSenderId: '953072275952',
  appId: '1:953072275952:web:af0f98b0194e54f7c50d35',
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

signInAnonymously(getAuth())
  .then(() => {
    console.log('User signed in anonymously');
  })
  .catch(error => {
    if (error.code === 'auth/operation-not-allowed') {
      console.log('Enable anonymous in your firebase console.');
    }

    console.error(error);
  });

// export async function getSchedule(db, docName) {
//   try {
//     const docRef = doc(db, "schedules", docName);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//       return docSnap.data();
//     } else {
//       console.log("No such document!");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching document:", error);
//   }
// }

export async function updateSchedule(db, schedule, docname) {
  const scheduleRef = doc(db, 'schedules', docname);
  await updateDoc(scheduleRef, schedule)
}

