import React from "react"
import firebase from "firebase"
import functions from 'firebase-functions'
import admin from 'firebase-admin'


admin.initializeApp(functions.config().firebase);


function signInAnon() {

    firebase.auth().signInAnonymously().catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            // ...
        } else {
            // User is signed out.
            // ...
        }
        // ...
    });

    const db = admin.firestore()

    let docRef = db.collection('users').doc('anonUser');

    let Date = new Date();
    let time = Date.getTime();

    let setAnon = docRef.set({
        first: 'Anonymous',
        last: 'User',
        logtime: { time }
    })();
}

export default signInAnon