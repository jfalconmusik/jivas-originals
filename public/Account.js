import React, { useState, useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import firebase from "firebase"
import * as firebaseui from "firebaseui"
import { Context } from "./Context"
import SignInWithEmail from "./SignInWithEmail"

function Account() {
    // const { userInfo, setUserInfo } = useContext(Context)

    const [providerId, setProviderId] = useState("")
    const [uid, setUid] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [photoURL, setPhotoURL] = useState("")

    function handleReload() {
        window.location.reload()
    }

    // useEffect(() => setUserInfo({
    //     ...userInfo,
    //     userName: displayName,
    //     userMail: userEmail,
    //     userPhotoUrl: photoURL
    // })
    //     , [photoURL])

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            user.providerData.forEach(function (profile) {
                setProviderId(profile.providerId);
                setUid(profile.uid);
                setDisplayName(profile.displayName);
                setUserEmail(profile.email);
                setPhotoURL(profile.photoURL);
            })



        } else {
            // No user is signed in
            console.log("No user signed in.")
        }
    });

    function handleSignOut() {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
        }).catch(function (error) {
            // An error happened.
        });
        window.location.reload()
    }


    // if (ui.isPendingRedirect()) {
    //     ui.start('#firebaseui-auth-container', uiConfig);
    // }

    // ui.start('#firebaseui-auth-container', uiConfig);
    // this version now attempts to use the firebase-UI. Let's see if it works.

    if (!firebase.auth().currentUser) {

        var data = null;
        var anonymousUser = firebase.auth().currentUser
        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        ui.start('#firebaseui-auth-container', {
            autoUpgradeAnonymousUsers: true,
            signInFlow: 'popup',
            signInSuccessUrl: 'https://jiva-website-405ed.firebaseapp.com/sign-in-successful',
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                firebase.auth.TwitterAuthProvider.PROVIDER_ID,
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
        // <Link to='/sign-in-with-email-v2' onClick={() => handleReload()}>Sign In With Email</Link>
        return (

            <div>
                <h1>Account Page!</h1>
                <h2>Choose a sign-in method below:</h2>
                <SignInWithEmail />
                <div id="firebaseui-auth-container"></div>
                <h4>By signing up, you agree to our <Link to="/privacy-policy">Privacy Policy</Link> and our <Link to="/terms-of-service">Terms of Service</Link></h4>
            </div>
        )
    } else if (firebase.auth().currentUser) {
        return (
            <div>
                <h1>Account Page!</h1>
                <h2>You are signed in as:</h2>
                <h2>{providerId + " " +
                    uid + " " +
                    displayName + " " +
                    userEmail}</h2>
                <img className="accountPhoto" src={photoURL} />
                <button type="button" onClick={() => handleSignOut()}>Sign Out</button>
            </div>
        )
    }
}

// includes to firebase auth UI ID.

export default Account