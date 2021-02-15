/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp({
    databaseURL: 'https://jiva-website-405ed.firebaseio.com',
    credential: admin.credential.cert({
        projectId: "jiva-website-405ed",
        clientEmail: "jiva-website-405ed@appspot.gserviceaccount.com",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCeF0iLnQOXiL0P\nI2egiMweuqULCstyoWvrvKnJ5w7bXxdSykvMygy/Yr/fAxxjedV/RpcKQqHXSD4L\n7zB5tjVfbBSbG9+8dGNYRqz3OobLuDCpY2ce7Th3AvRjY0lrdolHWIBK472CnDcu\n/XfSYodw9A1IeRLkT1++hK/fMXPXfPCx/q3pz0yCwqzkrUg8o0d5+gxB/SlHf/tZ\n8RdhjO0VC0IUEYu9lQtV9jfPXwbw+5i4dshPdwcjAPVpnZSBhdbDVzcyuDiBTYmi\nyFr9ohc5h/xCdklXeJEVqeq3pFWh9HYYxv2Qr94rtud22dqiPNUPC2AHiQtbBdes\n3+BMZ4MjAgMBAAECggEABTu9FY4Vk9sdcxZXdFuC8lN4ajSpxnosgenFbx8cgUuV\nEJMMzlMz99PziRTnyC080ZFLJ7ZL+D32e9unrafH/Ygs6HOURP9PWJlCWY7Q7oaC\n6eCWBdKRh3MMFwwu3oVWhwuZd6ExYVT9iKswX8EOPcF+fRMw+mjcQQjQb6GJ9ayq\nUNARqxht6ccYvWaQfCMB8oWvcxVQYgQUWh5tF+vU6//rU7zDb8f4GbT80ppMIV3K\nSj9ptwQXId5t2SZHJvn8z/pjb0nlNISIVbN/8rRrw8i2gFYJkKwCPyAYlf7P91Wg\n+CTSkrmOQ8JYRgfyajB61ijCdI8yObhO64FWxoEidQKBgQDRIa3luGGMPIBkSYrx\nUtz9Owvdlw7pd25RUpTz8Mli8f7wleFpWhiGo6FON3eHm+/Xef3LWUHmo6lkhGyg\n36dZjLGdxf8AQWVyj9oeKXTWukxB3ELCi0jbqLokiAx+KZnTDL3Qze2KZDX5TW1v\nO31dnJ0Hwmd2rnMo1Cny9Na69QKBgQDBhUvUCFp1BnqgVsbJDdMGKBTyz2ugteCm\npHGHwhMH4qOdOuroNaeaJtiJlxBqbU3gCZW5tdycG1SICTml5krWbNgN7ah26us8\nCgqKNl4qlXqWlKEo536Z21gAd4aeSDL0BYLsvY1JpzfESWAYUEgMSXlOJLjwyFue\npMKjUNmmtwKBgQC3CDD4Uu0dHX6JR0xRdWJwRxNVdvXYI2zrw8kVzvGSpZWo3qSP\n3giFHgT5PdZhW3sILX6QUKg6wZZpoPSpv9TprRdurHFHufSd1YTizQmzPQ2svqe3\nOMwlY4C2pFO6v5IfgpFGhFSXwKj0bm2O4pQQMBfHSL/gwUGMxFOKjfq5WQKBgA5B\nn6BzLRbJ72a4fdR57D3b3g81MJyaSX59Rs/VgElobN08ZenNahd1HSaltlPg0Yfb\nrOgNeb8WVFfhNhn+qSy6v//mri50h/fYVYZxEubYNDu7n1PAGheDjSwbohMvBnHr\npgWCwVHXu8f+D9I6t9QP5ZvYILe8SuOZB624WxBpAoGBAMLj8nOI8sKnBk+6G4Il\nN5VEbBtsVujCR+0UlcD4wkcmFc6yWKGZfodQwpVmde1MOb0sLQYiL8WMzBNA0J0c\nPsj0mm9CbNO+fPVZomL7Y1tdjwh6IA/PjxfN0T6cLynSJXks1kEb2tYjbZ/17xgr\nJsST4Pr2TGOjUh1vaA21DFIz\n-----END PRIVATE KEY-----\n"
    })
})

const db = admin.firestore()

const logging = require('@google-cloud/logging');
const stripe = require('stripe')(functions.config().stripe.token);
const currency = functions.config().stripe.currency || 'USD';

// Replace if using a different env file or config
// const env = require("dotenv").config({ path: "./.env" });
// const stripe = require("stripe")("sk_test_ueyEzSe0gWZLWBJwcqGTkdgg00AfnC9xtc");



