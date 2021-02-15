import React, { useContext, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import firebase from "firebase"
import { Context } from "./Context"
import AllProducts from "./AllProducts"

function MyOrders() {

    const [showEarlier, setShowEarlier] = useState(false)

    function toggleShowEarlier() {
        setShowEarlier(!showEarlier)
    }

    const {
        prevOrders,
        ordersLoaded,
        allProducts,
        setOnCheckout,
        setTermsDisplay,
        isLargeScreen,
        setSearchString,
        setOnProductPage
    } = useContext(Context)

    useEffect(() => {
        setSearchString("")
        setOnCheckout(false)
        setTermsDisplay(false)
        setOnProductPage(false)
        document.getElementById("firebaseui-auth-container").style.display = "none"
        // document.getElementById('smallSearch').style.display = "none"
        // document.getElementById('largeSearch').style.display = "none"
    }, [])


    const reducedOrders = useState([])

    useEffect(() => {

        prevOrders.map(order => {

            let newOrder = []

            order[1].map(item => {
                let filtered = order[1].filter(i =>
                    (
                        (i.itemName == item.itemName) &&
                        (i.itemColor == item.itemColor) &&
                        (i.itemSize == item.itemSize)
                    ))
                let filtLength = filtered.length
                let newItem = [item, filtLength]
                console.log("iterated over item: " + item)

                let newOrderFiltered = newOrder.filter(i =>
                    (
                        (i.itemName == item.itemName) &&
                        (i.itemColor == item.itemColor) &&
                        (i.itemSize == item.itemSize)
                    ))

                if (newOrderFiltered.length == 0) {
                    return newOrder.push(newItem)
                }
            })
        })


    }, [prevOrders])

    const lastFiveOrders = [prevOrders[0], prevOrders[1], prevOrders[2], prevOrders[3], prevOrders[4]]

    console.log(prevOrders)
    console.log(lastFiveOrders)


    if (((prevOrders.length > 0) && (prevOrders.length < 6)) && ordersLoaded) {
        return (

            <div>
                <nav className="darkNav" aria-label="You are here:" role="navigation">
                    <ul class="breadcrumbs">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/account">Account</Link></li>
                        <li><Link to="/my-orders">Orders</Link></li>
                        <li>
                            <span class="show-for-sr">Current: Your Orders</span>
                        </li>
                    </ul>
                </nav>
                <div
                    className="shadowed"
                    style={{ "margin": "1em" }}>
                    <h1>Your Orders({prevOrders.length})</h1>
                    <div>
                        {lastFiveOrders.map(order => {

                            if (order) {

                                let newOrder = []

                                order[1].map(item => {
                                    let filtered = order[1].filter(i =>
                                        (
                                            (i.itemName == item.itemName) &&
                                            (i.itemColor == item.itemColor) &&
                                            (i.itemSize == item.itemSize)
                                        ))
                                    let filtLength = filtered.length
                                    let newItem = [item, filtLength]
                                    console.log("iterated over item: " + item)

                                    let newOrderFiltered = newOrder.filter(i =>
                                        (
                                            (i[0].itemName == item.itemName) &&
                                            (i[0].itemColor == item.itemColor) &&
                                            (i[0].itemSize == item.itemSize)
                                        ))

                                    if (newOrderFiltered.length == 0) {
                                        return newOrder.push(newItem)
                                    }
                                })

                                // let finalOrder = newOrder.filter((item, index) => {
                                //     return newOrder.indexOf(item) === index
                                // })

                                let finalOrder = [...new Set(newOrder)]
                                console.log("finalOrder: " + finalOrder)
                                let orderQuant = order[1].length

                                let emptyArr = []


                                let amountPaid = ((Number(order[2]) / 100).toFixed(2))
                                let dateObj = new Date(Number(order[0]) * 1000)
                                let dateFull = dateObj.toString()
                                let dateShort = dateFull.split(" ")
                                let briefDate = [
                                    dateShort[0],
                                    dateShort[1],
                                    dateShort[2],
                                    dateShort[3],
                                    dateShort[4]].join(" ")
                                let orderType = order[3]
                                let orderCreditUsed = ((Number(order[4]) / 100).toFixed(2))
                                let orderStatus = order[5]
                                let orderTracking = order[6]
                                return (
                                    <div className="graded">
                                        <div
                                            className="row shadowed"
                                            style={{ "margin": `${isLargeScreen ? "4em" : "0em"}` }}>
                                            <div className="centered">
                                                {(orderType !== "exchange") && <p>Order Total: ${amountPaid}</p>}
                                                {(orderType == "exchange") &&

                                                    <p>Exchange</p>

                                                }
                                                {(orderCreditUsed > 0) &&

                                                    <p>Store Credit Used: ${orderCreditUsed}</p>
                                                }

                                                <p>{orderQuant} {(orderQuant == 1 ? "item" : "items")}</p>


                                                <p>Order Date: {briefDate}</p>

                                                {orderStatus &&
                                                    <p>{orderStatus}</p>
                                                }
                                                {(orderTracking && (orderStatus == "Shipped")) &&

                                                    <a
                                                        href={`https://tools.usps.com/go/TrackConfirmAction?tRef=fullpage&tLc=2&text28777=&tLabels=${orderTracking}%2C`}>
                                                        Track My Order</a>
                                                }
                                            </div>

                                            {
                                                finalOrder.map(item => {
                                                    console.log(newOrder)
                                                    let product = item[0]
                                                    let productCount = item[1].toString()

                                                    let boolArr = []
                                                    let arrFilt = emptyArr.filter(i => i == item)
                                                    let leCount = arrFilt.length
                                                    if (leCount == 0) {
                                                        emptyArr.push(item)
                                                        boolArr.push(true)
                                                    } else {
                                                        boolArr.push(false)
                                                    }

                                                    if ((product.itemName)
                                                        // && (boolArr[0] == true)
                                                    ) {



                                                        let linkString = product.itemName.split(" ").join("-")
                                                        let itemColorArr = product.itemColor.split("_")

                                                        let itemColor = itemColorArr[0]

                                                        let itemSize = product.itemSize
                                                        let newArr = []
                                                        if (itemSize === "One-Size") {
                                                            newArr.push("One Size")
                                                        } else {
                                                            newArr.push(itemSize)
                                                        }

                                                        let productSource = allProducts.find(item => item[0] === product.itemName)

                                                        return (
                                                            <div
                                                                className="columnSmall shadowed"
                                                                style={{ "width": `${isLargeScreen ? "25%" : "100%"}` }}>
                                                                <Link to={`/product/${linkString}`}>
                                                                    <img src={`${productSource[5]}`} width="30%" height="auto"></img>
                                                                    <p className="marginless">{product.itemName}{(item[1] > 1) && ` (${productCount})`}</p>
                                                                    <p className="marginless">{newArr[0]}</p>
                                                                    <p className="marginless">{itemColor}</p>
                                                                </Link>
                                                            </div>
                                                        )
                                                    }
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>
                <nav className="darkNav" aria-label="You are here:" role="navigation">
                    <ul class="breadcrumbs">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/account">Account</Link></li>
                        <li><Link to="/my-orders">Orders</Link></li>
                        <li>
                            <span class="show-for-sr">Current: Your Orders</span>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
    else if ((prevOrders.length >= 6) && ordersLoaded) {
        return (
            <div>
                <nav style={{ "marginTop": "1em" }}
                    className="darkNav" aria-label="You are here:" role="navigation">
                    <ul class="breadcrumbs">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/account">Account</Link></li>
                        <li><Link to="/my-orders">Orders</Link></li>
                        <li>
                            <span class="show-for-sr">Current: Your Orders</span>
                        </li>
                    </ul>
                </nav>
                <div className="shadowed"
                    style={{ "margin": "1em" }}>
                    <h1>Your Orders ({prevOrders.length})</h1>
                    <div>
                        {lastFiveOrders.map(order => {


                            let newOrder = []



                            let orderQuant = order[1].length
                            console.log(newOrder)
                            order[1].map(item => {
                                let filtered = order[1].filter(i =>
                                    (
                                        (i.itemName == item.itemName) &&
                                        (i.itemColor == item.itemColor) &&
                                        (i.itemSize == item.itemSize)
                                    ))
                                let filtLength = filtered.length
                                let newItem = [item, filtLength]
                                console.log("iterated over item: " + item)

                                let newOrderFiltered = newOrder.filter(i =>
                                    (
                                        (i[0].itemName == item.itemName) &&
                                        (i[0].itemColor == item.itemColor) &&
                                        (i[0].itemSize == item.itemSize)
                                    ))

                                if (newOrderFiltered.length == 0) {
                                    return newOrder.push(newItem)
                                }
                            })

                            // let finalOrder = newOrder.filter((item, index) => {
                            //     return newOrder.indexOf(item) === index
                            // })
                            let finalOrder = [...new Set(newOrder)]

                            console.log("finalOrder: " + finalOrder)

                            let emptyArr = []

                            let amountPaid = ((Number(order[2]) / 100).toFixed(2))
                            let dateObj = new Date(Number(order[0]) * 1000)
                            let dateFull = dateObj.toString()
                            let dateShort = dateFull.split(" ")
                            let briefDate = [
                                dateShort[0],
                                dateShort[1],
                                dateShort[2],
                                dateShort[3]].join(" ")
                            let orderType = order[3]
                            let orderCreditUsed = ((Number(order[4]) / 100).toFixed(2))
                            let orderStatus = order[5]
                            let orderTracking = order[6]
                            return (
                                <div className="graded">
                                    <div
                                        className="row shadowed"
                                        style={{ "margin": `${isLargeScreen ? "4em" : "1em"}` }}>


                                        <div className="centered">
                                            {(orderType !== "exchange") &&

                                                <p>Order Total: ${amountPaid}</p>
                                            }
                                            {(orderType == "exchange") &&

                                                <p>Exchange</p>

                                            }
                                            {(orderCreditUsed > 0) &&

                                                <p>Store Credit Used: ${orderCreditUsed}</p>
                                            }

                                            <p>{orderQuant} {(orderQuant == 1 ? "item" : "items")}</p>


                                            <p>Order Date: {briefDate}</p>

                                            {orderStatus &&
                                                <p>{orderStatus}</p>
                                            }
                                            {(orderTracking && (orderStatus == "Shipped")) &&

                                                <a
                                                    href={`https://tools.usps.com/go/TrackConfirmAction?tRef=fullpage&tLc=2&text28777=&tLabels=${orderTracking}%2C`}>
                                                    Track My Order</a>
                                            }
                                        </div>

                                        {
                                            finalOrder.map(item => {
                                                console.log(newOrder)
                                                let product = item[0]
                                                let productCount = item[1].toString()
                                                console.log(product)

                                                let boolArr = []
                                                let arrFilt = emptyArr.filter(i => i == item)
                                                let leCount = arrFilt.length
                                                if (leCount == 0) {
                                                    emptyArr.push(item)
                                                    boolArr.push(true)
                                                } else {
                                                    boolArr.push(false)
                                                }


                                                let linkString = product.itemName.split(" ").join("-")
                                                let itemColorArr = product.itemColor.split("_")

                                                let itemColor = itemColorArr[0]

                                                let itemSize = product.itemSize
                                                let newArr = []
                                                if (itemSize === "One-Size") {
                                                    newArr.push("One Size")
                                                } else {
                                                    newArr.push(itemSize)
                                                }

                                                let productSource = allProducts.find(item => item[0] === product.itemName)


                                                if (
                                                    (productSource !== undefined)
                                                    //    && (boolArr[0] == true)
                                                ) {

                                                    return (
                                                        <div
                                                            className="columnSmall shadowed"
                                                            style={{ "width": `${isLargeScreen ? "25%" : "100%"}` }}
                                                        >
                                                            <Link to={`/product/${linkString}`}>
                                                                <img src={`${productSource[5]}`} width="30%" height="auto"></img>
                                                                <p className="marginless">{product.itemName}{(item[1] > 1) && ` (${productCount})`}</p>
                                                                <p className="marginless">{newArr[0]}</p>
                                                                <p className="marginless">{itemColor}</p>
                                                            </Link>
                                                        </div>
                                                    )
                                                }
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <button
                    width="6em"
                    className="button primary"
                    type="button"
                    onClick={() => toggleShowEarlier()}
                >{showEarlier ? "Hide Earlier" : "Show Earlier"}</button>
                {
                    showEarlier &&
                    <div
                        className="shadowed"
                        style={{ "margin": "1vw" }}>
                        {prevOrders.map(order => {
                            if (prevOrders.indexOf(order) > 4) {


                                let newOrder = []

                                order[1].map(item => {
                                    let filtered = order[1].filter(i =>
                                        (
                                            (i.itemName == item.itemName) &&
                                            (i.itemColor == item.itemColor) &&
                                            (i.itemSize == item.itemSize)
                                        ))
                                    let filtLength = filtered.length
                                    let newItem = [item, filtLength]
                                    console.log("iterated over item: " + item)

                                    let newOrderFiltered = newOrder.filter(i =>
                                        (
                                            (i[0].itemName == item.itemName) &&
                                            (i[0].itemColor == item.itemColor) &&
                                            (i[0].itemSize == item.itemSize)
                                        ))

                                    if (newOrderFiltered.length == 0) {
                                        return newOrder.push(newItem)
                                    }
                                })

                                console.log(newOrder)

                                let orderQuant = order[1].length
                                console.log(newOrder)

                                // let finalOrder = newOrder.filter((item, index) => {
                                //     return newOrder.indexOf(item) === index
                                // })

                                let emptyArr = []

                                let finalOrder = [...new Set(newOrder)]
                                // let finalOrder = [...orderSet]
                                // let orderQuant = order[1].length
                                console.log("finalOrder: " + finalOrder)

                                let amountPaid = ((Number(order[2]) / 100).toFixed(2))
                                let dateObj = new Date(Number(order[0]) * 1000)
                                let dateFull = dateObj.toString()
                                let dateShort = dateFull.split(" ")
                                let briefDate = [
                                    dateShort[0],
                                    dateShort[1],
                                    dateShort[2],
                                    dateShort[3]].join(" ")
                                let orderType = order[3]
                                let orderCreditUsed = ((Number(order[4]) / 100).toFixed(2))
                                let orderStatus = order[5]
                                let orderTracking = order[6]
                                return (
                                    <div className="shadowed graded">


                                        <div className="centered">
                                            {(orderType !== "exchange") &&

                                                <p>Order Total: ${amountPaid}</p>
                                            }
                                            {(orderType == "exchange") &&

                                                <p>Exchange</p>
                                            }
                                            {(orderCreditUsed > 0) &&

                                                <p>Store Credit Used: ${orderCreditUsed}</p>
                                            }

                                            <p>{orderQuant} {(orderQuant == 1 ? "item" : "items")}</p>

                                            <p>Order Date: {briefDate}</p>

                                            {orderStatus &&
                                                <p>{orderStatus}</p>
                                            }
                                            {(orderTracking && (orderStatus == "Shipped")) &&

                                                <a
                                                    href={`https://tools.usps.com/go/TrackConfirmAction?tRef=fullpage&tLc=2&text28777=&tLabels=${orderTracking}%2C`}>
                                                    Track My Order</a>
                                            }
                                        </div>

                                        <div
                                            className="row"
                                            style={{ "margin": `${isLargeScreen ? "4em" : "0em"}` }}>
                                            {finalOrder.map(item => {

                                                let boolArr = []
                                                let arrFilt = emptyArr.filter(i => i == item)
                                                let leCount = arrFilt.length
                                                if (leCount == 0) {
                                                    emptyArr.push(item)
                                                    boolArr.push(true)
                                                } else {
                                                    boolArr.push(false)
                                                }




                                                console.log(newOrder)
                                                let product = item[0]
                                                let productCount = item[1].toString()

                                                // sameItemArray.push(product)

                                                // let sameExactItem = sameItemArray.filter(item => item === product)
                                                // let exactItemCount = sameExactItem.length

                                                let linkString = product.itemName.split(" ").join("-")
                                                let itemColorArr = product.itemColor.split("_")

                                                let itemColor = itemColorArr[0]

                                                let itemSize = product.itemSize
                                                let newArr = []
                                                if (itemSize === "One-Size") {
                                                    newArr.push("One Size")
                                                } else {
                                                    newArr.push(itemSize)
                                                }

                                                let productSource = allProducts.find(item => item[0] === product.itemName)
                                                console.log(productSource)

                                                if (
                                                    (productSource !== undefined)
                                                    //  &&   (boolArr[0] == true)
                                                ) {
                                                    return (
                                                        <div
                                                            className="columnSmall shadowed"
                                                            style={{ "width": `${isLargeScreen ? "25%" : "100%"}` }}>
                                                            <Link to={`/product/${linkString}`}>
                                                                <img src={`${productSource[5]}`} width="30%" height="auto"></img>
                                                                <p className="marginless">{product.itemName}{(item[1] > 1) && ` (${productCount})`}</p>
                                                                <p className="marginless">{newArr[0]}</p>
                                                                <p className="marginless">{itemColor}</p>
                                                            </Link>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                    </div>

                                )

                            }
                        })}
                    </div>
                }
                <nav className="darkNav" aria-label="You are here:" role="navigation">
                    <ul class="breadcrumbs">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/account">Account</Link></li>
                        <li><Link to="/my-orders">Orders</Link></li>
                        <li>
                            <span class="show-for-sr">Current: Your Orders</span>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    } else if (!ordersLoaded) {
        return (
            <div>
                <nav style={{ "marginTop": "1em" }}
                    className="darkNav" aria-label="You are here:" role="navigation">
                    <ul class="breadcrumbs">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/account">Account</Link></li>
                        <li><Link to="/my-orders">Orders</Link></li>
                        <li>
                            <span class="show-for-sr">Current: Your Orders</span>
                        </li>
                    </ul>
                </nav>
                <div
                    className="shadowed centered"
                    style={{ "margin": "1em" }}>
                    <h4>Orders Loading...</h4>
                    <div className="loader"></div>
                </div>
                <nav style={{ "marginTop": "1em" }}
                    className="darkNav" aria-label="You are here:" role="navigation">
                    <ul class="breadcrumbs">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/account">Account</Link></li>
                        <li><Link to="/my-orders">Orders</Link></li>
                        <li>
                            <span class="show-for-sr">Current: Your Orders</span>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }

    else if (ordersLoaded && (prevOrders.length < 1)) {
        return (
            <div>
                <nav style={{ "marginTop": "1em" }}
                    className="darkNav" aria-label="You are here:" role="navigation">
                    <ul class="breadcrumbs">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/account">Account</Link></li>
                        <li><Link to="/my-orders">Orders</Link></li>
                        <li>
                            <span class="show-for-sr">Current: Your Orders</span>
                        </li>
                    </ul>
                </nav>
                <div
                    className="shadowed centered"
                    style={{
                        "margin": "1em",
                        "height": "7em"
                    }}>
                    <h4>You haven't placed any orders yet.</h4>
                    <Link to="/account">
                        <div className="userAccount">
                            <div className="itemCard">
                                <button
                                    className="userButton button primary"
                                    style={{ "height": "3em" }}>Back to Account</button>
                            </div>
                        </div>
                    </Link>
                </div>
                <nav className="darkNav" aria-label="You are here:" role="navigation">
                    <ul class="breadcrumbs">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/account">Account</Link></li>
                        <li><Link to="/my-orders">Orders</Link></li>
                        <li>
                            <span class="show-for-sr">Current: Your Orders</span>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
}

export default MyOrders

