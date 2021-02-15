/**
* Use the CSS tab above to style your Element's container.
*/

// when reading through all this collected documentation,
// remember that the PaymentIntent API is intended to replace
// both sources and tokens. The latter two probably are not necessary at all.
// you'll have to create a webhook endpoint on your firebase somehow.

// Order of Operations:
// *** Create a paymentIntent document on database when checkout page is entered,             
// *** and link it to the specific customer by their signed-in email.                         
// *** Next time they sign in and enter checkout, a new paymentIntent will not be created     
// *** because a firestore query shows that there is already a paymentIntent associated with them 
// *** with a status which != "succeeded"
// *** When client enters card info and hits confirm, 
// *** That specific paymentIntent will be retrieved based on the customer it is
// *** connected to. run stripe.confirmCardPayment using the client_secret stored in file.
// *** If successful, change the status of the Intent on file to "succeeded" so that
// *** it will be left out of queries and allow another Intent to be created by that user.
// *** Redirect to success page,

// send webhook, send email to account on file. 

// *** Update database pending orders.
// 
// If the user updates their cart, call updatePaymentIntent to reflect the changes.

// *** If a user proceeds to checkout without signing in, they will be prompted to sign in first.

// *** If a user deletes their account, delete any unsuccessful paymentIntent under it and call
// *** cancelPaymentIntent for each.




import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import './CardSectionStyles.css'

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};


function CardSection() {
  return (
    <label>
      Card details
      <CardElement options={CARD_ELEMENT_OPTIONS} />
    </label>
  );
};

export default CardSection;





// // CREATE a CARD TOKEN:

// stripe.tokens.create(
//   {
//     card: {
//       number: '4242424242424242',
//       exp_month: 4,
//       exp_year: 2021,
//       cvc: '314',
//     },
//   },
//   function(err, token) {
//     // asynchronously called
//   }
// );

// RESPONSE will be:
// {
//     "id": "tok_1GStviHKfnno38ois88Tsd9m",
//     "object": "token",
//     "card": {
//       "id": "card_1GStviHKfnno38oiaCTf5TWH",
//       "object": "card",
//       "address_city": null,
//       "address_country": null,
//       "address_line1": null,
//       "address_line1_check": null,
//       "address_line2": null,
//       "address_state": null,
//       "address_zip": null,
//       "address_zip_check": null,
//       "brand": "Visa",
//       "country": "US",
//       "cvc_check": null,
//       "dynamic_last4": null,
//       "exp_month": 8,
//       "exp_year": 2021,
//       "fingerprint": "1vJQKj5TLiZTEVBM",
//       "funding": "credit",
//       "last4": "4242",
//       "metadata": {},
//       "name": null,
//       "tokenization_method": null
//     },
//     "client_ip": null,
//     "created": 1585698938,
//     "livemode": false,
//     "type": "card",
//     "used": false
//   }


// RETRIEVE a token. Returns the above example.
// var stripe = require('stripe')('sk_test_ueyEzSe0gWZLWBJwcqGTkdgg00AfnC9xtc');

// stripe.tokens.retrieve(
//   'tok_1GStviHKfnno38ois88Tsd9m',
//   function(err, token) {
//     // asynchronously called
//   }
// );



// CREATE a PAYMENT METHOD
// var stripe = require('stripe')('sk_test_ueyEzSe0gWZLWBJwcqGTkdgg00AfnC9xtc');

// stripe.paymentMethods.create(
//   {
//     type: 'card',
//     card: {
//       number: '4242424242424242',
//       exp_month: 4,
//       exp_year: 2021,
//       cvc: '314',
//     },
//   },
//   function(err, paymentMethod) {
//     // asynchronously called
//   }
// );


// RETRIEVE a PAYMENT METHOD
// var stripe = require('stripe')('sk_test_ueyEzSe0gWZLWBJwcqGTkdgg00AfnC9xtc');

// stripe.paymentMethods.retrieve(
//   'pm_1GYhYv2eZvKYlo2CtqDiJBiZ',
//   function(err, paymentMethod) {
//     // asynchronously called
//   }
// );

// UPDATE PAYMENT METHOD:
// var stripe = require('stripe')('sk_test_ueyEzSe0gWZLWBJwcqGTkdgg00AfnC9xtc');

