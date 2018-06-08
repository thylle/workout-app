import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'

var config = {
  apiKey: "AIzaSyCxUwMWfGsYMufqOiF4LaRTmDXYYxM6EwE",
  authDomain: "workout-app-1337.firebaseapp.com",
  databaseURL: "https://workout-app-1337.firebaseio.com",
  projectId: "workout-app-1337",
  storageBucket: "workout-app-1337.appspot.com",
  messagingSenderId: "995650046193"
};

!firebase.apps.length ? firebase.initializeApp(config) : ''

export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
export const Auth = firebase.auth()
export const Database = firebase.database()
export default firebase
