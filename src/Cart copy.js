import React, { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import firebase from "firebase"
import CartItemList from "./CartItemList"
import { Context } from "./Context"

// objectives: 
// Handle tax and shipping.
// Ask for shipping information and promo codes.
// Express checkout

function Cart() {

    const {
        totalCost,
        itemCount,
        itemNumberString,
        routerString,
        setRouterString,
        setTermsDisplay,
        itemList
    } = useContext(Context)

    useEffect(() => {
        setRouterString("cart")
    }, [])

    useEffect(() => {
        setTermsDisplay(false);


        document.getElementById("firebaseui-auth-container").style.display = "none"
    }, [])
    // when remove from cart is clicked, subtract 1 from count and price from price

    // use proper english plurals for itemCount


    if (firebase.auth().currentUser && !firebase.auth().currentUser.isAnonymous) {
        return (
            <div>
                <h1>Cart</h1>
                <div className="row">
                    <CartItemList />
                    {(itemList.length == 0) &&
                        <div class="cart">
                            <div class="cart-text">
                                <div style={{ "align": "center" }}>
                                    <h3 style={{
                                        "margin-left": "50%",
                                        "margin-right": "50%"
                                    }}>Your shopping cart is empty.</h3>
                                </div>
                            </div>
                        </div>}
                </div>
                <h2>{itemCount} {itemNumberString} </h2>
                <h2>Subtotal: ${(totalCost / 100).toFixed(2)}</h2>
                <div className="itemCard">
                    <Link to="/checkout">
                        <button className="userButton" type="button">Enter Shipping Info</button>
                    </Link>
                </div>
            </div>
        )

    } else {
        return (
            <div className="cart">

                <h1>Cart</h1>
                <div>
                    <CartItemList />
                    {(itemList.length == 0) &&
                        <div>
                            <div >
                                <div class="blockquote text-center" style={{ "align": "center" }}>
                                    <h3 class="blockquote text-center" style={{
                                        "margin-left": "50%",
                                        "margin-right": "50%"
                                    }}>Your shopping cart is empty.</h3>
                                </div>
                            </div>
                        </div>}
                </div>
                <h2>{itemCount} {itemNumberString} </h2>
                <h2>Cart Total: ${(totalCost / 100).toFixed(2)}</h2>
                <div className="itemCard">
                    <Link to="/account">
                        <button className="userButton" type="button">Sign In to Proceed to Checkout</button>
                    </Link>
                </div>
            </div >
        )

    }
}


export default Cart