// stripe.paymentMethods.update(
//   'pm_1GYhYv2eZvKYlo2CtqDiJBiZ',
//   {metadata: {order_id: '6735'}},
//   function(err, paymentMethod) {
//     // asynchronously called
//   }
// );

// CREATE CARD:
// var stripe = require('stripe')('sk_test_ueyEzSe0gWZLWBJwcqGTkdgg00AfnC9xtc');

// stripe.customers.createSource(
//   'cus_H6walJYeUsrHWO',
//   {source: 'tok_amex'},
//   function(err, card) {
//     // asynchronously called
//   }
// );

// RETRIEVE CARD:
// var stripe = require('stripe')('sk_test_ueyEzSe0gWZLWBJwcqGTkdgg00AfnC9xtc');

// stripe.customers.retrieveSource(
//   'cus_H6walJYeUsrHWO',
//   'card_1GYih4HKfnno38oi4KiVuds3',
//   function(err, card) {
//     // asynchronously called
//   }
// );

// Attach PAYMENT METHOD to Customer. Useful for DB.
// var stripe = require('stripe')('sk_test_ueyEzSe0gWZLWBJwcqGTkdgg00AfnC9xtc');

// stripe.paymentMethods.attach(
//   'pm_123456789',
//   {customer: 'cus_H6vVnQuFcQAfRx'},
//   function(err, paymentMethod) {
//     // asynchronously called
//   }
// );

// CREATE SOURCE:
// const stripe = require('stripe')('sk_test_ueyEzSe0gWZLWBJwcqGTkdgg00AfnC9xtc');

// stripe.sources.create({
//   type: 'ach_credit_transfer',
//   currency: 'usd',
//   owner: {
//     email: 'jenny.rosen@example.com'
//   }
// }, function(err, source) {
//   // asynchronously called
// });

// RETRIEVE SOURCE:
// var stripe = require('stripe')('sk_test_ueyEzSe0gWZLWBJwcqGTkdgg00AfnC9xtc');

// stripe.sources.retrieve(
//   'src_1GYih6HKfnno38oiuX1WyQxy',
//   function(err, source) {
//     // asynchronously called
//   }
// );

// CREATE SESSION:
// var stripe = require('stripe')('sk_test_ueyEzSe0gWZLWBJwcqGTkdgg00AfnC9xtc');

// stripe.checkout.sessions.create(
//   {
//     success_url: 'https://example.com/success',
//     cancel_url: 'https://example.com/cancel',
//     payment_method_types: ['card'],
//     line_items: [
//       {
//         name: 'T-shirt',
//         description: 'Comfortable cotton t-shirt',
//         amount: 1500,
//         currency: 'usd',
//         quantity: 2,
//       },
//     ],
//   },
//   function(err, session) {
//     // asynchronously called
//   }
// );

// RETRIEVE SESSION:
// var stripe = require('stripe')('sk_test_ueyEzSe0gWZLWBJwcqGTkdgg00AfnC9xtc');

// stripe.checkout.sessions.retrieve(
//   'cs_test_CLacPfG8pDQvTRPcTxG9euTTWx7kg086N0UI9GvlqxKfaKNoUqmt9dyD',
//   function(err, session) {
//     // asynchronously called
//   }
// );

// Create PaymentMethod :: Not typically used. stripe.confirmCardPayment creates automatically
//stripe
// .createPaymentMethod({
//     type: 'card',
//     card: cardElement,
//     billing_details: {
//       name: 'Jenny Rosen',
//     },
//   })
//   .then(function(result) {
//     // Handle result.error or result.paymentMethod
//   });

// !!!!!! $$$$$$$$   CREATE TOKEN based on ELEMENT
// stripe.createToken(cardElement).then(function(result) {
//     // Handle result.error or result.token
//   });
// result.token, meaning a token was created, or result.error. 

// CREATE SOURCE to pass to server to be used in API call
// stripe
//   .createSource(ibanElement, {
//     type: 'sepa_debit',
//     currency: 'eur',
//     owner: {
//       name: 'Jenny Rosen',
//     },
//   })
//   .then(function(result) {
//     // Handle result.error or result.source
//   });

