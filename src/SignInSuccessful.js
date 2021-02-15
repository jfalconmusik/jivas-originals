import React, { useState, useContext, useEffect } from "react"
import firebase from "firebase"
import { Link } from "react-router-dom"
import { Context } from "./Context"

function SignInSuccessful() {

    const {
        userSignedInCount,
        setUserSignedInCount,
        userInfo,
        setUserInfo,
        anonUser,
        handleSignOut,
        routerString,
        setRouterString } = useContext(Context)


    useEffect(() => {
        setRouterString("signInSuccess")
    }, [])




    const [error, setError] = useState(false)
    const [signedIn, setSignedIn] = useState(false)

    const [providerId, setProviderId] = useState("")
    const [uid, setUid] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [photoURL, setPhotoURL] = useState("")
    const [emailSent, setEmailSent] = useState(false)



    useEffect(() => {
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
                email = window.prompt('Please provide your email for confirmation');
            }
            // The client SDK will parse the code from the link for you.
            firebase.auth().signInWithEmailLink(email, window.location.href)
                .then(function (result) {
                    // Clear email from storage.
                    console.log(result)
                    window.localStorage.removeItem('emailForSignIn');
                    // You can access the new user via result.user
                    // Additional user info profile not available via:
                    // result.additionalUserInfo.profile == null
                    // You can check if the user is new or existing:
                    // result.additionalUserInfo.isNewUser
                })
                .catch(function (error) {
                    // Some error occurred, you can inspect the code: error.code
                    // Common errors could be invalid email and invalid or expired OTPs.
                    setError(true)
                    console.log(error)
                });
        }
    }, [])

    // useEffect(() => {

    //     firebase.auth().onAuthStateChanged(function (user) {
    //         if (user) {
    //             // User is signed in.
    //             user.providerData.forEach(function (profile) {
    //                 setProviderId(profile.providerId);
    //                 setUid(profile.uid);
    //                 setDisplayName(profile.displayName);
    //                 setUserEmail(profile.email);
    //                 setPhotoURL(profile.photoURL);
    //             })

    //             setUserInfo({
    //                 providerId,
    //                 uid,
    //                 displayName,
    //                 userEmail,
    //                 photoURL,
    //                 anonUser
    //             })
    //             setSignedIn(true)
    //         } else {
    //             // No user is signed in
    //             setSignedIn(false)
    //         }
    //     });
    // },
    //     [])

    useEffect(() => {
        setUserSignedInCount(Number(userSignedInCount + 1))

    }, [])

    return (
        <div>
            {error ?
                <div>
                    <h2>
                        An error occurred. Please try again.
                        Return to Sign-In:
                        </h2>
                    <div className="userAccount">
                        <div className="itemCard">
                            <button className="userButton">
                                <Link to="/account">
                                    <h2>Shop</h2>
                                </Link>
                            </button>
                        </div>
                    </div>

                </div>
                :
                <div>
                    <h2>
                        Congratulations! You're now signed in.
                        Continue Shopping:
                        </h2>
                    <div className="userAccount">
                        <div className="itemCard">
                            <Link to="/account">
                                <button className="userButton">
                                    <h2>Shop</h2>
                                </button>
                            </Link>
                        </div>
                    </div>
                    {(firebase.auth().currentUser) &&
                        <div className="userAccount">
                            <h2 className="userInfo">{userInfo.displayName}</h2>
                            <h2 className="userInfo">{userInfo.userEmail}</h2>
                            <h2 className="userInfo">{userInfo.providerId}</h2>
                            <img className="accountPhoto" src={userInfo.photoURL} />
                            <div className="itemCard">
                                <button type="button" className="userButton" onClick={() => handleSignOut()}>Sign Out</button>
                            </div>

                        </div>
                    }

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