import React, { useState, useContext } from "react"
import firebase from "firebase"

function UserIdCard(props) {


    if (props.displayName && props.userEmail && props.photoURL) {
        return (
            <div>
                <h3>Signed in as: {props.displayName}</h3>
                <h3>Email: {props.userEmail}</h3>
                <img src={props.photoURL} style="width:100px;height:100px;" />
            </div>
        )
    } else if (props.userEmail && props.photoURL) {
        return (
            <div>
                <h3>Email: {props.userEmail}</h3>
                <img src={props.photoURL} style="width:100px;height:100px;" />
            </div>
        )
    } else if (props.userEmail) {
        return (
            <div>
                <h3>Email: {props.userEmail}</h3>
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