// [START chargecustomer]
// Charge the Stripe customer whenever an amount is created in Cloud Firestore
// exports.createStripeCharge = functions.firestore.document('stripe_customers/{userId}/charges/{id}').onCreate(async (snap, context) => {
//     const val = snap.data();
//     try {
//         // Look up the Stripe customer id written in createStripeCustomer
//         const snapshot = await admin.firestore().collection(`stripe_customers`).doc(context.params.userId).get()
//         const snapval = snapshot.data();
//         const customer = snapval.customer_id
//         // Create a charge using the pushId as the idempotency key
//         // protecting against double charges 
//         const amount = val.amount;
//         const idempotencyKey = context.params.id;
//         const charge = { amount, currency, customer };
//         if (val.source !== null) {
//             charge.source = val.source;
//         }
//         const response = await stripe.charges.create(charge, { idempotency_key: idempotencyKey });
//         // If the result is successful, write it back to the database
//         return snap.ref.set(response, { merge: true });
//     } catch (error) {
//         // We want to capture errors and render them in a user-friendly way, while
//         // still logging an exception with StackDriver
//         console.log(error);
//         await snap.ref.set({ error: userFacingMessage(error) }, { merge: true });
//         return reportError(error, { user: context.params.userId });
//     }
// });
// [END chargecustomer]]

// When a user is created, register them with Stripe
exports.createStripeCustomer = functions.auth.user().onCreate(async (user) => {
    const customer = await stripe.customers.create({ email: user.email });
    return admin.firestore().collection('stripe_customers').doc(user.uid)
        .set({
            customer_id: customer.id,
            customer_email: user.email,
            userID: user.uid
        });
});

// callable, get stripe customer Id by email. 
// exports.getCustomerId = functions.https.onRequest((request, response) => {

// })

// let stripeCustomersRef = db.collection(`stripe_customers`)
// stripeCustomersRef.where('customer_email', '==', email).get()
//     .then(snap => {
//         setCustomerId(snap.customer_id)
//     });
// let stripeCustomerEmailQuery = stripeCustomersRef
//     .where('customer_email', '==', email)
//     .where('status', '!=', "succeeded").get()

// create intent for customer if one does not exists

exports.createPaymentIntent = functions.https.onCall(async (data, context) => {

    const userID = context.auth.uid
    const customerID = await db.document(`stripe_customers/${userID}`).get("customer_id")
        .then(async () => {
            await db.collection(`stripe_paymentIntents`)
                .where("customer", "==", customerID)
                .where("status", "!=", "succeeded").get()
                .then(async doc => {
                    if (!doc.exists) {
                        try {
                            await stripe.paymentIntents.create(
                                {
                                    amount: 0,
                                    currency: 'usd',
                                    payment_method_types: ['card'],
                                    customer: customerID,
                                    receipt_email: request.auth.token.email,
                                },

                                function (err, paymentIntent) {
                                    if (err) {
                                        console.log("Error processing payment intent.")
                                    }
                                    // asynchronously called
                                }
                            )
                                .then(async intentInfo => {
                                    return await db.doc(`stripe_paymentIntents/${intentInfo.id}`).set({ ...intentInfo })
                                        .then(response => {
                                            return response;

                                        })
                                        .catch(error => {
                                            return console.log("Error saving intent info.")
                                        });

                                })
                                .catch(error => {
                                    return console.log("Error creating intent.")
                                })
                        }
                        catch {
                            return console.log("Error starting intent.")
                        }
                    }
                    else {
                        return console.log("Pending intent still exists.")
                    }
                    return null
                })
                .catch(error => {
                    console.log(error)
                });
            return null

        })
        .catch(error => {
            return console.log("Could not find customer ID.")
        })


    return
})

exports.confirmCardPayment = functions.https.onCall(async (data, context) => {
    const cardElement = data
    const userID = context.auth.uid
    const customerID = await db.document(`stripe_customers/${userID}`).get("customer_id")
        .then(async () => {
            const pendingIntent = await db.collection(`stripe_paymentIntents`)
                .where("customer", "==", customerID)
                .where("status", "!=", "succeeded").get()
                .then(intentInfo => {
                    stripe
                        .confirmCardPayment(intentInfo.client_secret, {
                            payment_method: {
                                card: cardElement,
                                billing_details: {
                                    name: 'Happy Consumer',
                                },
                            },
                        })
                        .then(async function (result) {
                            if (result.error) {
                                // Show error to your customer (e.g., insufficient funds)
                                return console.log(result.error.message)
                            } else {
                                // The payment has been processed!
                                if (result.paymentIntent.status === "succeeded") {
                                    await pendingIntent.set({
                                        ...result.paymentIntent
                                    })
                                        .then(async () => {
                                            let order_data = {
                                                items: "items",
                                                ...result.paymentIntent

                                            }
                                            await db.collection('orders').doc(userID).set({ order_data })
                                                .then(() => {
                                                    return response;

                                                }
                                                )
                                                .catch(error => {
                                                    return console.log(error)
                                                });
                                            // window.location = "https://jiva-website-405ed.firebaseapp.com/order-success"
                                            // Show a success message to your customer
                                            // There's a risk of the customer closing the window before callback
                                            // execution. Set up a webhook or plugin to listen for the
                                            // payment_intent.succeeded event that handles any business critical
                                            // post-payment actions.
                                            return null

                                        })
                                        .catch(error => {
                                            return console.log(error)
                                        })

                                }
                            }
                            // Handle result.error or result.paymentIntent
                            return null
                        })
                        .catch(error => {
                            return console.log(error)
                        });
                    return null
                });
            return null
        })
        .catch(error => {
            return console.log(error)
        })


    return response
})















