import React from "react"
import { Link } from "react-router-dom"
import firebase from "firebase"

function Cart() {

    if (firebase.auth().currentUser) {
        return (
            <div>
                <h1>Cart Page!</h1>
                <Link to="/checkout">
                    <button type="button">Proceed to Checkout</button>
                </Link>
            </div>
        )

    } else {
        return (
            <div>
                <h1>Cart Page!</h1>
                <Link to="/cart-sign-in">
                    <button type="button">Proceed to Checkout</button>
                </Link>
            </div>
        )

    }
}

export default Cart