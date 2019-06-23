import firebase from 'firebase'
import firestore from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyA3kfLExCsApmhH0NnaPpFFaF-3yB8S5-4",
    authDomain: "recipe-check-app.firebaseapp.com",
    databaseURL: "https://recipe-check-app.firebaseio.com",
    projectId: "recipe-check-app",
    storageBucket: "",
    messagingSenderId: "316595473189",
    appId: "1:316595473189:web:494c96b89826014e"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);

// export firestore DB
export default firebaseApp.firestore()