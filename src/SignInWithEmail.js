import React, { useState, useContext, useEffect } from "react"
import { Context } from "./Context"
import firebase from "firebase"
import Flexbox from "flexbox-react"


// checklist:
// try firebase method again, check errors
// use nodemailer if necessary
// function creates db doc with email info and uid, sends sign in email
// containing a link to success page with email + uid in trailing text of url
//  that page creates user with those creds.
// sign in button in addition to create account button.


function SignInWithEmail() {


    const [emailInputDisplayed, setEmailInputDisplayed] = useState(false)
    const [inputEmail, setInputEmail] = useState("")
    const [linkSent, setLinkSent] = useState(false)

    const {
        routerString,
        setRouterString,
        isLargeScreen
    } = useContext(Context)

    useEffect(() => {
        setRouterString("signInEmail")
    }, [])


    function sendEmail() {

        var email = document.getElementById("userEmail").value
        setInputEmail(email)
        setLinkSent(true);
        setEmailInputDisplayed(false)
        firebase.auth().sendSignInLinkToEmail(email, {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be whitelisted in the Firebase Console.
            url: 'https://jiva-website-405ed.firebaseapp.com/sign-in-successful',
            // This must be true.
            handleCodeInApp: true,
            iOS: {
                bundleId: 'com.example.ios'
            },
            android: {
                packageName: 'com.example.android',
                installApp: true,
                minimumVersion: '12'
            },
            // dynamicLinkDomain: 'https://jiva-website-405ed.web.app/'
        })
            .then(function () {
                // The link was successfully sent. Inform the user.
                // Save the email locally so you don't need to ask the user for it again
                // if they open the link on the same device.
                window.localStorage.setItem('emailForSignIn', email);
                window.alert("Sending email link!")
            })
            .catch(function (error) {
                // Some error occurred, you can inspect the code: error.code
                window.alert("An error occurred... " + error)
            });

    }

    function alternateInput() {
        setEmailInputDisplayed(!emailInputDisplayed)
        // setLinkSent(false)
    }





    return (
        <div>
            <button
                style={{
                    "maxHeight": "2.5em",
                    "marginBottom": "-1em",
                    "position": "relative"
                }}
                className="continueEmail"
                type="button"
                onClick={() => alternateInput()}>
                <Flexbox flexDirection="row" style={{
                    "position": "relative",
                    "bottom": ".3em",
                    "marginBottom": "0em"
                }}>
                    <img style={{
                        "position": "relative",
                        "marginRight": '1em',
                        "bottom": ".4em"
                    }}
                        width="20vw"
                        height="auto"
                        src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/mail%202.svg?alt=media&token=445846fe-a33f-49fc-852a-3ff669194654">
                    </img>
                    <p>Sign in with Email</p>
                </Flexbox>
            </button>
            {emailInputDisplayed &&
                <div className="centered"
                    style={{
                        "width": `${isLargeScreen ? "33%" : "66"}`,
                        "whiteSpace": "nowrap"
                    }}>
                    <form style={{ "margin-top": "2em" }}>
                        <input
                            placeholder="Email address"
                            className="emailInput"
                            type="text"
                            id="userEmail" />
                        <button
                            className="button primary"
                            type="button"
                            onClick={() => sendEmail()}>Send Email Link</button>
                    </form>
                </div>
            }
            {
                linkSent &&
                <div
                    className="shadowed centered"
                    style={{
                        "maxWidth": `${isLargeScreen ? "33%" : "99%"}`,
                        "marginTop": "1em",
                        "marginBottom": `${isLargeScreen ? "initial" : "2em"}`
                    }}>
                    <p>Thank you, a confirmation email has been sent to your email address. Please
                    follow the link to continue.
                    </p>
                </div>
            }
        </div >
    )
}






// // After asking the user for their email.
// var email = window.prompt('Please provide your email');
// firebase.auth().fetchSignInMethodsForEmail(email)
//     .then(function (signInMethods) {
//         // This returns the same array as fetchProvidersForEmail but for email
//         // provider identified by 'password' string, signInMethods would contain 2
//         // different strings:
//         // 'emailLink' if the user previously signed in with an email/link
//         // 'password' if the user has a password.
//         // A user could have both.
//         if (signInMethods.indexOf(
//             firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD) != -1) {
//             // User can sign in with email/password.
//         }
//         if (signInMethods.indexOf(
//             firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD) != -1) {
//             // User can sign in with email/link.
//         }
//     })
//     .catch(function (error) {
//         // Some error occurred, you can inspect the code: error.code
//     });



export default SignInWithEmail