import React, { useState, useContext } from "react"
import firebase from "firebase"
import { Link } from "react-router-dom"
import { Context } from "./Context"

function SignInSuccessful() {

    const { userInfo, setUserInfo } = useContext(Context)

    const [error, setError] = useState(false)
    const [signedIn, setSignedIn] = useState(false)

    const [providerId, setProviderId] = useState("")
    const [uid, setUid] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [photoURL, setPhotoURL] = useState("")
    const [emailSent, setEmailSent] = useState(false)



    // Confirm the link is a sign-in with email link.
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
        // Additional state parameters can also be passed via URL.
        // This can be used to continue the user's intended action before triggering
        // the sign-in operation.
        // Get the email if available. This should be available if the user completes
        // the flow on the same device where they started it.
        var email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            // User opened the link on a different device. To prevent session fixation
            // attacks, ask the user to provide the associated email again. For example:
            email = window.prompt('Please provide your email for confirmation')
        }
        // The client SDK will parse the code from the link for you.
        firebase.auth().signInWithEmailLink(email, window.location.href)
            .then(function (result) {
                // Clear email from storage.
                // You can check if the user is new or existing:
                // You can access the new user via result.user
                // Additional user info profile not available via:
                // result.additionalUserInfo.profile == null
                // result.additionalUserInfo.isNewUser
                // window.close()
            })
            .catch(function (error) {
                // Some error occurred, you can inspect the code: error.code
                // Common errors could be invalid email and invalid or expired OTPs.
                setError(true)
            });

    }

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            setSignedIn(true)
            user.providerData.forEach(function (profile) {
                setProviderId(profile.providerId);
                setUid(profile.uid);
                setDisplayName(profile.displayName);
                setUserEmail(profile.email);
                setPhotoURL(profile.photoURL);
            })

        } else {
            // No user is signed in
            setSignedIn(false)
        }
    });

    return (
        <div>
            {error ?
                <div>
                    <h2>
                        An error occurred. Please try again.
                        Return to Sign-In:
                        </h2>
                    <Link to="/account">My Account</Link>
                </div>
                :
                <div>
                    <h2>
                        Congratulations! You're now signed in.
                        Continue Shopping:
                        </h2>
                    <Link className="shop" to="/shop">Shop</Link>
                    <h2>{(signedIn || firebase.auth().currentUser) ?
                        providerId + " " +
                        uid + " " +
                        displayName + " " +
                        userEmail
                        : "No, you're not signed in."}</h2>
                    {firebase.auth().currentUser && <img className="accountPhoto" src={photoURL} />}
                </div>
            }
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
        </div >
    )

}




export default SignInSuccessful