// CREATE SOURCE from Raw Data
// stripe
//   .createSource({
//     type: 'ideal',
//     amount: 1099,
//     currency: 'eur',
//     owner: {
//       name: 'Jenny Rosen',
//     },
//     redirect: {
//       return_url: 'https://shop.example.com/crtA6B28E1',
//     },
//   })
//   .then(function(result) {
//     // Handle result.error or result.source
//   });

// RETRIEVE SOURCE
// stripe
//   .retrieveSource({
//     id: '{SOURCE_ID}',
//     client_secret: '{SOURCE_CLIENT_SECRET}',
//   })
//   .then(function(result) {
//     // Handle result.error or result.source
//   });

// CONFIRM CARD PAYMENT. confirms payment intent with data provided. Creates payment method object

// stripe
//   .confirmCardPayment('{PAYMENT_INTENT_CLIENT_SECRET}', {
//     payment_method: {
//       card: cardElement,
//       billing_details: {
//         name: 'Jenny Rosen',
//       },
//     },
//   })
//   .then(function(result) {
//     // Handle result.error or result.paymentIntent
//   });
// can include props...
//  receipt_email: string
// save_payment_method: boolean         -- saves to Customer
// setup_future_usage: boolean          -- saves to Customer
// will take data from ELEMENT if cardElement is attached to card prop

// many other payment methods exist for lots of different banks. refer to stripe.com/docs/js/payment_intents




// setupIntent:             --useful for storing card info for later. Attach payment method to this.
//stripe.setupIntents.create(
//     {payment_method_types: ['card']},
//     function(err, setupIntent) {
//       // asynchronously called
//     }
//   );
// can attach payment method object as prop

// Retrieve setupIntent:            -- call using the id of the setup intent
// stripe.setupIntents.retrieve(
//     'seti_123456789',
//     function(err, setupIntent) {
//       // asynchronously called
//     }
//   );

// Confirm setupIntent:         -- put on Save Payment Method button of site.
// stripe.setupIntents.confirm(
//     'seti_123456789',
//     {payment_method: 'pm_card_visa'},
//     function(err, setupIntent) {
//       // asynchronously called
//     }
//   );


// CREATE CHARGE:       -- presumably unnecessary with paymentIntents

// stripe.charges.create(
//     {
//       amount: 2000,
//       currency: 'usd',
//       source: 'tok_mastercard',
//       description: 'My First Test Charge (created for API docs)',
//     },
//     function(err, charge) {
//       // asynchronously called
//     }
//   );





// create stripe elements
// var elements = stripe.elements();
// var cardElement = elements.create('card');
// var cardElement = elements.getElement('card');   -- looks up previously created card


// ELEMENT on change
// cardElement.on('change', function(event) {
//     if (event.complete) {
//       // enable payment button
//     } else if (event.error) {
//       // show validation to customer
//     }
//   });

// Handle click element. Only works from a payment request element
// paymentRequestButtonElement.on('click', function(event) {
//     // Handle click event
//   });

// Mount the element to html dom. enables styling.

// <!-- Mount the instance within a <label> -->
// <label>Card
//   <div id="card-element"></div>
// </label>

// <!--
//   Or create a <label> with a 'for' attribute,
//   referencing the ID of your container.
// -->
// <label for="card-element">Card</label>
// <div id="card-element"></div>

// <script>
//   cardElement.mount('#card-element');
// </script>

// element container -- allows styling
{/* <style>
  .my-input {
    padding: 10px;
    border: 1px solid #ccc;
  }
</style>

<form>
  <div>
    <label>Name</label>
    <input class="my-input">
  </div>
  <div>
    <label>Card</label>
    <!-- Using the same "my-input" class on the -->
    <!-- regular input above and on this container. -->
    <div class="my-input" id="card-element"></div>
  </div>
</form> */}

// The cardElement React component removes the need for this, as cardElement can be called with
// all styling parameters as properties.
// useElements can be called in order to reference whatever mounted Element you have.

// For instance: const elements = useElements       
// const cardElement = elements.getElement(CardElement)
// const {error, paymentMethod} = await stripe.createPaymentMethod({
// type: 'card',
// card: cardElement
//})

