import React, { useContext, useState, useEffect } from "react"
import firebase from "firebase"
import { Context } from "./Context"
import AllProducts from "./AllProducts"
// import { getClass } from "../utils"

// objectives: 
// Fundamentally redesign shop to programmatically render items from productsDocument
// in db, and using forEach. addToCart(props) <-- props should carry everything necessary
// to get the proper storageRef, instead of every string being hardcoded.
//
// "in cart" marker
//
// Scrolling over images gives the option to zoom in, add to wishlist or cart. Save card to user.
// SKU and db registry for each.


function ShopFullSets() {

    const {
        routerString,
        setRouterString,
        setTermsDisplay
    } = useContext(Context)

    useEffect(() => {
        setRouterString("shop")
    }, [])

    useEffect(() => {
        setTermsDisplay(false);
        document.getElementById("firebaseui-auth-container").style.display = "none"
    }, [])

    return (
        <div>
            <h1>Full Sets</h1>
            <main className="productCard">
                <div className="row">
                    <AllProducts />
                </div>


            </main>
        </div >
    )
}

export default ShopFullSets