import React from "react"
import firebase from "firebase"

function signOutButton() {

    return (
        <div>
            <button onClick={() => {
                firebase.auth().signOut().then(function () {
                    // Sign-out successful.
                }).catch(function (error) {
                    // An error happened.
                })
            }

            }

            ></button>
        </div>
    )
}

export default signOutButton
