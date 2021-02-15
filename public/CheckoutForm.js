import React, { useState } from "react"
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import admin from "firebase-admin"

import CardSection from "./CardSection"
import Cart from "./Cart"

export default function CheckoutForm() {
    const stripe = useStripe()
    const elements = useElements()

    // ^^ yet to define.

    // get email of current user
    let user = firebase.auth().currentUser
    let email = user.email
    // get stripe customer document by email
    let stripeCustomersRef = db.collection(`stripe_customers`)
    let stripeCustomerEmailQuery = stripeCustomersRef.where('customer_email', '==', email)
        .where('status', "!=", "succeeded").get()
    // get payment intent by ID of stripe customer
    let stripePaymentIntents = db.collection('stripe_paymentIntents')

    stripePaymentIntents.where(
        'customer', '==', stripeCustomerEmailQuery.customer_id).get()
        .then(doc => {
            if (!doc.exists) {
                // if intent doesn't exist, create a firestore document,
                // which calls a firebase function creating paymentIntent, attaching customer ID.
                // ID and cart amount are preserved.

                let data = {
                    amount: cart.amount,
                    customer: stripeCustomerEmailQuery.customer_id
                }
                admin.firestore().collection('stripe_paymentIntents').doc(user.uid).set(data)

            }
        });




    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault()
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        // get the client secret from the document

        stripePaymentIntents.where(
            'customer', '==', stripeCustomerEmailQuery.customer_id).get()
            .then(doc => {
                clientSecret = doc.client_secret

            })



        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: "Happy Consumer",
                },
            }
        })

        if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            console.log(result.error.message)
        } else {
            // The payment has been processed!
            if (result.paymentIntent.status === "succeeded") {
                stripeCustomerEmailQuery.set({
                    ...result.paymentIntent
                })

                let order_data = {
                    data,
                    items: cart.items
                }

                admin.firestore().collection('orders').doc(user.uid).set({ order_data })
                window.location = "https://jiva-website-405ed.firebaseapp.com/order-success"
                // Show a success message to your customer
                // There's a risk of the customer closing the window before callback
                // execution. Set up a webhook or plugin to listen for the
                // payment_intent.succeeded event that handles any business critical
                // post-payment actions.
            }
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <CardSection />
            <button disabled={!stripe}>Confirm Order</button>
        </form>
    )
}