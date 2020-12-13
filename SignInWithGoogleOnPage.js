// For Google Sign in on a Node.js app

const { OAuth2Client } = require('google-auth-library');


gapi.load('auth2', function () {
    gapi.auth2.init()
})

var id_token = googleUser.getAuthResponse().id_token

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.


    // After Sign In, get user's ID token:
    var id_token = googleUser.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://yourbackend.example.com/tokensignin');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        console.log('Signed in as: ' + xhr.responseText);
    };
    xhr.send('idtoken=' + id_token);

    // To verify token validity:
    const client = new OAuth2Client(CLIENT_ID);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // If request specified a G Suite domain:
        //const domain = payload['hd'];
    }
    verify().catch(console.error);


    // Build Firebase credential with the Google ID token.
    var credential = firebase.auth.GoogleAuthProvider.credential(id_token);

    // Sign in with credential from the Google user.
    firebase.auth().signInWithCredential(credential).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });



}

// An Alternative Sign-In Function, as described under Manual Setup:

function onSignIn(googleUser) {
    console.log('Google Auth Response', googleUser);

    var id_token = googleUser.getAuthResponse().id_token
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.id_token;
            // Sign in with credential from the Google user.
            firebase.auth().signInWithCredential(credential).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
            });
        } else {
            console.log('User already signed-in Firebase.');
        }
    });
}

// To make sure user isn't already signed in:

function isUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
                // We don't need to reauth the Firebase connection.
                return true;
            }
        }
    }
    return false;
}


// Sign Out button will have method signOut():

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}

// This will auto-render a Google Sign-In Button:   (And a sign-out)

render(
    <div>
        <div class="g-signin2" data-onsuccess="onSignIn"></div>
        <a href="#" onclick="signOut();">Sign out</a>
    </div>
)


// This is example code for tracking user state across multiple tabs and devices:

// /**
//  * The Sign-In client object.
//  */
// var auth2;

// /**
//  * Initializes the Sign-In client.
//  */
// var initClient = function() {
//     gapi.load('auth2', function(){
//         /**
//          * Retrieve the singleton for the GoogleAuth library and set up the
//          * client.
//          */
//         auth2 = gapi.auth2.init({
//             client_id: 'CLIENT_ID.apps.googleusercontent.com'
//         });

//         // Attach the click handler to the sign-in button
//         auth2.attachClickHandler('signin-button', {}, onSuccess, onFailure);
//     });
// };

// /**
//  * Handle successful sign-ins.
//  */
// var onSuccess = function(user) {
//     console.log('Signed in as ' + user.getBasicProfile().getName());
//  };

// /**
//  * Handle sign-in failures.
//  */
// var onFailure = function(error) {
//     console.log(error);
// };