// Add a payment source (card) for a user by writing a stripe payment source token to Cloud Firestore
exports.addPaymentSource = functions.firestore.document('/stripe_customers/{userId}/tokens/{pushId}').onCreate(async (snap, context) => {
    const source = snap.data();
    const token = source.token;
    if (source === null) {
        return null;
    }

    try {
        const snapshot = await admin.firestore().collection('stripe_customers').doc(context.params.userId).get();
        const customer = snapshot.data().customer_id;
        const response = await stripe.customers.createSource(customer, { source: token });
        return admin.firestore().collection('stripe_customers').doc(context.params.userId).collection("sources").doc(response.fingerprint).set(response, { merge: true });
    } catch (error) {
        await snap.ref.set({ 'error': userFacingMessage(error) }, { merge: true });
        return reportError(error, { user: context.params.userId });
    }
});

// When a user deletes their account, clean up after them
exports.cleanupUser = functions.auth.user().onDelete(async (user) => {
    const snapshot = await admin.firestore().collection('stripe_customers').doc(user.uid).get();
    const customer = snapshot.data();
    let id = customer.id
    await stripe.customers.del(customer.customer_id);
    return admin.firestore().collection('stripe_customers').doc(user.uid).delete()
        .then(admin.firestore().collection('stripe_paymentIntents').where('customer', '==', id)
            .where('status', '!=', "succeeded").delete())
});

// To keep on top of errors, we should raise a verbose error report with Stackdriver rather
// than simply relying on console.error. This will calculate users affected + send you email
// alerts, if you've opted into receiving them.
// [START reporterror]
function reportError(err, context = {}) {
    // This is the name of the StackDriver log stream that will receive the log
    // entry. This name can be any valid log stream name, but must contain "err"
    // in order for the error to be picked up by StackDriver Error Reporting.
    const logName = 'errors';
    const log = logging.log(logName);

    // https://cloud.google.com/logging/docs/api/ref_v2beta1/rest/v2beta1/MonitoredResource
    const metadata = {
        resource: {
            type: 'cloud_function',
            labels: { function_name: process.env.FUNCTION_NAME },
        },
    };

    // https://cloud.google.com/error-reporting/reference/rest/v1beta1/ErrorEvent
    const errorEvent = {
        message: err.stack,
        serviceContext: {
            service: process.env.FUNCTION_NAME,
            resourceType: 'cloud_function',
        },
        context: context,
    };

    // Write the error log entry
    return new Promise((resolve, reject) => {
        log.write(log.entry(metadata, errorEvent), (error) => {
            if (error) {
                return reject(error);
            }
            return resolve();
        });
    });
}
// [END reporterror]

// Sanitize the error message for the user
function userFacingMessage(error) {
    return error.type ? error.message : 'An error occurred, developers have been alerted';
}


// exports.createPaymentIntent = functions.post("/create-payment-intent", async (req, res) => {
//     const { items, currency } = req.body;
//     // Create a PaymentIntent with the order amount and currency
//     const paymentIntent = await stripe.paymentIntents.create({
//         amount: items,
//         currency: currency,
//         metadata: { integration_check: 'accept_a_payment' },
//     });

//     // Send publishable key and PaymentIntent details to client
//     res.send({
//         publishableKey: "pk_test_vSUOdXUItkZoDH7AA0LQppyq00W7RQlEuV",
//         clientSecret: paymentIntent.client_secret
//     });
// });

// // Expose a endpoint as a webhook handler for asynchronous events.
// // Configure your webhook in the stripe developer dashboard
// // https://dashboard.stripe.com/test/webhooks
// exports.sendWebhook = functions.post("/webhook", async (req, res) => {
//     let data, eventType;

//     // Check if webhook signing is configured.
//     if (process.env.STRIPE_WEBHOOK_SECRET) {
//         // Retrieve the event by verifying the signature using the raw body and secret.
//         let event;
//         let signature = req.headers["stripe-signature"];
//         try {
//             event = stripe.webhooks.constructEvent(
//                 req.rawBody,
//                 signature,
//                 "whsec_AExDQpAMl0XPFIikZcFkzQQLOll2vWEa"

//             );
//         } catch (err) {
//             console.log(`⚠️  Webhook signature verification failed.`);
//             return res.sendStatus(400);
//         }
//         data = event.data;
//         eventType = event.type;
//     } else {
//         // Webhook signing is recommended, but if the secret is not configured in `config.js`,
//         // we can retrieve the event data directly from the request body.
//         data = req.body.data;
//         eventType = req.body.type;
//     }

//     if (eventType === "payment_intent.succeeded") {
//         // Funds have been captured
//         // Fulfill any orders, e-mail receipts, etc
//         // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
//         console.log("💰 Payment captured!");
//     } else if (eventType === "payment_intent.payment_failed") {
//         console.log("❌ Payment failed.");
//     }
//     res.sendStatus(200);
//     console.log("The function worked at least.")
// });

// exports.stripeListen = functions.listen(4242, () => console.log(`Node server listening on port ${4242}!`));
