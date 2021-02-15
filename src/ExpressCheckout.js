import React, { useState, useContext, useEffect } from "react"
import firebase from "firebase"
import { Elements, useStripe, useElements, PaymentRequestButtonElement } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Context } from "./Context"
import { PayPalButton } from "react-paypal-button-v2";

import CheckoutForm from "./CheckoutForm"
import Checkout from "./Checkout"





function ExpressCheckout() {


    const stripePromise = loadStripe("pk_test_vSUOdXUItkZoDH7AA0LQppyq00W7RQlEuV")

    const stripe = useStripe()
    const elements = useElements()

    function Card() {
        return (
            <div>

            </div>
        )
    }

    const {
        userInfo,
        prevAddressShipping,
        prevAddressBilling,
        payMethod,
        setPayMethod,
        costTaxShipping,
        itemsPurchased,
        setItemsPurchased,
        receiptEmail,
        updateDatabaseOrders,
        setItemList,
        setAnonList,
        modifyCartCount,
        modifyTotalPrice,
        itemList,
        tempShipAddress,
        setTempShipAddress,
        uid,
        totalCost,
        setFinalItemList,
        finalItemList,
        applePayDevice,
        priceAfterStoreCredit,
        setStoreCredit,
        setStoreCreditUsed,
        setPriceAfterStoreCredit,
        storeCreditUsed,
        handleStoreCreditPrompt,
        storeCredit,
        exchangePurchase,
        confirmExchangeOrder,
        exchangePurchaseComplete,
        lastExchangeOrderCreditUsed,
        setOnCheckout,
        setSameAsBilling,
        sameAsBilling,
        setUsePrevBilling,
        usePrevBilling,
        setBillingAddress,
        billingAddress
    } = useContext(Context)


    useEffect(() => {
        setOnCheckout(true)
    }, [])


    const [orderString, setOrderString] = useState("")
    // userinfo 1 is the uid
    let userIDSubstring = uid.substring(0, 4)
    let randNum = (Math.floor(Math.random() * 100000))
    let semiUniqueString = `${userIDSubstring}${randNum}`
    // make sure to pass this to the email as well.
    useEffect(() => {
        console.log(userIDSubstring)
        console.log(semiUniqueString)

        setOrderString(semiUniqueString)
    }, [])


    const [userEmail, setUserEmail] = useState("")
    const cost = (amountPaid / 100).toFixed(2)




    const [orderComplete, setOrderComplete] = useState(false)
    const [amountPaid, setAmountPaid] = useState(0)
    const [orderID, setOrderID] = useState("")

    const [usePrevCard, setUsePrevCard] = useState(true)
    const [usePrevShip, setUsePrevShip] = useState(true)
    const [usePrevBill, setUsePrevBill] = useState(true)
    const [sameAsBillingBool, setSameAsBillingBool] = useState(true)



    const [spinnerDisplayed, setSpinnerDisplayed] = useState(false)
    const [checkoutLoaded, setCheckoutLoaded] = useState(false)
    const [incrementStripe, setIncrementStripe] = useState(0)
    const [deliverDate, setDeliverDate] = useState('')
    const [processError, setProcessError] = useState(false)

    const [payPalCost, setPayPalCost] = useState(0)
    const [payPalSuccess, setPayPalSuccess] = useState(false)
    const [payPalFailure, setPayPalFailure] = useState(false)


    const [exchangeObject, setExchangeObject] = useState([])



    useEffect(() => {

        // convert timestamp to milliseconds, add two weeks, make abbreviated string of Date.

        const newDate = new Date(Date.now() + 12096e5)
        const dateToString = newDate.toString().split(" ")
        const dateArr = [dateToString[0], dateToString[1], dateToString[2], dateToString[3]]
        const newDateString = dateArr.join(' ')

        setDeliverDate(newDateString)

    }, [])

    // useEffect(() => {
    //     let orderObject = [
    //         (payAmount / 100).toFixed(2).toString(),
    //         "4242",
    //         //  lastFour.toString(), 
    //         deliverDate
    //     ]

    //     setExchangeObject(orderObject)
    //     // needs to be modified to carry information correctly to exchange function

    // }, [])



    useEffect(() => {
        let ppCost = ((Number(totalCost) / 100).toFixed(2))
        setPayPalCost(ppCost)
    }, [])

    useEffect(() => {
        console.log(payMethod)
        firebase.functions().httpsCallable('createPaymentIntent')({ totalCost })
            .then(result => {
                return console.log("paymentIntent created " + result.data)
            })
            .catch(error => {
                return console.log("no response from callable " + error)
            })
    }, [])

    const [shipAddress, setShipAddress] = useState([])
    useEffect(() => {
        if (userInfo.prevAddressShipping) {
            setShipAddress(userInfo.prevAddressShipping)
        }


    }, [userInfo])

    useEffect(() => {
        setPriceAfterStoreCredit(totalCost)
    }, [])





    function disableButton() {
        // document.getElementById("confirmPaymentButton").setAttribute("disabled", "true")
        // document.getElementById("confirmPaymentButton").disabled = "true"
        document.getElementById("confirmButton").style.display = "none"
    }

    function enableButton() {
        // document.getElementById("confirmPaymentButton").setAttribute("disabled", "false")
        // document.getElementById("confirmPaymentButton").disabled = "false"
        document.getElementById("confirmButton").style.display = "initial"
    }


    function handleConfirmPayment() {

        // We don't want to let default form submission happen here,
        // which would refresh the page.
        disableButton()
        setProcessError(false)
        setIncrementStripe(incrementStripe + 1)
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        } else {
            setSpinnerDisplayed(true)
            firebase.functions().httpsCallable('getClientSecret')()
                .then(async (result) => {
                    console.log(result + " " + result.data)
                    console.log(payMethod)
                    const client_secret = result.data
                    // confirm card payment:
                    const { paymentIntent, error } = await stripe.confirmCardPayment(
                        client_secret,
                        {
                            payment_method: payMethod[3]
                        },
                    )
                    if (paymentIntent) {
                        return paymentIntent
                    } else {
                        return error
                    }
                })
                .then(async (result) => {
                    console.log(result)
                    // if the result has a type, it was not confirmed:
                    if (!result.type) {
                        const itemNameArray = itemList.map(item => {
                            return item[0]
                        })
                        setAmountPaid(result.amount)
                        let payAmount = result.amount
                        let checkoutNote = document.getElementById('checkoutNote').value
                        // rearrange database:
                        return await firebase.functions().httpsCallable('updateDatabase')
                            ({ result, itemList, orderString, storeCreditUsed, checkoutNote })
                            .then(async () => {
                                // cartItems, cost, lastFour, deliverDate
                                let lastFour = payMethod[0]

                                const orderObject = [
                                    (payAmount / 100).toFixed(2).toString(),
                                    lastFour.toString(),
                                    deliverDate
                                ]


                                setOrderComplete(true)
                                setProcessError(false)

                                let nameArrayJoined = itemNameArray.join(", ")
                                setItemsPurchased(nameArrayJoined)
                                // send receipt email:
                                // if (userInfo.userEmail) {
                                let orderObj = { orderObject, itemList, receiptEmail, orderString, checkoutNote }
                                return await firebase.functions().httpsCallable('sendReceiptEmail')({ orderObj })
                                // } else {
                                //     let shipAddress = tempShipAddress
                                //     let orderObj = { orderObject, itemList, receiptEmail, shipAddress }
                                //     return await firebase.functions().httpsCallable('sendReceiptEmailAnon')({ orderObj })
                                // }
                            })
                            .then(result => {
                                itemList.forEach(i => {


                                    // let singleItem = fullItem[0]
                                    // let itemPrice = singleItem[2]

                                    let item = i[0]
                                    let itemPrice = i[2]

                                    console.log("item: " + item)
                                    console.log("itemPrice: " + itemPrice)

                                    updateDatabaseOrders(i)
                                    modifyTotalPrice(
                                        (Number(itemPrice) * -1)
                                    )
                                    modifyCartCount(-1);
                                })

                                let newList = []
                                setItemList([])
                                setAnonList([])
                                setFinalItemList(newList)
                                setSpinnerDisplayed(false)
                                setOnCheckout(false)

                                if (storeCreditUsed > 0) {
                                    firebase.functions().httpsCallable('updateCredit')
                                        ({ storeCreditUsed })
                                        .then(result => {
                                            setStoreCredit(storeCredit - (storeCreditUsed / 100))
                                            setStoreCreditUsed(0)
                                            setPriceAfterStoreCredit(0)
                                            return console.log("credit updated " + result)
                                        })
                                        .catch(error => {
                                            return console.log("error updating credit " + error)
                                        })
                                }

                                return console.log(result)


                            })
                            .catch(error => {
                                return console.log("Error sending receipt email: " + error)
                            })
                    } else if (result.type) {
                        setProcessError(true)
                        setSpinnerDisplayed(false)
                        enableButton()
                    }
                })
                .catch(error => {
                    setProcessError(true)
                    setSpinnerDisplayed(false)
                    enableButton()
                    return console.log("error getting client secret: " + error)
                })
            return

        }
    }


    const [paymentRequest, setPaymentRequest] = useState(null);


    useEffect(() => {
        if (stripe) {
            const pr = stripe.paymentRequest({
                country: 'US',
                currency: 'usd',
                total: {
                    label: 'Demo total',
                    amount: totalCost,
                },
                requestPayerName: true,
                requestPayerEmail: true,
            });
            pr.canMakePayment().then(result => {
                if (result) {
                    setPaymentRequest(pr);
                    console.log(result)
                } else {
                    console.log("browser cannot make payment")
                }
            });
        }
    }, [stripe]);

    const options = {
        paymentRequest,
        style: {
            paymentRequestButton: {
                type: 'default',
                // One of 'default', 'book', 'buy', or 'donate'
                // Defaults to 'default'

                theme: 'dark',
                // One of 'dark', 'light', or 'light-outline'
                // Defaults to 'dark'

                height: '64px',
                // Defaults to '40px'. The width is always '100%'.
            },
        }
    }

    const [showPayError, setShowPayError] = useState(false)

    useEffect(() => {
        if (paymentRequest !== null) {
            paymentRequest.on('paymentmethod', async (ev) => {
                // Confirm the PaymentIntent without handling potential next actions (yet).
                firebase.functions().httpsCallable('getClientSecret')()
                    .then(async (result) => {
                        console.log(result + " " + result.data)
                        const clientSecret = result.data
                        // confirm card payment:

                        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
                            clientSecret,
                            { payment_method: ev.paymentMethod.id },
                            { handleActions: false }
                        );

                        if (confirmError) {
                            // Report to the browser that the payment failed, prompting it to
                            // re-show the payment interface, or show an error message and close
                            // the payment interface.
                            ev.complete('fail');
                            setShowPayError(true)
                        } else {
                            // Report to the browser that the confirmation was successful, prompting
                            // it to close the browser payment method collection interface.
                            ev.complete('success');
                            // Let Stripe.js handle the rest of the payment flow.

                            console.log(paymentIntent)
                            const itemNameArray = itemList.map(item => {
                                return item[0]
                            })
                            let result = paymentIntent
                            console.log(itemNameArray)
                            setAmountPaid(result.amount)
                            console.log(amountPaid)
                            let payAmount = result.amount
                            let checkoutNote = document.getElementById('checkoutNote').value
                            // rearrange database:
                            return await firebase.functions().httpsCallable('updateDatabase')
                                ({ result, itemList, orderString, shipAddress, storeCreditUsed, checkoutNote })
                                .then(async result => {
                                    console.log(result)
                                    // cartItems, cost, lastFour, deliverDate
                                    const orderObject = [
                                        (payAmount / 100).toFixed(2).toString(),
                                        "4242",
                                        //  lastFour.toString(), 
                                        deliverDate
                                    ]
                                    console.log(orderObject)

                                    setOrderComplete(true)
                                    setProcessError(false)

                                    let nameArrayJoined = itemNameArray.join(", ")
                                    setItemsPurchased(nameArrayJoined)
                                    // send receipt email:
                                    // if (userInfo.userEmail) {
                                    let orderObj = { orderObject, itemList, receiptEmail, orderString, checkoutNote }
                                    console.log("normal email sent")
                                    return await firebase.functions().httpsCallable('sendReceiptEmail')({ orderObj })
                                    // } else {
                                    //     console.log("anon email sent")
                                    //     let shipAddress = tempShipAddress
                                    //     let orderObj = { orderObject, itemList, receiptEmail, shipAddress }
                                    //     return await firebase.functions().httpsCallable('sendReceiptEmailAnon')({ orderObj })
                                    // }
                                })
                                .then(result => {
                                    itemList.forEach(i => {


                                        // let singleItem = fullItem[0]
                                        // let itemPrice = singleItem[2]

                                        let item = i[0]
                                        let itemPrice = i[2]

                                        console.log("item: " + item)
                                        console.log("itemPrice: " + itemPrice)

                                        updateDatabaseOrders(i)
                                        modifyTotalPrice(
                                            (Number(itemPrice) * -1)
                                        )
                                        modifyCartCount(-1);
                                    })
                                    let newArr = []
                                    setItemList([])
                                    setAnonList([])
                                    setFinalItemList(newArr)
                                    setSpinnerDisplayed(false)
                                    setOnCheckout(false)

                                    if (storeCreditUsed > 0) {
                                        firebase.functions().httpsCallable('updateCredit')
                                            ({ storeCreditUsed })
                                            .then(result => {
                                                setStoreCredit(storeCredit - (storeCreditUsed / 100))
                                                setStoreCreditUsed(0)
                                                setPriceAfterStoreCredit(0)
                                                return console.log("credit updated " + result)
                                            })
                                            .catch(error => {
                                                return console.log("error updating credit " + error)
                                            })
                                    }


                                    return console.log(result)

                                })
                                .catch(error => {
                                    return console.log("Error sending receipt email: " + error)
                                })
                            // The payment has succeeded.

                        }

                    })
            });
        }
    }, [paymentRequest])


    const [exchangeSpinnerDisplayed, setExchangeSpinnerDisplayed] = useState(false)

    if (!exchangePurchase) {



        return (
            <div className="row centered shadowed">
                <div className="column">
                    <textarea
                        id="checkoutNote"
                        rows="4"
                        cols="50"
                        maxlength="150"
                        placeholder="Special instructions for your order? 150 character limit"></textarea>
                    <h2>Order Total: ${(Number(priceAfterStoreCredit) / 100).toFixed(2)}</h2>
                    {(storeCreditUsed > 0) && <h3>{(Number(storeCreditUsed) / 100).toFixed(2)}</h3>}
                    <h2>Use shipping address on file?</h2>
                    {usePrevShip &&
                        <div>
                            {prevAddressShipping.map(item => {
                                return <p>{item.toString()}</p>
                            })}
                            <div class="switch centered">
                                <p>Same as Billing Address</p>
                                <input
                                    name="keepMeSignedIn"
                                    class="switch-input"
                                    type="checkbox"
                                    id="sameAsBilling"
                                    checked={sameAsBilling}
                                    onClick={() => {
                                        setSameAsBilling(!sameAsBilling);
                                        setUsePrevBilling(!usePrevBilling);
                                        setBillingAddress(!billingAddress)
                                    }}
                                ></input>
                                <label class="switch-paddle" for="sameAsBilling">
                                    <span
                                        style={{ "color": "white" }}
                                        class="show-for-sr">Same as billing address</span>
                                </label>
                            </div>
                        </div>}
                    <form>
                        <label for="">Yes</label>
                        <input type="radio" onClick={() => { setUsePrevShip(true) }} selected></input>
                        <label for="">No</label>
                        <input type="radio" onClick={() => { setUsePrevShip(false) }}></input>
                    </form>
                    <form>
                        <label for="sameAsBilling">Same as billing address</label>
                        <input type="checkbox" id="sameAsBilling" selected={sameAsBillingBool}></input>
                    </form>
                    <h2>Use billing address on file?</h2>
                    {(usePrevBill && !usePrevBilling) &&
                        <div>
                            {prevAddressBilling.map(item => {
                                return <h3>{item.toString()}</h3>
                            })}
                        </div>}
                    <form>
                        <label for="">Yes</label>
                        <input type="radio" onClick={() => { setUsePrevBill(true) }} selected></input>
                        <label for="">No</label>
                        <input type="radio" onClick={() => { setUsePrevBill(false) }}></input>
                    </form>
                    <h2>Use card on file?</h2>
                    {usePrevCard &&
                        <div>
                            {payMethod.map(item => {
                                if (!item.includes("pm")) {
                                    return <h3>{item.toString()}</h3>
                                }
                            })}
                        </div>}
                    <form>
                        <label for="">Yes</label>
                        <input type="radio" onClick={() => { setUsePrevCard(true) }} selected></input>
                        <label for="">No</label>
                        <input type="radio" onClick={() => { setUsePrevCard(false) }}></input>
                    </form>
                    <br></br>
                    {(storeCredit > 0) &&
                        <button type="button" onClick={() => { handleStoreCreditPrompt() }}>Use Store Credit</button>}
                    <Elements stripe={stripePromise}>
                        <form >
                            <button
                                type="button"
                                id="confirmButton"
                                onClick={() => { handleConfirmPayment() }}
                            >Confirm Payment Now</button>
                        </form>
                    </Elements>

                    {(showPayError) &&
                        <div>
                            <h2>Your payment didn't work my dude.</h2>
                        </div>}
                    <br></br>
                    {(spinnerDisplayed && !orderComplete) &&
                        <div>
                            <div className="loader"></div>
                            <h3>Please do not close or refresh the page.</h3>
                        </div>}
                    {processError &&
                        <div>
                            <h3>Error Processing Payment</h3>
                        </div>}
                    {orderComplete && <div class="productCard">
                        <div class="text-align center">
                            <div>
                                <h1>Your Order is Complete!</h1>
                                <h2>Items purchased: {itemsPurchased}</h2>
                                <h2>Amount Paid: ${(amountPaid / 100).toFixed(2)}</h2>
                                <h2>Receipt email: {receiptEmail
                                    ? receiptEmail.toString()
                                    : userInfo.userEmail}</h2>
                                <h2>Estimated Arrival Date: {deliverDate.toString()}</h2>
                                <h2>Your Order Confirmation ID is {orderString}</h2>
                            </div>
                        </div>
                    </div>}
                    <br></br>
                    {(!usePrevCard) &&
                        <div>
                            <Checkout />
                            <PayPalButton
                                clientId="AQa6_jLL-SRpzQ2ZZdAhqBdnMQy80zfB7pHTO_URcvNcWqV3wjkCOuO9DHFNqRMYU6_vhHGEtC8wqFFJ"
                                className="payButtonClass"
                                currency="USD"
                                amount={`${payPalCost}`}
                                onSuccess={(details, data) => {
                                    let ppData = data
                                    setPayPalSuccess(true)
                                    firebase.functions().httpsCallable('payPalPayment')({ details, ppData })
                                        .then(result => {
                                            console.log(result)
                                            itemList.forEach(i => {


                                                // let singleItem = fullItem[0]
                                                // let itemPrice = singleItem[2]

                                                let item = i[0]
                                                let itemPrice = i[2]

                                                console.log("item: " + item)
                                                console.log("itemPrice: " + itemPrice)

                                                updateDatabaseOrders(i)
                                                modifyTotalPrice(
                                                    (Number(itemPrice) * -1)
                                                )
                                                modifyCartCount(-1);
                                            })

                                            let newList = []
                                            setItemList([])
                                            setAnonList([])
                                            setFinalItemList(newList)
                                            setSpinnerDisplayed(false)
                                            return console.log(result)

                                        })
                                        .catch(error => {
                                            return console.log("Error sending receipt email: " + error)
                                        })
                                    console.log(details)
                                    console.log(data)
                                }}
                                catchError={(error) => {
                                    console.log(error)
                                    setPayPalFailure(true)
                                }}
                            />
                        </div>
                    }
                    {(paymentRequest) &&
                        <div className="payButtonClass">
                            <PaymentRequestButtonElement options={options} />
                        </div>}
                    {payPalSuccess &&
                        <div>
                            <h1>Your Exchange Order is Complete!</h1>
                            <h2>Items Exchanged: {itemsPurchased}</h2>
                            <h2>Store Credit Used: ${(lastExchangeOrderCreditUsed / 100).toFixed(2)}</h2>
                            <h2>Receipt email: {receiptEmail
                                ? receiptEmail.toString()
                                : userEmail.toString()}</h2>
                            <h2>Estimated Arrival Date: {deliverDate.toString()}</h2>
                            <h2>Your Order Confirmation ID is {orderString}</h2>
                        </div>}
                    {payPalFailure &&
                        <div>
                            <h2>Your paypal order was a failure ya dingus.</h2>
                        </div>}
                    <br></br>
                    <br></br>
                </div>
            </div>
        )

    } else {
        if (!exchangePurchaseComplete) {

            return (
                <div className="centered">
                    <textarea
                        id="exchangeNote"
                        rows="4"
                        cols="50"
                        maxlength="150"
                        placeholder="Special instructions for your order? 150 character limit"></textarea>
                    <h2>Order Total: ${(Number(priceAfterStoreCredit) / 100).toFixed(2)}</h2>
                    {(storeCreditUsed > 0) && <h3>{(Number(storeCreditUsed) / 100).toFixed(2)}</h3>}
                    <button type="button"
                        onClick={() => {
                            confirmExchangeOrder(
                                orderString, itemList, deliverDate
                            );
                            setExchangeSpinnerDisplayed(true)
                        }}>Confirm Order</button>
                    {exchangeSpinnerDisplayed &&
                        <div>
                            <div className="loader"></div>
                            <h3>Please do not close or refresh the page.</h3>
                        </div>}
                </div>
            )

        } else {
            return (

                <div className="centered">
                    <h1>Your Exchange Order is Complete!</h1>
                    <h2>Items Exchanged: {itemsPurchased}</h2>
                    <h2>Store Credit Used: ${(lastExchangeOrderCreditUsed / 100).toFixed(2)}</h2>
                    <h2>Receipt email: {receiptEmail
                        ? receiptEmail.toString()
                        : userEmail.toString()}</h2>
                    <h2>Estimated Arrival Date: {deliverDate.toString()}</h2>
                    <h2>Your Order Confirmation ID is {orderString}</h2>
                </div>
            )
        }
    }
}


export default ExpressCheckout