
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();


'use strict';
const functions = require("firebase-functions")
const firebase = require("firebase")
const admin = require("firebase-admin")


admin.initializeApp({
  databaseURL: 'https://jiva-website-405ed.firebaseio.com',
  credential: admin.credential.cert({
    projectId: "jiva-website-405ed",
    clientEmail: "jiva-website-405ed@appspot.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCeF0iLnQOXiL0P\nI2egiMweuqULCstyoWvrvKnJ5w7bXxdSykvMygy/Yr/fAxxjedV/RpcKQqHXSD4L\n7zB5tjVfbBSbG9+8dGNYRqz3OobLuDCpY2ce7Th3AvRjY0lrdolHWIBK472CnDcu\n/XfSYodw9A1IeRLkT1++hK/fMXPXfPCx/q3pz0yCwqzkrUg8o0d5+gxB/SlHf/tZ\n8RdhjO0VC0IUEYu9lQtV9jfPXwbw+5i4dshPdwcjAPVpnZSBhdbDVzcyuDiBTYmi\nyFr9ohc5h/xCdklXeJEVqeq3pFWh9HYYxv2Qr94rtud22dqiPNUPC2AHiQtbBdes\n3+BMZ4MjAgMBAAECggEABTu9FY4Vk9sdcxZXdFuC8lN4ajSpxnosgenFbx8cgUuV\nEJMMzlMz99PziRTnyC080ZFLJ7ZL+D32e9unrafH/Ygs6HOURP9PWJlCWY7Q7oaC\n6eCWBdKRh3MMFwwu3oVWhwuZd6ExYVT9iKswX8EOPcF+fRMw+mjcQQjQb6GJ9ayq\nUNARqxht6ccYvWaQfCMB8oWvcxVQYgQUWh5tF+vU6//rU7zDb8f4GbT80ppMIV3K\nSj9ptwQXId5t2SZHJvn8z/pjb0nlNISIVbN/8rRrw8i2gFYJkKwCPyAYlf7P91Wg\n+CTSkrmOQ8JYRgfyajB61ijCdI8yObhO64FWxoEidQKBgQDRIa3luGGMPIBkSYrx\nUtz9Owvdlw7pd25RUpTz8Mli8f7wleFpWhiGo6FON3eHm+/Xef3LWUHmo6lkhGyg\n36dZjLGdxf8AQWVyj9oeKXTWukxB3ELCi0jbqLokiAx+KZnTDL3Qze2KZDX5TW1v\nO31dnJ0Hwmd2rnMo1Cny9Na69QKBgQDBhUvUCFp1BnqgVsbJDdMGKBTyz2ugteCm\npHGHwhMH4qOdOuroNaeaJtiJlxBqbU3gCZW5tdycG1SICTml5krWbNgN7ah26us8\nCgqKNl4qlXqWlKEo536Z21gAd4aeSDL0BYLsvY1JpzfESWAYUEgMSXlOJLjwyFue\npMKjUNmmtwKBgQC3CDD4Uu0dHX6JR0xRdWJwRxNVdvXYI2zrw8kVzvGSpZWo3qSP\n3giFHgT5PdZhW3sILX6QUKg6wZZpoPSpv9TprRdurHFHufSd1YTizQmzPQ2svqe3\nOMwlY4C2pFO6v5IfgpFGhFSXwKj0bm2O4pQQMBfHSL/gwUGMxFOKjfq5WQKBgA5B\nn6BzLRbJ72a4fdR57D3b3g81MJyaSX59Rs/VgElobN08ZenNahd1HSaltlPg0Yfb\nrOgNeb8WVFfhNhn+qSy6v//mri50h/fYVYZxEubYNDu7n1PAGheDjSwbohMvBnHr\npgWCwVHXu8f+D9I6t9QP5ZvYILe8SuOZB624WxBpAoGBAMLj8nOI8sKnBk+6G4Il\nN5VEbBtsVujCR+0UlcD4wkcmFc6yWKGZfodQwpVmde1MOb0sLQYiL8WMzBNA0J0c\nPsj0mm9CbNO+fPVZomL7Y1tdjwh6IA/PjxfN0T6cLynSJXks1kEb2tYjbZ/17xgr\nJsST4Pr2TGOjUh1vaA21DFIz\n-----END PRIVATE KEY-----\n"
  })
})

const express = require("express");
const app = express();
const resolve = require("path");
const path = resolve
// Replace if using a different env file or config
const env = require("dotenv").config({ path: "./.env" });
const stripe = require("stripe")("sk_test_ueyEzSe0gWZLWBJwcqGTkdgg00AfnC9xtc");


var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



const rootRef = admin.database().ref()

app.use(express.static("../"));
app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith("/webhook")) {
        req.rawBody = buf.toString();
      }
    }
  })
);

app.get("/checkout", (req, res) => {
  // Display checkout page
  const path = resolve("../" + "/index.html");
  res.sendFile(path);
});

const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};



exports.createPaymentIntent = app.post("/create-payment-intent", async (req, res) => {
  const { items, currency } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: items,
    currency: currency,
    metadata: { integration_check: 'accept_a_payment' },
  });

  // Send publishable key and PaymentIntent details to client
  res.send({
    publishableKey: "pk_test_vSUOdXUItkZoDH7AA0LQppyq00W7RQlEuV",
    clientSecret: paymentIntent.client_secret
  });
});

// Expose a endpoint as a webhook handler for asynchronous events.
// Configure your webhook in the stripe developer dashboard
// https://dashboard.stripe.com/test/webhooks
exports.sendWebhook = app.post("/webhook", async (req, res) => {
  let data, eventType;

  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        "whsec_AExDQpAMl0XPFIikZcFkzQQLOll2vWEa"

      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // we can retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === "payment_intent.succeeded") {
    // Funds have been captured
    // Fulfill any orders, e-mail receipts, etc
    // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
    console.log("💰 Payment captured!");
  } else if (eventType === "payment_intent.payment_failed") {
    console.log("❌ Payment failed.");
  }
  res.sendStatus(200);

});

exports.stripeListen = app.listen(4242, () => console.log(`Node server listening on port ${4242}!`));

module.exports = app;
