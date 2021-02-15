import React, { useState, useEffect, useContext } from "react";
import {
  useStripe,
  useElements,
  CardElement,
  Elements,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import firebase from "firebase";
import "./CardSectionStyles.css";
import Cart from "./Cart";
import Stripe from "stripe";
import { Context } from "./Context";
import Flexbox from "flexbox-react";
import { Checkmark } from "react-checkmark";
import { PayPalButton } from "react-paypal-button";
import Checkout from "./Checkout";
import ExpressCheckout from "./ExpressCheckout";
var qs = require("querystring");
var http = require("https");

function CheckoutForm() {
  // const elements = Elements
  const {
    userInfo,
    updateDatabaseOrders,
    setItemList,
    setAnonList,
    modifyCartCount,
    modifyTotalPrice,
    totalCost,
    itemList,
    costTallyFinished,
    itemsPurchased,
    setItemsPurchased,
    costTaxShipping,
    receiptEmail,
    anonUser,
    tempShipAddress,
    setTempShipAddress,
    tempBillAddress,
    setTempBillAddress,
    setReceiptEmail,
    uid,
    setFinalItemList,
    storeCredit,
    handleStoreCreditPrompt,
    storeCreditUsed,
    priceAfterStoreCredit,
    setStoreCredit,
    setStoreCreditUsed,
    setPriceAfterStoreCredit,
    confirmExchangeOrder,
    exchangePurchase,
    exchangePurchaseComplete,
    lastExchangeOrderCreditUsed,
    setOnCheckout,
    userEmail,
    orderComplete,
    setOrderComplete,
    setOrderFinished,
    useExpressMode,
    setSameAsBilling,
    sameAsBilling,
    setUsePrevBilling,
    usePrevBilling,
    setBillingAddress,
    payMethod,
    setUseExpressMode,
    stripePromise,
    isLargeScreen,
    payPalHeightArr,
    setPayPalHeightArr,
    setDisplayPayPal,
    enterPaymentAllowed,
    setEnterPaymentAllowed,
    responsiveEmail,
    setResponsiveEmail,
    setStripeDisplayed,
    isPortrait,
    isSmallScreen,
    expressCheckoutOn,
  } = useContext(Context);

  const stripe = useStripe();
  const elements = useElements();

  const [spinnerDisplayed, setSpinnerDisplayed] = useState(false);

  const [orderString, setOrderString] = useState("");

  const [amountPaid, setAmountPaid] = useState(0);

  const [usePrevCard, setUsePrevCard] = useState(false);
  const [usePrevShip, setUsePrevShip] = useState(true);
  const [usePrevBill, setUsePrevBill] = useState(true);
  const [sameAsBillingBool, setSameAsBillingBool] = useState(true);

  const [rememberCard, setRememberCard] = useState(true);

  function handleRememberCard() {
    setRememberCard(!rememberCard);
  }

  const [prevCardSpacing, setPrevCardSpacing] = useState("9vw");

  function handlePrevCardSpacing() {
    if (prevCardSpacing == "9vw") {
      setPrevCardSpacing("-7vw");
    } else {
      setPrevCardSpacing("9vw");
    }
  }

  function handleUsePrevCard() {
    setUsePrevCard(!usePrevCard);
    handlePrevCardSpacing();
  }

  useEffect(() => {
    setPriceAfterStoreCredit(totalCost);
    setOrderFinished(false);

    if (
      userInfo.payMethod &&
      userInfo.payMethod.length > 0 &&
      expressCheckoutOn
    ) {
      setUseExpressMode(true);
      setHasPrevCard(true);
      setUsePrevCard(true);
    } else {
      setUseExpressMode(false);
      setHasPrevCard(false);
      setUsePrevCard(false);
    }
  }, [payMethod, userInfo, expressCheckoutOn]);

  useEffect(() => {
    let userIDSubstring = uid.substring(0, 4);

    let randNum = Math.floor(Math.random() * 100000);

    let semiUniqueString = `${userIDSubstring}${randNum}`;
    setOrderString(semiUniqueString);
  }, []);

  // Card Element stylings...
  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        width: `${isLargeScreen ? "100%" : "100vw"}`,
        height: "10em",
        padding: `20em`,
        margin: `${isLargeScreen ? "20em" : ""}`,
        boxSizing: "border-box",
        border: "2px solid pink",
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: `${isLargeScreen ? "16px" : "12px"}`,
        "::placeholder": {
          color: "#aab7c4",
        },
        maxWidth: "100vw",
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  function handleConfirmPayment() {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    disableButton();
    setProcessError(false);
    setIncrementStripe(incrementStripe + 1);
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    } else {
      setSpinnerDisplayed(true);
      firebase
        .functions()
        .httpsCallable("getClientSecret")()
        .then(async (result) => {
          console.log(result + " " + result.data);
          console.log(payMethod);
          const client_secret = result.data;
          // confirm card payment:
          const { paymentIntent, error } = await stripe.confirmCardPayment(
            client_secret,
            {
              payment_method: payMethod[3],
            }
          );
          if (paymentIntent) {
            return paymentIntent;
          } else {
            return error;
          }
        })
        .then(async (result) => {
          console.log(result);
          // if the result has a type, it was not confirmed:
          if (!result.type) {
            const itemNameArray = itemList.map((item) => {
              return item[0];
            });
            setAmountPaid(result.amount);
            let payAmount = result.amount;
            let checkoutNote = document.getElementById("checkoutNote").value;
            // rearrange database:
            return await firebase
              .functions()
              .httpsCallable("updateDatabase")({
                result,
                itemList,
                orderString,
                storeCreditUsed,
                checkoutNote,
              })
              .then(async () => {
                // cartItems, cost, lastFour, deliverDate
                let lastFour = payMethod[0];

                const orderObject = [
                  (payAmount / 100).toFixed(2).toString(),
                  lastFour.toString(),
                  deliverDate,
                ];

                setOrderComplete(true);
                setProcessError(false);

                let nameArrayJoined = itemNameArray.join(", ");
                setItemsPurchased(nameArrayJoined);
                let orderObj = {
                  orderObject,
                  itemList,
                  receiptEmail,
                  orderString,
                  checkoutNote,
                };
                return await firebase
                  .functions()
                  .httpsCallable("sendReceiptEmail")({ orderObj });
              })
              .then((result) => {
                itemList.forEach((i) => {
                  // let singleItem = fullItem[0]
                  // let itemPrice = singleItem[2]

                  let item = i[0];
                  let itemPrice = i[2];

                  console.log("item: " + item);
                  console.log("itemPrice: " + itemPrice);

                  updateDatabaseOrders(i);
                  modifyTotalPrice(Number(itemPrice) * -1);
                  modifyCartCount(-1);
                });

                let newList = [];
                setItemList([]);
                setAnonList([]);
                setFinalItemList([]);
                setSpinnerDisplayed(false);
                setOnCheckout(false);

                if (storeCreditUsed > 0) {
                  firebase
                    .functions()
                    .httpsCallable("updateCredit")({ storeCreditUsed })
                    .then((result) => {
                      setStoreCredit(storeCredit - storeCreditUsed / 100);
                      setStoreCreditUsed(0);
                      setPriceAfterStoreCredit(0);
                      return console.log("credit updated " + result);
                    })
                    .catch((error) => {
                      return console.log("error updating credit " + error);
                    });
                }

                return console.log(result);
              })
              .catch((error) => {
                return console.log("Error sending receipt email: " + error);
              });
          } else if (result.type) {
            setProcessError(true);
            setSpinnerDisplayed(false);
            enableButton();
          }
        })
        .catch((error) => {
          setProcessError(true);
          setSpinnerDisplayed(false);
          enableButton();
          return console.log("error getting client secret: " + error);
        });
      return;
    }
  }

  function disableButton() {
    if (document.getElementById("confirmPaymentButton")) {
      document.getElementById("confirmPaymentButton").style.display = "none";
    }
    if (document.getElementById("confirmPaymentButton2")) {
      document.getElementById("confirmPaymentButton2").style.display = "none";
    }
  }

  function enableButton() {
    if (document.getElementById("confirmPaymentButton")) {
      document.getElementById("confirmPaymentButton").style.display = "initial";
    }
    if (document.getElementById("confirmPaymentButton2")) {
      document.getElementById("confirmPaymentButton2").style.display =
        "initial";
    }
  }

  // state constants

  // const [amountPaid, setAmountPaid] = useState(0)
  // const [userEmail, setUserEmail] = useState("")
  const [deliverDate, setDeliverDate] = useState("");
  const [error, setError] = useState(null);
  const [processError, setProcessError] = useState(false);
  const [orderInfo, setOrderInfo] = useState("");
  const [userName, setUserName] = useState("");

  const cost = (amountPaid / 100).toFixed(2).toString();

  ////////////////
  const [payPalCost, setPayPalCost] = useState(0);
  const [payPalSuccess, setPayPalSuccess] = useState(false);
  const [payPalFailure, setPayPalFailure] = useState(false);
  /////////////

  const handleChange = (event) => {
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  const [checkoutLoaded, setCheckoutLoaded] = useState(false);
  const [incrementStripe, setIncrementStripe] = useState(0);

  useEffect(() => {
    // convert timestamp to milliseconds, add two weeks, make abbreviated string of Date.

    const newDate = new Date(Date.now() + 12096e5);
    const dateToString = newDate.toString().split(" ");
    const dateArr = [
      dateToString[0],
      dateToString[1],
      dateToString[2],
      dateToString[3],
    ];
    const newDateString = dateArr.join(" ");

    setDeliverDate(newDateString);
  }, []);

  const [paymentInt, setPaymentInt] = useState({});
  // Check for current user...
  useEffect(() => {
    // get email of current user
    firebase.auth().onAuthStateChanged(async function (user) {
      if (user) {
        // create intent on receive user info
        setUserName(user.displayName);
        // setUserEmail(user.email)
        console.log(totalCost);
        console.log(costTaxShipping);
        try {
          // get totalCost from context
          await firebase
            .functions()
            .httpsCallable("createPaymentIntent")({ totalCost })
            .then((result) => {
              setPaymentInt(result.data);
              return console.log("paymentIntent created " + result.data);
            })
            .catch((error) => {
              return console.log("no response from callable " + error);
            });
        } catch {
          return console.log("Unable to run callable.");
        }
      } else {
        return console.log("no user.");
      }
    });
  }, [totalCost]);

  //     <img
  //     name="visa"
  //     width="12%"
  //     style={{ "margin": ".5em" }}
  //     height="auto"
  //     src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/visa.png?alt=media&token=bbe2f764-b4ad-4dca-97ce-2497988fef46"
  // />
  // <img
  //     name="mc"
  //     width="12%"
  //     style={{ "margin": ".5em" }}
  //     height="auto"
  //     src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/mc.png?alt=media&token=3431d284-fc2e-4c99-ad50-aa837d7da85c"
  // />
  // <img
  //     name="amex"
  //     width="12%"
  //     style={{ "margin": ".5em" }}
  //     height="auto"
  //     src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/amex.png?alt=media&token=f957ce2c-720d-4cc0-b67e-4bd51082d878"
  // />
  // <img
  //     name="disc"
  //     width="12%"
  //     style={{ "margin": ".5em" }}
  //     height="auto"
  //     src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/disc.png?alt=media&token=782acf6e-58a9-4730-8d91-e87bbc6f6694"
  // />
  // <img
  //     name="paypal"
  //     width="12%"
  //     style={{ "margin": ".5em" }}
  //     height="auto"
  //     src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/paypal.png?alt=media&token=ffed4d97-5301-406a-a207-5fb65b1e6299"
  // />

  const [cardSvg, setCardSvg] = useState("");

  useEffect(() => {
    if (payMethod) {
      if (payMethod.includes("disc")) {
        setCardSvg(
          "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/disc.png?alt=media&token=782acf6e-58a9-4730-8d91-e87bbc6f6694"
        );
      } else if (payMethod.includes("visa")) {
        setCardSvg(
          "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/visa.png?alt=media&token=bbe2f764-b4ad-4dca-97ce-2497988fef46"
        );
      } else if (payMethod.includes("amex")) {
        setCardSvg(
          "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/amex.png?alt=media&token=f957ce2c-720d-4cc0-b67e-4bd51082d878"
        );
      } else if (payMethod.includes("mc")) {
        setCardSvg(
          "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/mc.png?alt=media&token=3431d284-fc2e-4c99-ad50-aa837d7da85c"
        );
      }
    }
  }, [payMethod]);

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();
    disableButton();
    setProcessError(false);
    setIncrementStripe(incrementStripe + 1);
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    } else {
      setSpinnerDisplayed(true);
      const cardElement = elements.getElement(CardElement);
      await stripe
        .createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: { name: userName },
        })
        .then(async (result) => {
          console.log(result);
          console.log(result.paymentMethod);
          // ./ last four, brand, id, country
          const lastFour = result.paymentMethod.card.last4;
          let payMethod = {
            last4: result.paymentMethod.card.last4,
            country: result.paymentMethod.card.country,
            brand: result.paymentMethod.card.brand,
            id: result.paymentMethod.id,
          };
          console.log(payMethod);
          await firebase
            .functions()
            .httpsCallable("getClientSecret")({ payMethod, rememberCard })
            .then(async (result) => {
              console.log(result + " " + result.data);
              const client_secret = result.data;
              // confirm card payment:
              const { paymentIntent, error } = await stripe.confirmCardPayment(
                client_secret,
                {
                  payment_method: {
                    card: cardElement,
                    billing_details: {
                      name: userName,
                    },
                  },
                }
              );
              if (paymentIntent) {
                return paymentIntent;
              } else {
                return error;
              }
            })
            .then(async (result) => {
              console.log(result);
              // if the result has a type, it was not confirmed:
              if (!result.type) {
                const itemNameArray = itemList.map((item) => {
                  return item[0];
                });
                console.log(itemNameArray);
                setAmountPaid(result.amount);
                console.log(amountPaid);
                let payAmount = result.amount;
                let checkoutNote = document.getElementById("checkoutNote")
                  .value;
                // rearrange database:
                return await firebase
                  .functions()
                  .httpsCallable("updateDatabase")({
                    result,
                    itemList,
                    orderString,
                    storeCreditUsed,
                    checkoutNote,
                  })
                  .then(async (result) => {
                    console.log(result);
                    // cartItems, cost, lastFour, deliverDate
                    const orderObject = [
                      (payAmount / 100).toFixed(2).toString(),
                      lastFour.toString(),
                      deliverDate,
                    ];
                    console.log(orderObject);

                    setOrderComplete(true);
                    setProcessError(false);

                    let nameArrayJoined = itemNameArray.join(", ");
                    setItemsPurchased(nameArrayJoined);
                    // send receipt email:
                    // if (userInfo.userEmail) {
                    let orderObj = {
                      orderObject,
                      itemList,
                      receiptEmail,
                      orderString,
                      checkoutNote,
                    };
                    console.log("normal email sent");
                    return await firebase
                      .functions()
                      .httpsCallable("sendReceiptEmail")({ orderObj });
                    // } else {
                    //     console.log("anon email sent")
                    //     let shipAddress = tempShipAddress
                    //     let orderObj = { orderObject, itemList, receiptEmail, shipAddress }
                    //     return await firebase.functions().httpsCallable('sendReceiptEmailAnon')({ orderObj })
                    // }
                  })
                  .then((result) => {
                    itemList.forEach((i) => {
                      // let singleItem = fullItem[0]
                      // let itemPrice = singleItem[2]

                      let item = i[0];
                      let itemPrice = i[2];

                      console.log("item: " + item);
                      console.log("itemPrice: " + itemPrice);

                      updateDatabaseOrders(i);
                      modifyTotalPrice(Number(itemPrice) * -1);
                      modifyCartCount(-1);
                    });
                    // let newArr = []
                    setItemList([]);
                    setAnonList([]);
                    setFinalItemList([]);
                    setSpinnerDisplayed(false);
                    setOnCheckout(false);
                    setOrderFinished(true);
                    if (storeCreditUsed > 0) {
                      firebase
                        .functions()
                        .httpsCallable("updateCredit")({ storeCreditUsed })
                        .then((result) => {
                          setStoreCredit(storeCredit - storeCreditUsed / 100);
                          setStoreCreditUsed(0);
                          setPriceAfterStoreCredit(0);
                          return console.log("credit updated " + result);
                        })
                        .catch((error) => {
                          return console.log("error updating credit " + error);
                        });
                    }

                    return console.log(result);
                  })
                  .catch((error) => {
                    return console.log("Error sending receipt email: " + error);
                  });
              } else if (result.type) {
                console.log(result.type);
                setProcessError(true);
                setSpinnerDisplayed(false);
                enableButton();
              }
            })
            .catch((error) => {
              setProcessError(true);
              setSpinnerDisplayed(false);
              enableButton();
              return console.log("error getting client secret: " + error);
            });
          return;
        })
        .catch((error) => {
          setProcessError(true);
          setSpinnerDisplayed(false);
          enableButton();
          return console.log("Error creating paymentMethod: " + error);
        });
      // get client secret from payment intent, for confirmation:
    }
  };
  /////////////////////////////////////////////

  const [shipAddress, setShipAddress] = useState([]);

  useEffect(() => {
    if (tempShipAddress) {
      setShipAddress(tempShipAddress);
    } else {
      setShipAddress(userInfo.prevAddressShipping);
    }
  }, [userInfo, tempShipAddress]);

  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Demo total",
          amount: totalCost,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });
      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
          console.log(result);
        } else {
          console.log("browser cannot make payment");
        }
      });
    }
  }, [stripe]);

  const options = {
    paymentRequest,
    style: {
      paymentRequestButton: {
        type: "default",
        // One of 'default', 'book', 'buy', or 'donate'
        // Defaults to 'default'

        theme: "dark",
        // One of 'dark', 'light', or 'light-outline'
        // Defaults to 'dark'

        height: "64px",
        // Defaults to '40px'. The width is always '100%'.
        backgroundColor: "black",
      },
    },
  };

  const [showPayError, setShowPayError] = useState(false);

  useEffect(() => {
    if (paymentRequest !== null) {
      paymentRequest.on("paymentmethod", async (ev) => {
        // Confirm the PaymentIntent without handling potential next actions (yet).
        firebase
          .functions()
          .httpsCallable("getClientSecret")()
          .then(async (result) => {
            console.log(result + " " + result.data);
            const clientSecret = result.data;
            // confirm card payment:

            const {
              error: confirmError,
              paymentIntent,
            } = await stripe.confirmCardPayment(
              clientSecret,
              { payment_method: ev.paymentMethod.id },
              { handleActions: false }
            );

            if (confirmError) {
              // Report to the browser that the payment failed, prompting it to
              // re-show the payment interface, or show an error message and close
              // the payment interface.
              ev.complete("fail");
              setShowPayError(true);
            } else {
              // Report to the browser that the confirmation was successful, prompting
              // it to close the browser payment method collection interface.
              ev.complete("success");
              // Let Stripe.js handle the rest of the payment flow.
              // const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret);
              console.log(paymentIntent);
              const itemNameArray = itemList.map((item) => {
                return item[0];
              });
              let result = paymentIntent;
              console.log(itemNameArray);
              setAmountPaid(result.amount);
              console.log(amountPaid);
              let payAmount = result.amount;
              let checkoutNote = document.getElementById("checkoutNote").value;
              // rearrange database:
              return await firebase
                .functions()
                .httpsCallable("updateDatabase")({
                  result,
                  itemList,
                  orderString,
                  shipAddress,
                  storeCreditUsed,
                  checkoutNote,
                })
                .then(async (result) => {
                  console.log(result);
                  // cartItems, cost, lastFour, deliverDate
                  const orderObject = [
                    (payAmount / 100).toFixed(2).toString(),
                    "4242",
                    //  lastFour.toString(),
                    deliverDate,
                  ];
                  console.log(orderObject);

                  setOrderComplete(true);
                  setProcessError(false);

                  let nameArrayJoined = itemNameArray.join(", ");
                  setItemsPurchased(nameArrayJoined);
                  // send receipt email:
                  // if (userInfo.userEmail) {
                  let orderObj = {
                    orderObject,
                    itemList,
                    receiptEmail,
                    orderString,
                    checkoutNote,
                  };
                  console.log("normal email sent");
                  return await firebase
                    .functions()
                    .httpsCallable("sendReceiptEmail")({ orderObj });
                  // } else {
                  //     console.log("anon email sent")
                  //     let shipAddress = tempShipAddress
                  //     let orderObj = { orderObject, itemList, receiptEmail, shipAddress }
                  //     return await firebase.functions().httpsCallable('sendReceiptEmailAnon')({ orderObj })
                  // }
                })
                .then((result) => {
                  itemList.forEach((i) => {
                    // let singleItem = fullItem[0]
                    // let itemPrice = singleItem[2]

                    let item = i[0];
                    let itemPrice = i[2];

                    console.log("item: " + item);
                    console.log("itemPrice: " + itemPrice);

                    updateDatabaseOrders(i);
                    modifyTotalPrice(Number(itemPrice) * -1);
                    modifyCartCount(-1);
                  });
                  // let newArr = []
                  setItemList([]);
                  setAnonList([]);
                  setFinalItemList([]);
                  setSpinnerDisplayed(false);
                  setOnCheckout(false);
                  setOrderFinished(true);

                  if (storeCreditUsed > 0) {
                    firebase
                      .functions()
                      .httpsCallable("updateCredit")({ storeCreditUsed })
                      .then((result) => {
                        setStoreCredit(storeCredit - storeCreditUsed / 100);
                        setStoreCreditUsed(0);
                        setPriceAfterStoreCredit(0);
                        return console.log("credit updated " + result);
                      })
                      .catch((error) => {
                        return console.log("error updating credit " + error);
                      });
                  }

                  return console.log(result);
                })
                .catch((error) => {
                  return console.log("Error sending receipt email: " + error);
                });
              // The payment has succeeded.
            }
          });
      });
    }
  }, [paymentRequest]);

  // reintegrating paypal by hand:

  const paypalOptions = {
    clientId:
      "AQa6_jLL-SRpzQ2ZZdAhqBdnMQy80zfB7pHTO_URcvNcWqV3wjkCOuO9DHFNqRMYU6_vhHGEtC8wqFFJ",
    intent: "capture",
  };

  const buttonStyles = {
    layout: "vertical",
    shape: "rect",
  };
  function handlePaypalTransaction(data, actions) {
    // This function sets up the details of the transaction, including the amount and line item details.
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: `${payPalCost}`,
          },
        },
      ],
    });
  }

  const [payPalCostString, setPayPalCostString] = useState("");

  useEffect(() => {
    setPayPalCost(totalCost / 100);
    let string = `${(totalCost / 100).toString()}.00`;
    setPayPalCostString(string);
  }, [totalCost]);

  const [payPalRendered, setPayPalRendered] = useState(false);

  useEffect(() => {
    if (!useExpressMode) {
      /////////
      /////////
      /////////
      // http request to get an access token:

      let options = {
        method: "POST",
        hostname: "api.paypal.com",
        port: null,
        path: "/v1/oauth2/token",
        headers: {
          accept: "application/json",
          "accept-language": "en_US",
          "content-type": "application/x-www-form-urlencoded",
          authorization: "basic QWYt**********MGc=",
        },
      };

      var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
          chunks.push(chunk);
        });

        res.on("end", function () {
          var body = Buffer.concat(chunks);
          console.log(body.toString());
        });
      });

      req.write(qs.stringify({ grant_type: "client_credentials" }));
      req.end();

      /////////
      /////////
      /////////
      // creating an order:

      if (!payPalRendered) {
        window.paypal
          .Buttons({
            env: "production" /* sandbox | production */,
            style: {
              layout: "horizontal", // horizontal | vertical
              size: "responsive" /* medium | large | responsive*/,
              shape: "pill" /* pill | rect*/,
              color: "gold" /* gold | blue | silver | black*/,
              fundingicons: false /* true | false */,
              tagline: false /* true | false */,
            },

            createOrder: function (data, actions) {
              // This function sets up the details of the transaction, including the amount and line item details.

              let options = {
                method: "POST",
                hostname: "api.paypal.com",
                port: null,
                path: "/v2/checkout/orders",
                headers: {
                  accept: "application/json",
                  "content-type": "application/json",
                  "accept-language": "en_US",
                  authorization:
                    "Bearer A21AAFJ9eoorbnbVH3fTJrCTl2o7-P_1T6q8vdYB_QwBB9Ais5ZZmJD4BsNjIiOh8j8OyOcfzLO1BKcgKe0pK-mntpk6jOm-",
                },
              };

              var req = http.request(options, function (res) {
                var chunks = [];

                res.on("data", function (chunk) {
                  chunks.push(chunk);
                });

                res.on("end", function () {
                  var body = Buffer.concat(chunks);
                  console.log(body.toString());
                });
              });

              req.write(
                JSON.stringify({
                  intent: "CAPTURE",
                  purchase_units: [
                    {
                      reference_id: "PUHF",
                      amount: { currency_code: "USD", value: payPalCostString },
                    },
                  ],
                  application_context: { return_url: "", cancel_url: "" },
                })
              );
              req.end();

              let actionCreate = actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: `${payPalCost}`,
                    },
                  },
                ],
              });

              // var CREATE_URL = '/example/createOrder';

              // /* Make a call to your server to set up the payment */

              // let fetchUrl = fetch(CREATE_URL)
              //     .then(function (res) {
              //         return res.json();
              //     }).then(function (data) {
              //         return data.orderID;
              //     });

              // return ({
              //     actionCreate,
              //     fetchUrl
              // })

              return actionCreate;
            },

            onApprove: function (data, actions) {
              let options = {
                method: "POST",
                hostname: "api.paypal.com",
                port: null,
                path: "/v2/checkout/orders/5O190127TN364715T/capture",
                headers: {
                  "content-type": "application/json",
                  authorization:
                    "Bearer A21AAFJ9eoorbnbVH3fTJrCTl2o7-P_1T6q8vdYB_QwBB9Ais5ZZmJD4BsNjIiOh8j8OyOcfzLO1BKcgKe0pK-mntpk6jOm-",
                },
              };

              var req = http.request(options, function (res) {
                var chunks = [];

                res.on("data", function (chunk) {
                  chunks.push(chunk);
                });

                res.on("end", function () {
                  var body = Buffer.concat(chunks);
                  console.log(body.toString());
                });
              });

              req.end();

              // This function captures the funds from the transaction.
              return actions.order.capture().then(function (details) {
                // This function shows a transaction success message to your buyer.
                alert(
                  "Transaction completed by " + details.payer.name.given_name
                );

                console.log(details.payer.name.given_name);

                // let ppData = data

                firebase
                  .functions()
                  .httpsCallable("payPalPayment")({ details })
                  .then((result) => {
                    console.log(result);
                    itemList.forEach((i) => {
                      // let singleItem = fullItem[0]
                      // let itemPrice = singleItem[2]

                      let item = i[0];
                      let itemPrice = i[2];

                      console.log("item: " + item);
                      console.log("itemPrice: " + itemPrice);

                      updateDatabaseOrders(i);
                      modifyTotalPrice(Number(itemPrice) * -1);
                      modifyCartCount(-1);
                    });

                    // let newList = []
                    setItemList([]);
                    setAnonList([]);
                    setFinalItemList([]);
                    setSpinnerDisplayed(false);
                    return console.log(result);
                  })
                  .catch((error) => {
                    return console.log("Error sending receipt email: " + error);
                  });
                let payAmount = `${payPalCost.toString()}.00`;
                let checkoutNote = document.getElementById("checkoutNote")
                  .value;

                console.log(details);
                setPayPalSuccess(true);
                const orderObject = [
                  payAmount,
                  "paypal",
                  //  lastFour.toString(),
                  deliverDate,
                ];

                let orderObj = {
                  orderObject,
                  itemList,
                  receiptEmail,
                  orderString,
                  checkoutNote,
                };
                console.log("normal email sent");
                return firebase.functions().httpsCallable("sendReceiptEmail")({
                  orderObj,
                });

                // console.log(data)
              });
            },
          })
          .render("#paypal-button-container");
        setPayPalRendered(true);
      }
    }
  }, [payPalCost, useExpressMode]);

  // function handleShowPaypal() {

  // window.paypal.Buttons().render("#paypal-button-container2");
  // window.paypal.Buttons().render("#paypal-button-container");
  // }

  // useEffect(() => {
  //     window.paypal.Buttons({
  //         createOrder: function (data, actions) {
  //             // This function sets up the details of the transaction, including the amount and line item details.
  //             return actions.order.create({
  //                 purchase_units: [{
  //                     amount: {
  //                         value: `${payPalCost}`
  //                     }
  //                 }]
  //             });
  //         },
  //         onApprove: function (data, actions) {
  //             // This function captures the funds from the transaction.
  //             return actions.order.capture().then(function (details) {
  //                 // This function shows a transaction success message to your buyer.
  //                 alert('Transaction completed by ' + details.payer.name.given_name);

  //                 let ppData = data
  //                 setPayPalSuccess(true)
  //                 firebase.functions().httpsCallable('payPalPayment')({ details, ppData })
  //                     .then(result => {
  //                         console.log(result)
  //                         itemList.forEach(i => {

  //                             // let singleItem = fullItem[0]
  //                             // let itemPrice = singleItem[2]

  //                             let item = i[0]
  //                             let itemPrice = i[2]

  //                             console.log("item: " + item)
  //                             console.log("itemPrice: " + itemPrice)

  //                             updateDatabaseOrders(i)
  //                             modifyTotalPrice(
  //                                 (Number(itemPrice) * -1)
  //                             )
  //                             modifyCartCount(-1);
  //                         })

  //                         // let newList = []
  //                         setItemList([])
  //                         setAnonList([])
  //                         setFinalItemList([])
  //                         setSpinnerDisplayed(false)
  //                         return console.log(result)

  //                     })
  //                     .catch(error => {
  //                         return console.log("Error sending receipt email: " + error)
  //                     })
  //                 console.log(details)
  //                 console.log(data)

  //             });
  //         }
  //     }).render('#paypal-button-container2');

  // }, [payPalCost])

  const [exchangeSpinnerDisplayed, setExchangeSpinnerDisplayed] = useState(
    false
  );
  const [hasPrevCard, setHasPrevCard] = useState(false);

  useEffect(() => {
    if (usePrevCard) {
      setDisplayPayPal(false);
    }
  }, [usePrevCard]);

  //   useEffect(() => {
  //     if (useExpressMode) {
  //       setHasPrevCard(true);
  //     }
  //   }, []);

  if (!exchangePurchase && (!useExpressMode || !usePrevCard)) {
    if (!orderComplete && !payPalSuccess) {
      return (
        <div
          //   className="roundedLight"
          style={{
            margin: "0 auto",
            position: "static",
            display: "inline-block",
            top: "50vh",
            bottom: "50vh",
            left: "50vw",
            right: "50vw",
            width: `${isLargeScreen ? "50%" : "99%"} `,
            // right: "2.5em",
          }}
        >
          <div className="centered4" style={{ right: "3vw" }}>
            {hasPrevCard && (
              <div class="switch centered">
                <h4
                  style={{
                    position: "relative",
                    marginRight: `${usePrevCard ? "4em" : ""}`,
                  }}
                >
                  Use card on file?
                </h4>
                <Flexbox flexDirection={isLargeScreen ? "row" : "column"}>
                  <div style={{ width: "33em", textAlign: "left" }}>
                    <Flexbox flexDirection="row">
                      {usePrevCard && (
                        <div
                          className="shadow"
                          style={{
                            width: `${isLargeScreen ? "30vw" : ""}`,
                          }}
                        >
                          <img
                            alt=""
                            name="prevCardSvg"
                            width="24%"
                            style={{ margin: ".5em" }}
                            height="auto"
                            src={cardSvg}
                          />

                          {payMethod.map((item) => {
                            if (payMethod.indexOf(item) == 0) {
                              return (
                                <p style={{ margin: "0.5em" }}>
                                  ****{item.toString()}
                                </p>
                              );
                            }
                            if (payMethod.indexOf(item) == 1) {
                              return (
                                <p style={{ margin: "0.5em" }}>
                                  {item.toString()}
                                </p>
                              );
                            }
                            if (payMethod.indexOf(item) == 2) {
                              return (
                                <p style={{ margin: "0.5em" }}>
                                  {item.toString()}
                                </p>
                              );
                            }
                          })}
                        </div>
                      )}
                    </Flexbox>
                  </div>
                  <span
                    style={{
                      bottom: `${isLargeScreen && "3em"}`,
                      right: `${prevCardSpacing.toString()}`,
                      position: `${isLargeScreen ? "relative" : ""}`,
                    }}
                  >
                    <input
                      name="usePrevCard"
                      class="switch-input"
                      type="checkbox"
                      id="usePrevCard"
                      checked={usePrevCard}
                      onClick={() => {
                        handleUsePrevCard();
                        setUseExpressMode(!useExpressMode);
                      }}
                    ></input>
                    <label class="switch-paddle" for="usePrevCard">
                      <span style={{ color: "white" }} class="show-for-sr">
                        Use card on file?
                      </span>
                    </label>
                  </span>
                </Flexbox>
              </div>
            )}
            <span
              style={{ width: "100%", display: "flex", flexDirection: "row" }}
            >
              <h4
                style={{
                  whiteSpace: "nowrap",
                  left: `${isPortrait || isSmallScreen ? "10vw" : "2vw"}`,
                  position: "relative",
                }}
              >
                Order Total: ${(Number(priceAfterStoreCredit) / 100).toFixed(2)}
              </h4>
              <button
                style={{
                  fontSize: "small",
                  //   left: `${isPortrait || isSmallScreen ? "34vw" : "26vw"}`,
                  position: "relative",
                  width: "30px",
                  left: `${isPortrait || isSmallScreen ? "45w" : "8vw"}`,
                  marginLeft: `${isPortrait || isSmallScreen ? "16vw" : ""}`,
                  float: "right",
                  //   backgroundColor: "black",
                  borderRadius: "25px",
                  padding: "7px",
                  marginBottom: "5px",
                }}
                onClick={() => {
                  setStripeDisplayed(false);
                }}
                type="button"
                className="close-button rounded"
              >
                X
              </button>
            </span>
            {storeCreditUsed > 0 && (
              <h4>
                Store credit used: {(Number(storeCreditUsed) / 100).toFixed(2)}
              </h4>
            )}
            <Flexbox style={{ position: "relative" }} flexDirection="row">
              {storeCredit > 0 && (
                <button
                  style={{
                    marginRight: "2em",
                    marginTop: "2em",
                    maxHeight: "4em",
                    whiteSpace: "nowrap",
                  }}
                  className="button primary"
                  type="button"
                  onClick={() => {
                    handleStoreCreditPrompt();
                  }}
                >
                  Use Store Credit
                </button>
              )}
              <Flexbox
                flexDirection="row"
                style={{
                  position: "relative",
                  top: "1em",
                  "margin-bottom": "1em",
                  left: `${isLargeScreen ? "initial" : "5vw"}`,
                }}
              >
                <p
                  style={{
                    marginRight: "2em",
                    fontSize: "small",
                  }}
                >
                  Remember this card?
                </p>
                <span
                  data-tooltip
                  class="top"
                  tabindex="2"
                  title="Make checkout easier next time with Express Checkout"
                >
                  <input
                    name="rememberCard"
                    class="switch-input"
                    type="checkbox"
                    id="rememberCard"
                    checked={rememberCard}
                    onClick={() => {
                      handleRememberCard();
                    }}
                  ></input>
                  <label class="switch-paddle" for="rememberCard">
                    <span style={{ color: "white" }} class="show-for-sr">
                      Remember Card?
                    </span>
                  </label>
                </span>
              </Flexbox>
            </Flexbox>
            <form
              onSubmit={handleSubmit}
              className="wideForm centered"
              style={{
                marginTop: "1em",
                marginBottom: "1em",
                width: `${isLargeScreen ? "200%" : "100%"}`,
                left: `${isLargeScreen ? "-4em" : "5%"}`,
              }}
            >
              <label
                style={{
                  width: "100%",
                }}
              >
                Card details
                <CardElement
                  options={CARD_ELEMENT_OPTIONS}
                  // className={`${isLargeScreen ? "wideForm" : "cardResponsive"} `}
                  onChange={() => {
                    setCheckoutLoaded(true);
                  }}
                />
              </label>
              <br></br>
              <button
                style={{
                  width: `${isLargeScreen ? "100%" : "150%"} `,
                  // "top": `${ isLargeScreen ? "" : "50em" } `,
                  marginTop: `${isLargeScreen ? "" : "2.2em"} `,
                  maxWidth: `${isLargeScreen ? "none" : "17em"}`,
                  visibility: `${
                    !isLargeScreen && spinnerDisplayed ? "hidden" : "initial"
                  }`,
                }}
                className="button primary"
                disabled={!stripe}
                id="confirmPaymentButton"
              >
                Confirm Order
              </button>
              {(!usePrevCard || !useExpressMode) && (
                <div
                  // className="wideForm shadowed"
                  id="paypal-button-container"
                  style={{
                    zIndex: `${isLargeScreen ? "initial" : "98"}`,
                    visibility: `${spinnerDisplayed ? "hidden" : "initial"}`,

                    // "position": "absolute",
                    // "display": `${displayPayPal ? "initial" : "none"}`,
                    // "top": `${payPalHeightArr[0] ? "payPalHeightArr" : ""}`
                  }}
                ></div>
              )}

              {spinnerDisplayed && (
                <div
                  className="centered shadowed graded"
                  style={{
                    position: "fixed",
                    bottom: "40vh",
                    zIndex: "99",
                    width: `${isLargeScreen ? "initial" : "50%"}`,
                    height: "auto",
                    right: `${isLargeScreen ? "initial" : "50vw"}`,
                  }}
                >
                  <div className="loader centered"></div>
                  <p>Please do not close or refresh the page.</p>
                </div>
              )}
            </form>

            {showPayError && (
              <div
                className="centered shadowed graded"
                style={{
                  position: "fixed",
                  bottom: "40vh",
                  zIndex: "99",
                  width: `${isLargeScreen ? "initial" : "50%"}`,
                  height: "auto",
                  right: `${isLargeScreen ? "initial" : "70vw"}`,
                }}
              >
                <button
                  style={{
                    fontSize: "small",
                    left: "75%",
                    // "right": `${isLargeScreen ? "-2vw" : "50vw"}`
                  }}
                  onClick={() => {
                    setShowPayError(false);
                  }}
                  type="button"
                  className="close-button"
                >
                  X
                </button>
                <p>
                  There was an error processing your payment. You have not been
                  charged.
                </p>
              </div>
            )}
          </div>
          {processError && (
            <div>
              <h4 style={{ color: "red" }}>
                There was an error processing your payment. You have not been
                charged.
              </h4>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          class="productCard centered lefted"
          style={{
            width: "99%",
            right: `${isLargeScreen ? "3em" : "5vw"}`,
            textAlign: `${isLargeScreen ? "initial" : "left"}`,
            fontSize: `${isLargeScreen ? "initial" : "small"}`,
          }}
        >
          <div class="text-align center">
            <Flexbox flexDirection={isLargeScreen ? "row" : "column"}>
              {/* <Checkmark size="large" color="#1779ba"
                                style={{
                                    "right": `${isLargeScreen ? "initial" : "15vw"}`,
                                    "position": `${isLargeScreen ? "initial" : "relative"}`,
                                    "visibility": `${isLargeScreen ? "initial" : "hidden"}`,
                                    "display": `${isLargeScreen ? "initial" : "none"}`,
                                }}
                            /> */}
              <div onLoad={() => setEnterPaymentAllowed(false)}>
                <h2>Your Order is Complete!</h2>
                <p>Items purchased: {itemsPurchased}</p>
                <p>Amount Paid: ${(amountPaid / 100).toFixed(2)}</p>
                <p>
                  Receipt email:{" "}
                  {receiptEmail
                    ? receiptEmail.toString()
                    : userEmail.toString() || responsiveEmail}
                </p>
                <p>Estimated Arrival Date: {deliverDate.toString()}</p>
                <p>Your Order Confirmation ID is {orderString}</p>
                <br></br>
                <Link to="/shop">
                  <button
                    className="button primary"
                    type="button"
                    style={{
                      maxWidth: `${isLargeScreen ? "initial" : "50vw"}`,
                      height: `${isLargeScreen ? "initial" : "60px"}`,
                      position: `${isLargeScreen ? "initial" : "relative"}`,
                      fontSize: `${isLargeScreen ? "initial" : "small"}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Keep Shopping
                  </button>
                </Link>
                <img
                  width="100vw"
                  height="auto"
                  src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/logo%20rose%20finished.svg?alt=media&token=d4f6fc6b-cec1-4832-adcb-440dae63563b"
                ></img>
              </div>
            </Flexbox>
          </div>
        </div>
      );
    }
  } else if (exchangePurchase && (!useExpressMode || !usePrevCard)) {
    if (!exchangePurchaseComplete) {
      return (
        <div
          className={isLargeScreen ? "centered4" : "centered5"}
          style={{
            width: `${isLargeScreen ? "50%" : "99%"} `,
            right: "2.5em",
          }}
        >
          <textarea
            id="exchangeNote"
            rows="4"
            cols="50"
            maxlength="150"
            placeholder="Special instructions for your order? 150 character limit"
          ></textarea>
          <h4
            style={{
              width: "100%",
              whiteSpace: "nowrap",
              // "marginBottom": `${ isLargeScreen ? "" : "15em" } `
            }}
          >
            Order Total: ${(Number(priceAfterStoreCredit) / 100).toFixed(2)}
          </h4>
          {storeCreditUsed > 0 && (
            <h3>{(Number(storeCreditUsed) / 100).toFixed(2)}</h3>
          )}
          <button
            style={{ width: `${isLargeScreen ? "100%" : "160%"} ` }}
            className="button primary lg"
            type="button"
            onClick={() => {
              confirmExchangeOrder(orderString, itemList, deliverDate);
            }}
          >
            Confirm Order
          </button>
          {/* <div id="paypal-button-container"
                        onLoad={() => {
                            handleShowPaypal()
                        }}></div> */}
          {exchangeSpinnerDisplayed && (
            <div
              className="centered shadowed graded"
              style={{
                position: "fixed",
                bottom: "40vh",
                zIndex: "99",
                width: `${isLargeScreen ? "initial" : "50%"}`,
                height: "auto",
                right: `${isLargeScreen ? "initial" : "50vw"}`,
              }}
            >
              <div className="loader" style={{ zIndex: "99" }}></div>
              <p style={{ zIndex: "99" }}>
                Please do not close or refresh the page.
              </p>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <Flexbox
          style={{
            right: `${isLargeScreen ? "initial" : "5vw"}`,
            textAlign: `${isLargeScreen ? "initial" : "left"}`,
            fontSize: `${isLargeScreen ? "initial" : "small"}`,
          }}
          flexDirection={isLargeScreen ? "row" : "column"}
        >
          {/* <span>
                        <Checkmark size="xxlarge" color="#1779ba"
                            style={{
                                "right": `${isLargeScreen ? "initial" : "15vw"}`,
                                "position": `${isLargeScreen ? "initial" : "relative"}`,
                                "display": `${isLargeScreen ? "initial" : "none"}`,
                            }} />
                    </span> */}
          <div
            onLoad={() => setEnterPaymentAllowed(false)}
            className="centered lefted"
            style={{ width: "99%" }}
          >
            <h2>Your Exchange Order is Complete!</h2>
            <p>Items Exchanged: {itemsPurchased}</p>
            <p>
              Store Credit Used: $
              {(lastExchangeOrderCreditUsed / 100).toFixed(2)}
            </p>
            <p>
              Receipt email:{" "}
              {receiptEmail ? receiptEmail : userEmail || responsiveEmail}
            </p>
            <p>Estimated Arrival Date: {deliverDate.toString()}</p>
            <p>Your Order Confirmation ID is {orderString}</p>
            <br></br>
            <Link to="/shop">
              <button
                type="button"
                style={{
                  maxWidth: `${isLargeScreen ? "initial" : "50vw"}`,
                  height: `${isLargeScreen ? "initial" : "60px"}`,
                  position: `${isLargeScreen ? "initial" : "relative"}`,
                  fontSize: `${isLargeScreen ? "initial" : "small"}`,
                  whiteSpace: "nowrap",
                }}
              >
                Keep Shopping
              </button>
            </Link>
            <img
              alt="Jiva Logo - Fleur de Lis \& Rose"
              width="100vw"
              height="auto"
              src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/logo%20rose%20finished.svg?alt=media&token=d4f6fc6b-cec1-4832-adcb-440dae63563b"
            ></img>
          </div>
        </Flexbox>
      );
    }
  } else if (!exchangePurchase && useExpressMode) {
    return (
      <div>
        {hasPrevCard && (
          <div class="switch centered">
            <h4
              style={{
                position: "relative",
                marginRight: `${usePrevCard ? "4em" : ""}`,
              }}
            >
              Use card on file?
            </h4>
            <Flexbox flexDirection={isLargeScreen ? "row" : "column"}>
              <div style={{ width: "33em", textAlign: "left" }}>
                <Flexbox flexDirection="row">
                  {usePrevCard && (
                    <div
                      className="shadow"
                      style={{
                        width: `${isLargeScreen ? "30vw" : ""}`,
                      }}
                    >
                      <img
                        alt=""
                        name="prevCardSvg"
                        width="24%"
                        style={{ margin: ".5em" }}
                        height="auto"
                        src={cardSvg}
                      />

                      {payMethod.map((item) => {
                        if (payMethod.indexOf(item) == 0) {
                          return (
                            <p style={{ margin: "0.5em" }}>
                              ****{item.toString()}
                            </p>
                          );
                        }
                        if (payMethod.indexOf(item) == 1) {
                          return (
                            <p style={{ margin: "0.5em" }}>{item.toString()}</p>
                          );
                        }
                        if (payMethod.indexOf(item) == 2) {
                          return (
                            <p style={{ margin: "0.5em" }}>{item.toString()}</p>
                          );
                        }
                      })}
                    </div>
                  )}
                </Flexbox>
              </div>
              <span
                style={{
                  bottom: `${isLargeScreen && "3em"}`,
                  right: `${prevCardSpacing.toString()}`,
                  position: `${isLargeScreen ? "relative" : ""}`,
                }}
              >
                <input
                  name="usePrevCard"
                  class="switch-input"
                  type="checkbox"
                  id="usePrevCard"
                  checked={usePrevCard}
                  onClick={() => {
                    handleUsePrevCard();
                    setUseExpressMode(!useExpressMode);
                  }}
                ></input>
                <label class="switch-paddle" for="usePrevCard">
                  <span style={{ color: "white" }} class="show-for-sr">
                    Use card on file?
                  </span>
                </label>
              </span>
            </Flexbox>
          </div>
        )}
        <br></br>
        {storeCredit > 0 && (
          <button
            className={
              isLargeScreen ? "button primary" : "button primary small"
            }
            type="button"
            style={{
              maxHeight: "4em",
              whiteSpace: "nowrap",
              left: `${isLargeScreen ? "initial" : "-10vw"}`,
            }}
            onClick={() => {
              handleStoreCreditPrompt();
            }}
          >
            Use Store Credit
          </button>
        )}
        <Elements stripe={stripePromise}>
          <form>
            <button
              style={{ left: `${isLargeScreen ? "initial" : "-10vw"}` }}
              className="button primary"
              type="button"
              id="confirmPaymentButton2"
              onClick={() => {
                handleConfirmPayment();
              }}
            >
              Confirm Pay Now
            </button>
            {/* {!usePrevCard && <div id="paypal-button-container"
                            onLoad={() => {
                                handleShowPaypal()
                            }}></div>} */}
          </form>
        </Elements>
        {/* <div id="paypal-button-container"></div> */}
        {showPayError && (
          <div
            className="centered graded"
            style={{
              position: "fixed",
              zIndex: "99",
              bottom: "40vh",
            }}
          >
            <p>
              An error occurred, while processing your payment. You have not
              been charged.
            </p>
          </div>
        )}
        <br></br>
        {spinnerDisplayed && !orderComplete && (
          <div
            className="centered shadowed graded"
            style={{
              position: "fixed",
              zIndex: "99",
              bottom: "40vh",
              width: `${isLargeScreen ? "initial" : "50%"}`,
              height: "auto",
              right: `${isLargeScreen ? "initial" : "50vw"}`,
            }}
          >
            <div className="loader" style={{ zIndex: "99" }}></div>
            <p style={{ zIndex: "99" }}>
              Please do not close or refresh the page.
            </p>
          </div>
        )}
        {processError && (
          <div
            className="centered shadowed graded"
            style={{
              position: "fixed",
              zIndex: "99",
              bottom: "40vh",
            }}
          >
            <p style={{ zIndex: "99" }}>
              An error occurred while processing your payment. You have not been
              charged.
            </p>
          </div>
        )}
        {orderComplete && (
          <div
            class="productCard"
            style={{
              right: `${isLargeScreen ? "3em" : "5vw"}`,
              textAlign: `${isLargeScreen ? "initial" : "left"}`,
              fontSize: `${isLargeScreen ? "initial" : "small"}`,
            }}
          >
            <div class="text-align center lefted">
              <div
                onLoad={() => {
                  setEnterPaymentAllowed(false);
                }}
              >
                <p>Your Order is Complete!</p>
                <p>Items purchased: {itemsPurchased}</p>
                <p>Amount Paid: ${(amountPaid / 100).toFixed(2)}</p>
                <p>
                  Receipt email:{" "}
                  {receiptEmail
                    ? receiptEmail.toString()
                    : userInfo.userEmail || responsiveEmail}
                </p>
                <p>Estimated Arrival Date: {deliverDate.toString()}</p>
                <p>Your Order Confirmation ID is {orderString}</p>
              </div>
              <Link to="/shop">
                <button
                  type="button"
                  className="button primary"
                  style={{
                    maxWidth: `${isLargeScreen ? "initial" : "50vw"}`,
                    height: `${isLargeScreen ? "initial" : "60px"}`,
                    position: `${isLargeScreen ? "initial" : "relative"}`,
                    fontSize: `${isLargeScreen ? "initial" : "small"}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  Keep Shopping
                </button>
              </Link>
              <img
                width="100vw"
                height="auto"
                src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/logo%20rose%20finished.svg?alt=media&token=d4f6fc6b-cec1-4832-adcb-440dae63563b"
              ></img>
            </div>
          </div>
        )}
        <br></br>
        {/* {(paymentRequest) &&
                    <div className="payButtonClass">
                        <PaymentRequestButtonElement options={options} />
                    </div>} */}
        {payPalSuccess && (
          <div onLoad={() => setEnterPaymentAllowed(false)}>
            <h1>Your Exchange Order is Complete!</h1>
            <h2>Items Exchanged: {itemsPurchased}</h2>
            <h2>
              Store Credit Used: $
              {(lastExchangeOrderCreditUsed / 100).toFixed(2)}
            </h2>
            <h2>
              Receipt email:{" "}
              {receiptEmail ? receiptEmail.toString() : userEmail.toString()}
            </h2>
            <h2>Estimated Arrival Date: {deliverDate.toString()}</h2>
            <h2>Your Order Confirmation ID is {orderString}</h2>
            <img
              width="100vw"
              height="auto"
              src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/logo%20rose%20finished.svg?alt=media&token=d4f6fc6b-cec1-4832-adcb-440dae63563b"
            ></img>
          </div>
        )}
        {payPalFailure && (
          <div>
            <h2>Your paypal order was a failure ya dingus.</h2>
          </div>
        )}
      </div>
    );
  } else {
    if (!exchangePurchaseComplete) {
      return (
        <div
          className={`${isLargeScreen ? "centered4" : "centered5"} shadowed`}
          style={{
            right: "5em",
            width: `${isLargeScreen ? "50%" : "100%"} shadowed`,
          }}
        >
          <textarea
            id="exchangeNote"
            rows="4"
            cols="50"
            maxlength="150"
            placeholder="Special instructions for your order? 150 character limit"
          ></textarea>
          <h2
            style={{
              width: "100%",
              whiteSpace: "nowrap",
              // "marginBottom": `${ isLargeScreen ? "" : "15em" } `
            }}
          >
            Order Total: ${(Number(priceAfterStoreCredit) / 100).toFixed(2)}
          </h2>
          {storeCreditUsed > 0 && (
            <h3>{(Number(storeCreditUsed) / 100).toFixed(2)}</h3>
          )}
          <button
            style={{ width: `${isLargeScreen ? "100%" : "150%"} ` }}
            type="button"
            className="centered"
            onClick={() => {
              confirmExchangeOrder(orderString, itemList, deliverDate);
              setExchangeSpinnerDisplayed(true);
            }}
          >
            Confirm Order
          </button>
          {exchangeSpinnerDisplayed && (
            <div
              className="centered shadowed graded"
              style={{
                position: "fixed",
                bottom: "40vh",
                zIndex: "99",
                width: `${isLargeScreen ? "initial" : "50%"}`,
                height: "auto",
                right: `${isLargeScreen ? "initial" : "50vw"}`,
              }}
            >
              <div className="loader" style={{ zIndex: "99" }}></div>
              <p style={{ zIndex: "99" }}>
                Please do not close or refresh the page.
              </p>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          onLoad={() => setEnterPaymentAllowed(false)}
          className="centered lefted"
        >
          <h1>Your Exchange Order is Complete!</h1>
          <h2>Items Exchanged: {itemsPurchased}</h2>
          <h2>
            Store Credit Used: ${(lastExchangeOrderCreditUsed / 100).toFixed(2)}
          </h2>
          <h2>
            Receipt email:{" "}
            {receiptEmail ? receiptEmail.toString() : userEmail.toString()}
          </h2>
          <h2>Estimated Arrival Date: {deliverDate.toString()}</h2>
          <h2>Your Order Confirmation ID is {orderString}</h2>
          <img
            width="100vw"
            height="auto"
            src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/logo%20rose%20finished.svg?alt=media&token=d4f6fc6b-cec1-4832-adcb-440dae63563b"
          ></img>
        </div>
      );
    }
  }
}

export default CheckoutForm;
