import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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