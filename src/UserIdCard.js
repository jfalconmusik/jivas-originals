import React, { useState, useContext } from "react"
import firebase from "firebase"

function UserIdCard() {

    const { userInfo } = useContext(Context)


    if (userInfo.displayName && userInfo.userEmail && userInfo.photoURL) {
        return (
            <div>
                <h3>Signed in as: {props.displayName}</h3>
                <h3>Email: {props.userEmail}</h3>
                <img src={props.photoURL} style="width:100px;height:100px;" />}
            </div>
        )
    } else if (userInfo.userEmail && userInfo.photoURL) {
        return (
            <div>
                <h3>Email: {userInfo.userEmail}</h3>
                <img src={userInfo.photoURL} style="width:100px;height:100px;" />}
            </div>
        )
    } else if (userInfo.userEmail) {
        return (
            <div>
                <h3>Email: {userInfo.userEmail}</h3>
            </div>
        )
    } else {
        return (
            <div>
                <h3>You are signed in.</h3>
            </div>
        )
    }

}



export default UserIdCard