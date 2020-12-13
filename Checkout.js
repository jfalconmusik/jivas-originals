import React from "react"
// import StripeCheckout from "react-stripe-checkout"

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import CheckoutForm from "./CheckoutForm"

const stripe = await loadStripe("pk_test_vSUOdXUItkZoDH7AA0LQppyq00W7RQlEuV")
const stripePromise = loadStripe("pk_test_vSUOdXUItkZoDH7AA0LQppyq00W7RQlEuV")



// const stripe = require("Stripe")("sk_test_ueyEzSe0gWZLWBJwcqGTkdgg00AfnC9xtc")
// This is currently a mesh of the basic Stripe Checkout and the Stripe Webhooks... 





// function handleToken(token, addresses) {

// }

function Checkout() {


    // const { error } = await stripe.redirectToCheckout({
    //     items: [{ sku: 100, quantity: 1 }],

    //     successUrl: 'https://fireship.io/success',
    //     cancelUrl: 'https://fireship.io/canceled'

    // })
    // if (error) {
    //     alert("broken payments lol haxorz")
    // }


    // Previous code:

    // <h1>Checkout Page!</h1>

    // let amount = 1
    // <StripeCheckout stripeKey="pk_test_vSUOdXUItkZoDH7AA0LQppyq00W7RQlEuV"
    //     token={handleToken}
    //     billingAddress
    //     shippingAddress
    //     amount={amount * 100}
    //     // price is ultimately in cents
    //     name={"Silk Set"}
    // />

    // <button onClick={Checkout}> Buy me for {amount / 100}</button>

    return (
        <div>
            <br></br>
            <br></br>
            <Elements stripe={stripePromise}>
                <CheckoutForm />
            </Elements>
            <br></br>
            <br></br>
        </div>
    )
}

export default Checkout