import React, { useContext, useEffect } from "react"
import { Context } from "./Context"

function OrderSuccess() {

    const {
        routerString,
        setRouterString,
        setTermsDisplay } = useContext(Context)

    useEffect(() => {
        setRouterString("orderSuccess")
    }, [])

    useEffect(() => {
        setTermsDisplay(false);
        document.getElementById("firebaseui-auth-container").style.display = "none"
    }, [])

    return (
        <div>

            <h1>Your Order is Complete!</h1>
            <h2>Items purchased: </h2>
            <h2>Amount Paid: </h2>
            <h2>Estimated Arrival Date: </h2>
        </div>
    )
}

export default OrderSuccess