// the below is used in our sample code. 
// All the app. stuff in unnecessary because we aren't express hosted.
// instead, create a firebase function that creates and sends us a paymentIntent when we ask for it
// const paymentIntent = await stripe.paymentIntents.create({
//     amount: 1099,
//     currency: 'usd',
//     // Verify your integration in this guide by including this parameter
//     metadata: {integration_check: 'accept_a_payment'},
//   });




// Create PAYMENT_INTENT    -- set up a payment intent at beginning of checkout,
// then try to reuse this same intent if checkout is resumed.
// this is typically done by retrieving the idempotency key, which will be a cart or customer
// session key.

// Payment intents create the client_secret, which will be called during confirmCardPayment.
// create a firebase function that makes a payment_intent when checkout is started.
//
// can also pass metadata object with props that can be valuable for analytics.
// 

// stripe.paymentIntents.create(
//     {
//       amount: 2000,
//       currency: 'usd',
//       payment_method_types: ['card'],
//     },
//     function(err, paymentIntent) {
//       // asynchronously called
//     }
//   );

// can set confirm=true to confirm in the same call.

// RETRIEVE paymentIntent

// stripe.paymentIntents.retrieve(
//     'pi_1GY1TlHKfnno38oiBx0UIlid',
//     function(err, paymentIntent) {
//       // asynchronously called
//     }
//   );

// CONFIRM payment Intent.      Useful if we want a separate confirm page.
// stripe.paymentIntents.confirm(
//     'pi_1GY1TlHKfnno38oiBx0UIlid',
//     {payment_method: 'pm_card_visa'},
//     function(err, paymentIntent) {
//       // asynchronously called
//     }
//   );


// CANCEL paymentIntent
// stripe.paymentIntents.cancel(
//   'pi_1GY1TlHKfnno38oiBx0UIlid',
//   function(err, paymentIntent) {
//     // asynchronously called
//   }
// );


// This demonstrates how to grab a client secret via http request to a specific page.
// will not work in our use case, but this is a great example of fetching
// client-side using React. Workshop this example.

// var response = fetch('/secret').then(function(response) {
//     return response.json();
//   }).then(function(responseJson) {
//     var clientSecret = responseJson.client_secret;
//     // Call stripe.confirmCardPayment() with the client secret.
//   });

// BETTER EXAMPLE (ESNEXT:
// (async () => {
//     const response = await fetch('/secret');
//     const {client_secret: clientSecret} = await response.json();
//     // Call stripe.confirmCardPayment() with the client secret.
//   })();

/// OR

// app.get('/secret', async (req, res) => {
//     const intent = // ... Fetch or create the PaymentIntent
//     res.json({client_secret: intent.client_secret});
//   });
// ^^^ using express, of course, which we're not using.


// The next snippet is the entire payment retrieval step. 
// The only thing that needs to be workshopped is the client secret, which needs to be
// drawn from a payment intent we created.

// Afterward, stripe will send a payment_intent.succeeded. Use a custom webhook to send a receipt
// and log a success to database.


// import React from 'react';
// import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';

// import CardSection from './CardSection';

// export default function CheckoutForm() {
//   const stripe = useStripe();
//   const elements = useElements();

//   const handleSubmit = async (event) => {
//     // We don't want to let default form submission happen here,
//     // which would refresh the page.
//     event.preventDefault();

//     if (!stripe || !elements) {
//       // Stripe.js has not yet loaded.
//       // Make sure to disable form submission until Stripe.js has loaded.
//       return;
//     }

//     const result = await stripe.confirmCardPayment('{CLIENT_SECRET}', {
//       payment_method: {
//         card: elements.getElement(CardElement),
//         billing_details: {
//           name: 'Jenny Rosen',
//         },
//       }
//     });

//     if (result.error) {
//       // Show error to your customer (e.g., insufficient funds)
//       console.log(result.error.message);
//     } else {
//       // The payment has been processed!
//       if (result.paymentIntent.status === 'succeeded') {
//         // Show a success message to your customer
//         // There's a risk of the customer closing the window before callback
//         // execution. Set up a webhook or plugin to listen for the
//         // payment_intent.succeeded event that handles any business critical
//         // post-payment actions.
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <CardSection />
//       <button disabled={!stripe}>Confirm order</button>
//     </form>
//   );
// }

