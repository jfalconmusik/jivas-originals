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
        isLargeScreen
    } = useContext(Context)

    useEffect(() => {
        setOnCheckout(false)
        setTermsDisplay(false)
        document.getElementById("firebaseui-auth-container").style.display = "none"
        // document.getElementById('smallSearch').style.display = "none"
        // document.getElementById('largeSearch').style.display = "none"
    }, [])

    const lastFiveOrders = [prevOrders[0], prevOrders[1], prevOrders[2], prevOrders[3], prevOrders[4]]

    console.log(prevOrders)
    console.log(lastFiveOrders)

    if (((prevOrders.length > 0) && (prevOrders.length < 6)) && ordersLoaded) {
        return (

            <div>
                <nav aria-label="You are here:" role="navigation">
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
                    <h1>My Orders ({prevOrders.length})</h1>
                    <div>
                        {lastFiveOrders.map(order => {

                            if (order) {

                                // let sameItemArray = []
                                let newOrder = []

                                order[1].forEach(item => {
                                    let filtered = order[1].filter(i => i == item)
                                    let filtLength = filtered.length
                                    let newItem = [item, filtLength]

                                    if (!newOrder.includes(newItem)) {
                                        newOrder.push(newItem)
                                    }
                                })

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
                                    <div>
                                        <div
                                            className="row shadowed"
                                            style={{ "margin": `${isLargeScreen ? "4em" : "0em"}` }}
                                        >
                                            {(orderType !== "exchange") && <h4>Order Total: ${amountPaid}</h4>}
                                            {(orderType == "exchange") &&
                                                <div>
                                                    <h4>Exchange</h4>
                                                </div>
                                            }
                                            {(orderCreditUsed > 0) &&
                                                <h4>Store Credit Used: ${orderCreditUsed}</h4>}
                                            <h4>Order Date: {briefDate}</h4>
                                            {orderStatus && <h4>{orderStatus}</h4>}
                                            {(orderTracking && (orderStatus == "Shipped")) && <a
                                                href={`https://tools.usps.com/go/TrackConfirmAction?tRef=fullpage&tLc=2&text28777=&tLabels=${orderTracking}%2C`}>
                                                Track My Order</a>}

                                            {
                                                order[1].map(product => {

                                                    // sameItemArray.push(product)

                                                    // let sameExactItem = sameItemArray.filter(item => item === product)
                                                    // let exactItemCount = sameExactItem.length

                                                    if (product.itemName) {

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
                                                                    <p className="marginless"
                                                                    >{product.itemName}{(exactItemCount > 1) && ` (${exactItemCount})`}</p>
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
                <nav aria-label="You are here:" role="navigation">
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
                <nav aria-label="You are here:" role="navigation">
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

                            // let sameItemArray = []

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

                            return (
                                <div>
                                    <div
                                        className="row shadowed"
                                        style={{ "margin": `${isLargeScreen ? "4em" : "1em"}` }}>
                                        {(orderType !== "exchange") && <h4>Order Total: ${amountPaid}</h4>}
                                        {(orderType == "exchange") &&
                                            <div>
                                                <h4>Exchange</h4>
                                            </div>
                                        }
                                        {(orderCreditUsed > 0) &&
                                            <h4>Store Credit Used: ${orderCreditUsed}</h4>}
                                        <h4>Order Date: {briefDate}</h4>

                                        {
                                            order[1].map(product => {
                                                console.log(product)

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


                                                if ((productSource !== undefined) && (exactItemCount < 2)) {

                                                    return (
                                                        <div
                                                            className="columnSmall shadowed"
                                                            style={{ "width": `${isLargeScreen ? "25%" : "100%"}` }}
                                                        >
                                                            <Link to={`/product/${linkString}`}>
                                                                <img src={`${productSource[5]}`} width="30%" height="auto"></img>
                                                                <p className="marginless">{product.itemName}</p>
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
                {showEarlier &&
                    <div className="shadowed">
                        {prevOrders.map(order => {
                            if (prevOrders.indexOf(order) > 4) {

                                // let sameItemArray = []
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

                                return (
                                    <div>
                                        {(orderType !== "exchange") && <h4>Order Total: ${amountPaid}</h4>}
                                        {(orderType == "exchange") &&
                                            <div>
                                                <h4>Exchange</h4>
                                            </div>}
                                        {(orderCreditUsed > 0) &&
                                            <h4>Store Credit Used: ${orderCreditUsed}</h4>}
                                        <h4>Order Date: {briefDate}</h4>
                                        <div
                                            className="row shadowed"
                                            style={{ "margin": `${isLargeScreen ? "4em" : "0em"}` }}>
                                            {order[1].map(product => {

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

                                                if (productSource !== undefined) {
                                                    return (
                                                        <div
                                                            className="columnSmall shadowed"
                                                            style={{ "width": `${isLargeScreen ? "25%" : "100%"}` }}>
                                                            <Link to={`/products/${linkString}`}>
                                                                <img src={`${productSource[5]}`} width="30%" height="auto"></img>
                                                                <p className="marginless">{product.itemName}</p>
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
                    </div>}
                <nav aria-label="You are here:" role="navigation">
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
                <nav aria-label="You are here:" role="navigation">
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
                <nav aria-label="You are here:" role="navigation">
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
                <nav aria-label="You are here:" role="navigation">
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
                </div>
                <nav aria-label="You are here:" role="navigation">
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

