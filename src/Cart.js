import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase";
import CartItemList from "./CartItemList";
import { Context } from "./Context";
import Flexbox from "flexbox-react";
import RecentlyViewed from "./RecentlyViewed";
import Footer from "./Footer";

// objectives:
// Handle tax and shipping.
// Ask for shipping information and promo codes.
// Express checkout

function Cart() {
  const {
    totalCost,
    itemCount,
    itemNumberString,
    routerString,
    setRouterString,
    setTermsDisplay,
    itemList,
    anonUser,
    setOnCheckout,
    accountTitleString,
    expressCheckoutOn,
    setExpressCheckoutOn,
    handleExpressModal,
    setUseExpressMode,
    useExpressMode,
    isLargeScreen,
    setSearchString,
    setOnProductPage,
    setOnHomeScreen,
  } = useContext(Context);

  useEffect(() => {
    setSearchString("");
    setTermsDisplay(false);
    setOnCheckout(false);
    setOnHomeScreen(false);
    setRouterString("cart");
    document.getElementById("firebaseui-auth-container").style.display = "none";
    // document.getElementById('smallSearch').style.display = "none"
    // document.getElementById('largeSearch').style.display = "none"
    setUseExpressMode(false);
    setOnProductPage(false);
  }, []);

  useEffect(() => {
    if (firebase.auth().currentUser && !anonUser) {
      // user signed in, enable express

      if (
        document.getElementById("expressCheckout") !== null &&
        document.getElementById("expressCheckout") !== undefined
      ) {
        document.getElementById("expressCheckout").style.disabled = false;
      }

      // (firebase.auth().currentUser && !firebase.auth().currentUser.isAnonymous)
    } else {
      if (
        document.getElementById("expressCheckout") !== null &&
        document.getElementById("expressCheckout") !== undefined
      ) {
        document.getElementById("expressCheckout").style.disabled = true;
      }
      // disable express
    }
  }, [expressCheckoutOn]);
  // when remove from cart is clicked, subtract 1 from count and price from price

  return (
    <div className="cart">
      <nav
        style={{ marginTop: "1em" }}
        className="darkNav"
        aria-label="You are here:"
        role="navigation"
      >
        <ul class="breadcrumbs">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/shop">Cart</Link>
          </li>
          <li>
            <span class="show-for-sr">Current: Cart</span>
          </li>
        </ul>
      </nav>
      <div
        className="centered"
        style={{
          //   "background-color": "black",
          //   "box-shadow": "0px 0px 5px white",
          width: "94%",
          height: "100%",
        }}
      >
        <h4
          onLoad={() => {
            window.scroll(0, 130);
          }}
        >
          Cart
        </h4>
        {itemList.length === 0 && (
          <div className="centered rounded" style={{ minHeight: "30vh" }}>
            <div>
              <div className="centered" style={{ top: "8em" }}>
                <p
                  className="centered"
                  style={{
                    "background-color": "#565759",
                    padding: ".25em",
                    "border-radius": "13px",
                    width: `${isLargeScreen && "20%"}`,
                    position: "relative",
                    whiteSpace: "nowrap",
                  }}
                >
                  Your shopping cart is empty.
                </p>
                <Link to="/shop">
                  <button
                    className="button primary glowButtonBlue"
                    type="button"
                  >
                    Go Shopping
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
        <Flexbox
          flexDirection={`${isLargeScreen ? "row" : "column"}`}
          className="rounded"
        >
          <div
            className="rounded"
            style={{ display: `${isLargeScreen ? "none" : "initial"}` }}
          >
            <p className="itemCard">
              Cart Total ({itemCount} {itemNumberString}): $
              {(totalCost / 100).toFixed(2)}
            </p>
            {itemList.length > 0 && (
              <div className="itemCard stickyCheckout">
                <Link to="/checkout">
                  <button
                    className="userButton button primary"
                    style={{
                      width: `${isLargeScreen ? "20vw" : "30vw"}`,
                      margin: "2em",
                      fontSize: "small",
                      "max-height": "3em",
                    }}
                    type="button"
                  >
                    Checkout
                  </button>
                </Link>
                <Link to="/checkout">
                  {!expressCheckoutOn ? (
                    <span
                      data-tooltip
                      class="has-tip top"
                      tabindex="2"
                      title={`${
                        !expressCheckoutOn && "Sign in to use Express Checkout."
                      }`}
                    >
                      <button
                        className="userButton button success"
                        style={{
                          width: `${isLargeScreen ? "20vw" : "30vw"}`,
                          margin: "2em",
                          marginBottom: `${isLargeScreen ? "0em" : "2em"}`,
                          fontSize: "small",
                          "max-height": "3em",
                        }}
                        type="button"
                        id="expressCheckoutTwo"
                        disabled={!expressCheckoutOn}
                        onClick={() => {
                          handleExpressModal();
                          setUseExpressMode(true);
                        }}
                      >
                        Express Checkout
                      </button>
                    </span>
                  ) : (
                    <button
                      className="userButton button success"
                      style={{
                        width: `${isLargeScreen ? "20vw" : "30vw"}`,
                        margin: "2em",
                        fontSize: "small",
                        "max-height": "3em",
                      }}
                      type="button"
                      id="expressCheckoutTwo"
                      disabled={!expressCheckoutOn}
                      onClick={() => {
                        handleExpressModal();
                        setUseExpressMode(true);
                      }}
                    >
                      Express Checkout
                    </button>
                  )}
                </Link>
              </div>
            )}
          </div>
          <div>
            <CartItemList />
          </div>
          <div className="stickyCheckout">
            {itemList.length > 0 && (
              <p
                style={{
                  position: `${isLargeScreen ? "sticky" : "relative"}`,
                  top: "35%",
                }}
                className="stickyCheckout4"
              >
                Cart Total ({itemCount} {itemNumberString}): $
                {(totalCost / 100).toFixed(2)}
              </p>
            )}
            {itemList.length > 0 && (
              <div className="itemCard stickyCheckout">
                <Link to="/checkout">
                  <button
                    className="userButton button primary"
                    style={{
                      width: `${isLargeScreen ? "20vw" : "30vw"}`,
                      margin: "2em",
                      fontSize: `${isLargeScreen ? "medium" : "small"}`,
                      "max-height": "3em",
                    }}
                    type="button"
                  >
                    Checkout
                  </button>
                </Link>
                <Link to="/checkout">
                  {!expressCheckoutOn ? (
                    <span
                      data-tooltip
                      class="has-tip top"
                      tabindex="2"
                      title={`${
                        !expressCheckoutOn && "Sign in to use Express Checkout."
                      }`}
                    >
                      <button
                        className="userButton button success"
                        style={{
                          width: `${isLargeScreen ? "20vw" : "30vw"}`,
                          margin: "2em",
                          marginBottom: `${isLargeScreen ? "0em" : "2em"}`,
                          marginLeft: "0em",
                          marginRight: "0em",
                          fontSize: "small",
                          "max-height": "3em",
                        }}
                        type="button"
                        id="expressCheckoutTwo"
                        disabled={!expressCheckoutOn}
                        onClick={() => {
                          handleExpressModal();
                          setUseExpressMode(true);
                        }}
                      >
                        Express Checkout
                      </button>
                    </span>
                  ) : (
                    <button
                      className="userButton button success"
                      style={{
                        width: `${isLargeScreen ? "20vw" : "30vw"}`,
                        margin: "2em",
                        marginBottom: `${isLargeScreen ? "0em" : "2em"}`,
                        fontSize: "small",
                        "max-height": "3em",
                        position: `${isLargeScreen ? "sticky" : "relative"}`,
                      }}
                      type="button"
                      id="expressCheckoutTwo"
                      disabled={!expressCheckoutOn}
                      onClick={() => {
                        handleExpressModal();
                        setUseExpressMode(true);
                      }}
                    >
                      Express Checkout
                    </button>
                  )}
                </Link>
              </div>
            )}
          </div>
        </Flexbox>
      </div>
      <br></br>
      <nav className="darkNav" aria-label="You are here:" role="navigation">
        <ul class="breadcrumbs">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/shop">Cart</Link>
          </li>
          <li>
            <span class="show-for-sr">Current: Cart</span>
          </li>
        </ul>
      </nav>
    </div>
  );

  // create express checkout component which uses all the saved info from before.
}

export default Cart;
