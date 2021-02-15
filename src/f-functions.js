
const firebase = require('firebase')
const functions = require('firebase-functions');
const stripe = require("stripe")(functions.config().keys.webhooks);
const admin = require('firebase-admin')
const firestore = require('firestore')
// const request = require('request')
// const response = require('response')
// const express = require('express')
// const event = require('event')
// const headers = require('headers')
const endpointSecret = functions.config().keys.signing;
// Get the Performance service for the default app

// const defaultPerformance = firebase.performance();
functions.config().firebase


// const app = express()

const db = admin.firestore()

let docRef = db.collection('users').doc('alovelace');

let setAda = docRef.set({
    first: 'Ada',
    last: 'Lovelace',
    born: 1815
});

let docRefTester = db.collection('users').doc('alovelace');

let makeNewUserJeskers = docRefTester.set({
    first: "Jeskers",
    last: "Shibildu",
    born: 1990
})

makeNewUserJeskers()


let aTuringRef = db.collection('users').doc('aturing');

let setAlan = aTuringRef.set({
    'first': 'Alan',
    'middle': 'Mathison',
    'last': 'Turing',
    'born': 1912
});


let losAngelesData = {
    name: 'Los Angeles',
    state: 'CA',
    country: 'USA'
};

// Add a new document in collection "cities" with ID 'LA'
let setLADoc = db.collection('cities').doc('LA').set(losAngelesData);

let cityRef1 = db.collection('cities').doc('BJ');

let setWithOptions = cityRef1.set({
    capital: true
}, { merge: true });

let data = {
    stringExample: 'Hello, World!',
    booleanExample: true,
    numberExample: 3.14159265,
    dateExample: admin.firestore.Timestamp.fromDate(new Date('December 10, 1815')),
    arrayExample: [5, true, 'hello'],
    nullExample: null,
    objectExample: {
        a: 5,
        b: true
    }
};

let setDoc2 = db.collection('data').doc('one').set(data);



db.collection('users').get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
        });
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });


// When you use set() to create a document, you must specify an ID for the document to create.
// For example:

db.collection('cities').doc('new-city-id').set(data);

// But sometimes there isn't a meaningful ID for the document, and it's more convenient
// to let Cloud Firestore auto-generate an ID for you. You can do this by calling add():

// Add a new document with a generated id.
let addDoc = db.collection('cities').add({
    name: 'Tokyo',
    country: 'Japan'
}).then(ref => {
    console.log('Added document with ID: ', ref.id);
});

// In some cases, it can be useful to create a document reference with an auto-generated ID,
// then use the reference later. For this use case, you can call doc():

let newCityRef = db.collection('cities').doc();

// Later...
let setDoc = newCityRef.set({
    // ...
});

// To update some fields of a document without overwriting the entire document,
// use the update() method:

let cityRef = db.collection('cities').doc('DC');

// Set the 'capital' field of the city
let updateSingle = cityRef.update({ capital: true });


// An example function which saves data to Firestore:

// // Saves a new message to your Cloud Firestore database.
// function saveMessage(messageText) {
//     // Add a new message entry to the database.
//     return firebase.firestore().collection('messages').add({
//       name: getUserName(),
//       text: messageText,
//       profilePicUrl: getProfilePicUrl(),
//       timestamp: firebase.firestore.FieldValue.serverTimestamp()
//     }).catch(function(error) {
//       console.error('Error writing new message to database', error);
//     });
//   }
// Loads chat messages history and listens for upcoming ones.
// function loadMessages() {
//     // Create the query to load the last 12 messages and listen for new ones.
//     var query = firebase.firestore()
//                     .collection('messages')
//                     .orderBy('timestamp', 'desc')
//                     .limit(12);

//     // Start listening to the query.
//     query.onSnapshot(function(snapshot) {
//       snapshot.docChanges().forEach(function(change) {
//         if (change.type === 'removed') {
//           deleteMessage(change.doc.id);
//         } else {
//           var message = change.doc.data();
//           displayMessage(change.doc.id, message.timestamp, message.name,
//                          message.text, message.profilePicUrl, message.imageUrl);
//         }
//       });
//     });
//   }

// Allow read/write access on all documents to any user signed in to the application


///////////////////////////////////////


exports.myFunction = functions.firestore
    .document('/test/firstDoc')
    .onWrite((change, context) => { /* ... */ });

exports.events = functions.https.onRequest((request, response) => {

    let sig = request.headers["stripe-signature"];
    try {
        let event = stripe.webhooks.constructEvent(request.rawBody, sig, endpointSecret)
        return admin.database().ref(`/events`).push(event)
            .then((snapshot) => {
                return response.json({ received: true, ref: snapshot.ref.toString() })
            })
            .catch((err) => {
                console.error(err)
                return response.status(500).end() // error saving to database
            })
    } catch (err) {
        return response.status(400).end() // signing signature failed
    }

    // response.send("Endpoint for Stripe Webhooks!")

})


exports.exampleDataBaseTrigger = functions.database.ref(`/events/{eventId}`).onCreate((snapshot, context) => {
    return console.log({
        eventId: context.params.eventid,
        data: snapshot.val()
    })
})
    // // Create and Deploy Your First Cloud Functions
    // // https://firebase.google.com/docs/functions/write-firebase-functions
    //


