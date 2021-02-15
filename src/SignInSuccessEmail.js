import React, { useState, useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { Context } from "./Context"
import firebase from "firebase"

function SignInSuccessEmail() {

    const [confirmEmail, setConfirmEmail] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [signUpComplete, setSignUpComplete] = useState(false)


    const {
        routerString,
        setRouterString } = useContext(Context)

    useEffect(() => {
        setRouterString("signInSuccessEmail")
    }, [])


    let email = window.localStorage.getItem('emailForSignIn')





    function handleConfirmEmail() {

        let userEmail = document.getElementById("emailVal").value

            (email == userEmail)
            ?
            setConfirmEmail(true)
            :
            setEmailError(true)
    }

    function handleFinishSignUp() {
        let password = document.getElementById("passwordVal").value
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(window.localStorage.removeItem("emailForSignIn"))
            .then(setSignUpComplete(true))
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
            });

    }
    // // will require a password...

    // // API to sign in with email/password:



    // // API to create email/password account:


    // firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
    //     // Handle Errors here.
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //     // ...
    // });


    // // API to update email address:
    // var user = firebase.auth().currentUser;

    // user.updateEmail("user@example.com").then(function () {
    //     // Update successful.
    // }).catch(function (error) {
    //     // An error happened.
    // });

    if (!signUpComplete) {
        return (
            <div>
                <h2>Please confirm your email address:</h2>
                <input type="text" id="emailVal"></input>
                <button type="button" onClick={() => handleConfirmEmail}>Confirm Email</button>
                <br></br>
                {confirmEmail &&
                    <div>
                        <h2>Please choose a password:</h2>
                        <input type="text" id="passwordVal"></input>
                        <button type="button" onClick={() => handleFinishSignUp}>Finish Sign Up</button>
                    </div>}
                {emailError &&
                    <div>
                        <h2>Your email doesn't match what we have on file. Please try again.</h2>
                    </div>}

            </div>
        )
    } else {
        return (
            <div>
                <h1>Sign Up Successful!</h1>
                <h2>Continue Shopping:</h2>
                <Link to="/shop">Shop</Link>
            </div>
        )
    }

}

export default SignInSuccessEmail