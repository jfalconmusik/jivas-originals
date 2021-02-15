import React, { useState, useContext } from React
import { Context } from "src/Context"
import useHover from "../useHover"
import StripeCheckout from "react-stripe-checkout"

function CartItem({ item }) {
    const { removeFromCart } = useContext(Context)
    const [hovered, ref] = useHover()

    const iconClassName = hovered ? "ri-delete-bin-fill" : "ri-delete-bin-line"

    const { error } = await stripe.redirectToCheckout({
        items: [{ sku, quantity: 1 }],

        successUrl: 'https://fireship.io/success',
        cancelUrl: 'https://fireship.io/canceled'

    })
    if (error) {
        alert("broken payments lol haxorz")
    }



    return (
        <div className="cart-item">
            <i
                className={iconClassName}
                onClick={() => removeFromCart(item.id)}
                ref={ref}
            >
            </i>
            <img src={item.src} width="130px">
            </img>
            <button onClick={Checkout}> Buy me for {amount / 100}</button>
        </div>
    )
}

// Custom Stripe UI Step 1 Continuation:

import { onMount } from "svelte";

let elements = stripe.elements();
let card;
let cardElement;
let Complete = false;

let paymentIntent;
let clientSecret;

onMount(async () => {
    paymentIntent = await createIntent();
    clientSecret = paymentIntent.client_secret;
    console.log(paymentIntent)
    createCardForm();
})

// "                 " Step 2:
async function createIntent() {
    const url = api + '/intents';
    const params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount })
    }

    return (await fetch(url, params)).json();

    console.log(paymentIntent);
}


// Step 3
async function createCardForm() {
    cardElement = elements.create('card');
    cardElement.mount(card);

    cardElement.on('change', (e) => complete = e.complete)
}
// return(
// <div class="elements" bind:this={card}></div>
// )

// Step 4
async function submitPayment() {
    const result = await stripe.handleCardPayment(
        clientSecret, cardElement, {
        payment_method_data: {

        }
    }
    )

    paymentIntent = result.paymentIntent;

    console.log(paymentIntent)

    if (result.error) {
        console.error(error);
        alert('fuck what the fuck am i even doing dude, shit')
    }

}

export default CartItem