import React from "react"

import firebase from "firebase"
import * as firebaseui from "firebaseui"
// const sgMail = require('@sendgrid/mail');

// { useState }
// import { Link } from "react-router-dom"

function SignInWithEmailv2() {

    if (!firebase.auth().currentUser) {

        var data = null;
        var anonymousUser = firebase.auth().currentUser
        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        ui.start('#firebaseui-auth-container', {
            autoUpgradeAnonymousUsers: true,
            signInSuccessUrl: 'https://jiva-website-405ed.firebaseapp.com/sign-in-success',
            credentialHelper: 'none',
            signInFlow: 'redirect',

            signInOptions: [
                {
                    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                    signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
                },
            ],
            callbacks: {
                // signInFailure callback must be provided to handle merge conflicts which
                // occur when an existing credential is linked to an anonymous user.
                signInFailure: function (error) {
                    // For merge conflicts, the error.code will be
                    // 'firebaseui/anonymous-upgrade-merge-conflict'.
                    if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
                        return Promise.resolve();
                    }
                    // The credential the user tried to sign in with.
                    var cred = error.credential;
                    // Copy data from anonymous user to permanent user and delete anonymous
                    // user.
                    // ...
                    // Finish sign-in after data is copied.
                    return firebase.auth().signInWithCredential(cred);
                }
            }
            // Other config options...
        });

        return (
            <div id="firebaseui-auth-container"></div>
        )

    }
}

// const [emailLoginError, setEmailLoginError] = useState(false)
// const [passwordDisplayed, setPasswordDisplayed] = useState(false)
// const [emailSent, setEmailSent] = useState(false)
// const [removeFirstLogin, setRemoveFirstLogin] = useState(false)


// function handlePasswordDisplayed() {
//     setPasswordDisplayed(true)
//     setRemoveFirstLogin(true)
// }

// function handleEmailLogin() {
//     let email = document.getElementById("emailInput").value
//     let password = document.getElementById("passwordInput").value

//     firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
//         // Handle Errors here.
//         setEmailLoginError(true)
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         // ...
//     });

// }

// function handleEmailLink() {
//     let email = document.getElementById("emailInput").value
//     window.localStorage.setItem('emailForSignIn', email)

//     // using Twilio SendGrid's v3 Node.js Library
//     // https://github.com/sendgrid/sendgrid-nodejs
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//     const msg = {
//         to: email,
//         from: 'noreply@jivafashions.com',
//         subject: 'Jiva - Confirm Email',
//         text: 'Follow the link below to confirm your email address.',
//         html: '<a href="https://jiva-website-405ed.firebaseapp.com/sign-in-success-email">Finish Login</a>',
//     };
//     sgMail.send(msg);

//     setEmailSent(true)
//     setRemoveFirstLogin(true)





// }

//         <div>

//     <Link to="/account">Go Back</Link>
//     <br></br>
//     <h2>Email:</h2>
//     <input type="text" id="emailInput"></input>
//     <button type="button" onClick={() => handleEmailLink()}>Create Account With This Email</button>
//     <br></br>
//     {(!removeFirstLogin) &&
//         <button type="button" onClick={() => handlePasswordDisplayed()}>Login</button>}

//     {(emailSent == true) &&
//         (<div>
//             <h2>A confirmation email has been sent to the address you submitted.</h2>
//             <h2>Please follow the link to continue.</h2>
//         </div>)}

//     {(passwordDisplayed == true) &&
//         (<div>
//             <br></br>
//             <h2>Password:</h2>
//             <input type="text" id="passwordInput"></input>
//             <button type="button" onClick={() => handleEmailLogin()}>Confirm Login</button>

//             {(emailLoginError == true) &&
//                 (<div>
//                     <h3>Your information doesn't match our records. Please try again.</h3>
//                 </div>)}

//         </div>)}

// </div>


export default SignInWithEmailv2