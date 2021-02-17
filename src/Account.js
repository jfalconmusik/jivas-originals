import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase";
import * as firebaseui from "firebaseui";
import { Context } from "./Context";
import SignInWithEmail from "./SignInWithEmail";
import Wishlist from "./Wishlist";
import { jquery } from "jquery";
import Flexbox from "flexbox-react";
import RecentlyViewed from "./RecentlyViewed";
import Footer from "./Footer";
// import { updateStaySignedIn } from "../functions"

function Account() {
  const {
    userInfo,
    setUserInfo,
    anonUser,
    setAnonUser,
    userSignedInCount,
    setUserSignedInCount,
    wishlistItemCount,
    handleSignOut,
    setSignInUiLoaded,
    signInUiLoaded,
    routerString,
    setRouterString,
    setTermsDisplay,
    accountName,
    accountTitleString,
    storeCredit,
    setOnCheckout,
    wishlistTempCache,
    termsDisplay,
    allowNotify,
    notifyUpdated,
    setNotifyUpdated,
    updatesChoice,
    setUpdatesChoice,
    setStaySignedIn,
    staySignedIn,
    darkMode,
    setDarkMode,
    wishListDisplayed,
    setWishlistDisplayed,
    wishlistString,
    setWishlistString,
    setUseExpressMode,
    itemList,
    isLargeScreen,
    setOnProductPage,
    isPortrait,
    isSmallScreen,
    setOnHomeScreen,
  } = useContext(Context);

  useEffect(() => {
    setOnCheckout(false);
    setUseExpressMode(false);
    setOnProductPage(false);
    setOnHomeScreen(false);
  }, []);

  function toggleStaySignedIn() {
    let staySignedBool = document.getElementById("keepMeSignedIn").checked;
    console.log(staySignedBool);

    if (staySignedIn == true) {
      setStaySignedIn(false);
      updateSignedIn(false);
    } else {
      setStaySignedIn(true);
      updateSignedIn(true);
    }

    if (staySignedBool == true) {
      document.getElementById("keepMeSignedIn").checked = false;
      document.getElementById("keepMeSignedIn").setAttribute("checked", "true");
    } else {
      document.getElementById("keepMeSignedIn").checked = false;
      document
        .getElementById("keepMeSignedIn")
        .setAttribute("checked", "false");
    }
  }

  const [userSignedIn, setUserSignedIn] = useState(false);
  const [haveEmail, setHaveEmail] = useState(false);
  const [signOutDisplay, setSignOutDisplay] = useState(false);

  function toggleUpdatesBool() {
    let update = document.getElementById("keepMeUpdated2").checked;

    if (update == true) {
      document.getElementById("keepMeUpdated2").checked = false;
      document
        .getElementById("keepMeUpdated2")
        .setAttribute("checked", "false");
      let bool = true;
      firebase.functions().httpsCallable("allowNotifications")({ bool });
    } else {
      document.getElementById("keepMeUpdated2").checked = true;
      document.getElementById("keepMeUpdated2").setAttribute("checked", "true");
      let bool = false;
      firebase.functions().httpsCallable("allowNotifications")({ bool });
    }

    if (updatesBool == false) {
      setUpdatesBool(true);
    } else {
      setUpdatesBool(false);
    }
  }

  useEffect(() => {
    setRouterString("account");
  }, []);

  useEffect(() => {
    if (userInfo.userEmail && !anonUser) {
      setTermsDisplay(false);

      document.getElementById("firebaseui-auth-container").style.display =
        "none";

      setUserSignedInCount(Number(userSignedInCount + 1));
      setUserSignedIn(true);
      setAnonUser(false);
      // document.getElementById('smallSearch').style.display = "none"
      // document.getElementById('largeSearch').style.display = "none"
    }
  }, []);

  useEffect(() => {
    if (!userInfo.userEmail) {
      document.getElementById("firebaseui-auth-container").style.display =
        "initial";
      setTermsDisplay(true);
    } else if (userInfo.userEmail && !anonUser) {
      document.getElementById("firebaseui-auth-container").style.display =
        "none";
      setTermsDisplay(false);
    }

    let user = firebase.auth().currentUser;

    if (user) {
      let email = firebase.auth().currentUser.email;
      if (email) {
        setHaveEmail(true);
      }
    }
  }, [userInfo]);

  useEffect(() => {
    if (anonUser || !userInfo.userEmail) {
      setTermsDisplay(true);
      document.getElementById("firebaseui-auth-container").style.display =
        "initial";
    }
  }, [anonUser, userInfo]);

  function toggleWishList() {
    !wishListDisplayed
      ? setWishlistString("Hide Favorites")
      : setWishlistString("Favorites");
    // wishlist, even when set, will give the previous value if called within the same function
    setWishlistDisplayed(!wishListDisplayed);
  }

  function handleReload() {
    window.location.reload();
  }

  const [updatesBool, setUpdatesBool] = useState(true);

  useEffect(() => {
    setUpdatesBool(updatesChoice);
  }, []);

  const [deleteModal, setDeleteModal] = useState(false);

  function handleDeleteAccount() {
    // firebase.functions().httpsCallable('saveDeletedUser')()

    let user = firebase.auth().currentUser;

    user
      .delete()
      .then(function () {
        // User deleted.
      })
      .catch(function (error) {
        // An error happened.
      });

    handleSignOut();
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (!notifyUpdated) {
      setUpdatesBool(allowNotify);
      setNotifyUpdated(true);
      setUpdatesBool(updatesChoice);
    } else {
      setUpdatesBool(updatesChoice);
    }
  }, []);

  function setDefaults() {
    // let dark = document.getElementById("dMode")
    let sign = document.getElementById("keepMeSignedIn");
    let up = document.getElementById("keepMeUpdated2");

    // if (darkMode) {
    //     dark.checked = true
    //     dark.setAttribute("checked", "true")
    // } else {
    //     dark.checked = false
    //     dark.setAttribute("checked", "false")
    // }

    if (staySignedIn) {
      sign.checked = true;
      sign.setAttribute("checked", "true");
    } else {
      sign.checked = false;
      sign.setAttribute("checked", "false");
    }

    if (allowNotify) {
      up.checked = true;
      up.setAttribute("checked", "true");
    } else {
      up.checked = false;
      up.setAttribute("checked", "false");
    }

    // console.log(dark)
    console.log(sign);
    console.log(up);
  }

  function updateSignedIn(bool) {
    firebase.functions().httpsCallable("updateStaySignedIn")({ bool });
  }

  if (
    ((userInfo.userEmail || haveEmail) &&
      !anonUser &&
      !(userInfo.providerId == "firebase") &&
      !(userInfo.displayName == "firebase")) ||
    userInfo.providerId == "twitter.com"
  ) {
    return (
      <div>
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
              <Link to="/account">Account</Link>
            </li>
            <li>
              <span class="show-for-sr">Current: Account</span>
            </li>
          </ul>
        </nav>
        <div
          className="shadowed rounded"
          style={{
            padding: "2em",
            maxWidth: "92%",
            "margin-left": "4vw",
            height: `${isLargeScreen ? "auto" : "90em"}`,
          }}
        >
          <h2>{accountTitleString}</h2>
          <Flexbox
            flexDirection={isLargeScreen ? "row" : "column"}
            className="centered"
            style={{
              left: "8vw",
              boxSize: "border-box",
            }}
          >
            <Flexbox
              flexDirection="column"
              style={{
                maxWidth: `${isLargeScreen ? "33%" : "100%"}`,
                padding: "5vw",
                "box-shadow": "0px 0px 5px white",
                backgroundColor: "black",
                width: `${isLargeScreen ? "33%" : "99%"}`,
              }}
            >
              <div>
                <h4>You are signed in as:</h4>
                <div className="userAccount">
                  <h2 className="userInfo">{userInfo.displayName}</h2>
                  <h2 className="userInfo">{userInfo.userEmail}</h2>
                  <h2 className="userInfo">{userInfo.providerId}</h2>
                  <img
                    className="accountPhoto"
                    src={userInfo.photoURL}
                    alt="user"
                  />
                  <div className="itemCard"></div>
                </div>
              </div>
              {signOutDisplay && (
                <div
                  className="itemOptionsModal"
                  id="signOutModal"
                  style={{ left: `${isLargeScreen ? "30w" : "5vw"}` }}
                >
                  <p>Are you sure you want to sign out?</p>
                  <button
                    type="button"
                    className="itemOptionsModalButton button primary"
                    id="signOutModalButton"
                    style={{ margin: "1em" }}
                    onClick={() => {
                      setSignOutDisplay(false);
                      handleSignOut();
                    }}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className="itemOptionsModalButton button primary"
                    id="signOutModalButton"
                    style={{ margin: "1em" }}
                    onClick={() => setSignOutDisplay(false)}
                  >
                    No
                  </button>
                </div>
              )}
              {deleteModal && (
                <div>
                  <h3>
                    Are you sure you want to delete your account? All your
                    information will be lost.
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteModal(false);
                      handleDeleteAccount();
                    }}
                  >
                    Delete Account
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteModal(false);
                    }}
                  >
                    No Thanks
                  </button>
                </div>
              )}
              <br></br>
              <br></br>
              {storeCredit > 0 && !termsDisplay && (
                <span
                  data-tooltip
                  class="top"
                  tabindex="2"
                  title="You've got store credit from your return order!"
                >
                  <p>
                    Your Store Credit: ${(Number(storeCredit) / 100).toFixed(2)}
                  </p>
                </span>
              )}
              <div>
                <button
                  type="button"
                  className="userButton button primary"
                  style={{ maxWidth: `${isLargeScreen && "90%"}` }}
                  onClick={() => setSignOutDisplay(true)}
                >
                  Sign Out
                </button>
              </div>
            </Flexbox>
            <Flexbox
              flexDirection="column"
              style={{
                maxWidth: `${isLargeScreen ? "33%" : "120%"}`,
                "padding-left": `${isLargeScreen ? "5vw" : "0vw"}`,
                "padding-right": `${isLargeScreen ? "5vw" : "0vw"}`,
                "padding-top": `${isLargeScreen ? "5vw" : "1em"}`,
                "padding-bottom": `${isLargeScreen ? "5vw" : "0vw"}`,
              }}
            >
              <div>
                <Link to="/my-orders">
                  <button
                    type="button"
                    style={{
                      fontSize: "x-large",
                      width: `${isLargeScreen ? "auto" : "10em"}`,
                      height: `${isLargeScreen ? "auto" : "4em"}`,
                      right: `${isLargeScreen ? "" : ".5em"}`,
                      // "height": `${isLargeScreen ? "auto" : "3em"}`
                    }}
                    className="userButton button primary"
                  >
                    <Flexbox flexDirection="row">
                      <img
                        alt="box icon"
                        width={`${isLargeScreen ? "30%" : "20%"}`}
                        height="auto"
                        style={{
                          bottom: ".2em",
                          position: "relative",
                          right: ".5em",
                        }}
                        src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/box%20white.svg?alt=media&token=eae805e2-1e2e-4cd7-bb81-b356955b4a4c"
                      />
                      <p
                        style={{
                          top: ".5em",
                          position: "relative",
                          "white-space": "nowrap",
                        }}
                      >
                        Your Orders
                      </p>
                    </Flexbox>
                  </button>
                </Link>
              </div>
              <Link to="/favorites">
                <button
                  style={{
                    fontSize: "x-large",
                    width: `${isLargeScreen ? "auto" : "10em"}`,
                    height: `${isLargeScreen ? "auto" : "4em"}`,
                    right: `${isLargeScreen ? "" : ".5em"}`,
                  }}
                  type="button"
                  className="userButton button primary"
                >
                  <Flexbox flexDirection="row">
                    <img
                      alt="wishlist icon"
                      width={`${isLargeScreen ? "30%" : "20%"}`}
                      height="auto"
                      style={{
                        bottom: ".2em",
                        position: "relative",
                        right: ".5em",
                      }}
                      src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/heart%20trans%20white%20border%202.svg?alt=media&token=db6c4320-c1e5-4683-873b-8683e83a4f14"
                    />
                    <p
                      style={{
                        top: ".5em",
                        position: "relative",
                      }}
                    >
                      {wishlistString}
                    </p>
                  </Flexbox>
                </button>
              </Link>
              {isLargeScreen && (
                <span
                  style={{
                    display: "inline",
                    // "textAlign": "left",
                    "padding-right": "5vw",
                    "padding-top": "5vw",
                    "padding-bottom": "5vw",
                    right: "1em",
                    maxWidth: "140%",
                    width: "140%",
                  }}
                >
                  <p
                    style={{
                      textAlign: "left",
                    }}
                  >
                    Keep me updated about special events and offers from Jiva
                    Fashions
                  </p>
                  <div class="switch">
                    <input
                      name="keepMeUpdated2"
                      class="switch-input"
                      type="checkbox"
                      id="keepMeUpdated2"
                      checked={updatesBool}
                      onClick={() => {
                        toggleUpdatesBool();
                      }}
                    ></input>
                    <label class="switch-paddle" for="keepMeUpdated2">
                      <span class="show-for-sr">
                        Keep me updated about special events and offers from
                        Jiva Fashions
                      </span>
                    </label>
                  </div>
                </span>
              )}
            </Flexbox>
            <Flexbox
              flexDirection="column"
              style={{
                maxWidth: `${isLargeScreen ? "33%" : "100%"}`,
                "padding-left": `${isLargeScreen ? "10vw" : "4vw"}`,
                "padding-right": "5vw",
                left: `${isLargeScreen ? "5vw" : "-.6em"}`,
                top: "-10em",
              }}
            >
              {!isLargeScreen && (
                <span
                  style={{
                    display: "inline",
                    "padding-right": "5vw",
                    "padding-top": "5vw",
                    "padding-bottom": "5vw",
                    right: "1em",
                    maxWidth: "140%",
                    width: "140%",
                    top: "16em",
                    position: "relative",
                  }}
                >
                  <span style={{ right: "10px", position: "relative" }}>
                    <p
                      style={{
                        textAlign: "left",
                      }}
                    >
                      Keep me updated about special events and offers from Jiva
                      Fashions
                    </p>
                  </span>
                  <div class="switch">
                    <input
                      name="keepMeUpdated2"
                      class="switch-input"
                      type="checkbox"
                      id="keepMeUpdated2"
                      checked={updatesBool}
                      onClick={() => {
                        toggleUpdatesBool();
                      }}
                    ></input>
                    <label class="switch-paddle" for="keepMeUpdated2">
                      <span class="show-for-sr">
                        Keep me updated about special events and offers from
                        Jiva Fashions
                      </span>
                    </label>
                  </div>
                </span>
              )}
              {(!isLargeScreen || isPortrait) && (
                <div>
                  <Link to="/cart">
                    <button
                      type="button"
                      style={{
                        fontSize: "x-large",
                        "margin-top": `${isLargeScreen ? "-28em" : "-27em"}`,
                        maxWidth: `${isLargeScreen ? "127%" : "10em"}`,
                        width: "127%",
                        position: "relative",
                        height: "4em",
                        right: `${!isPortrait || isLargeScreen ? ".5em" : ""}`,
                        top: `${
                          !isPortrait || isLargeScreen ? "8.6em" : "9em"
                        }`,
                        // left: ``,
                      }}
                      className="userButton button primary"
                    >
                      <Flexbox flexDirection="row">
                        <img
                          alt="cart icon"
                          width={`${isLargeScreen ? "30%" : "22%"}`}
                          height="auto"
                          style={{
                            bottom: ".4em",
                            position: "relative",
                            right: ".5em",
                            maxWidth: `${isLargeScreen ? "140%" : "10em"}`,
                            height: `${isLargeScreen ? "auto" : "3em"}`,
                            marginLeft: `initial`,
                          }}
                          src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart-white-2.svg?alt=media&token=f1c5ead8-3f11-40f4-ae15-77cb2ec07553"
                        />
                        <p
                          style={{
                            top: ".5em",
                            // "margin-bottom": "-1em",
                            position: "relative",
                            "white-space": "nowrap",
                          }}
                        >
                          View Cart
                        </p>
                      </Flexbox>
                    </button>
                  </Link>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  justifyContent: "space-around",
                  flexDirection: "column",
                  top: `${!isPortrait || isLargeScreen ? "95px" : "-65px"}`,
                  left: `${!isPortrait || isLargeScreen ? "" : "4vw"}`,
                }}
              >
                <div className="userAccount">
                  <div className="itemCard">
                    <Link to={`${itemList.length > 0 ? "/checkout" : "/cart"}`}>
                      <button
                        type="button"
                        style={{
                          fontSize: "x-large",
                          padding: "5px",
                          "margin-bottom": "0em",
                          maxWidth: `${isLargeScreen ? "150%" : "10em"}`,
                          width: `${isLargeScreen ? "150%" : "10em"}`,
                          position: "relative",
                          right: `${isLargeScreen ? ".5em" : ".6em"}`,
                          height: `${isLargeScreen ? "auto" : "4.5em"}`,
                        }}
                        className="userButton button success"
                        onClick={() => {
                          setUseExpressMode(true);
                        }}
                      >
                        <Flexbox flexDirection="row">
                          <img
                            alt="checkout bags icon"
                            width={`${isLargeScreen ? "30%" : "22%"}`}
                            height="auto"
                            style={{
                              bottom: ".2em",
                              position: "relative",
                              right: ".5em",
                            }}
                            src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/bag%202.svg?alt=media&token=cad5affb-bb16-4470-a3aa-4c7df27b6988"
                          />
                          <p
                            style={{
                              top: ".5em",
                              position: "relative",
                              "white-space": "nowrap",
                            }}
                          >
                            Checkout Now
                          </p>
                        </Flexbox>
                      </button>
                    </Link>
                  </div>
                </div>
                {isLargeScreen && !isPortrait && (
                  <div
                    style={{
                      marginTop: "15px",
                    }}
                  >
                    <Link to="/cart">
                      <button
                        type="button"
                        style={{
                          fontSize: "x-large",
                          maxWidth: `${isLargeScreen ? "150%" : "13em"}`,
                          width: "150%",
                          position: "relative",
                          right: "10px",
                        }}
                        className="userButton button primary"
                      >
                        <Flexbox flexDirection="row">
                          <img
                            alt="cart icon"
                            width="30%"
                            height="auto"
                            style={{
                              bottom: ".2em",
                              position: "relative",
                              right: ".5em",
                              height: `${isLargeScreen ? "auto" : "3em"}`,
                              marginLeft: `${
                                isLargeScreen ? "initial" : "1em"
                              }`,
                            }}
                            src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart-white-2.svg?alt=media&token=f1c5ead8-3f11-40f4-ae15-77cb2ec07553"
                          />
                          <p
                            style={{
                              top: ".5em",
                              // "margin-bottom": "-1em",
                              position: "relative",
                              "white-space": "nowrap",
                            }}
                          >
                            View Cart
                          </p>
                        </Flexbox>
                      </button>
                    </Link>
                  </div>
                )}
              </div>
              <div
                style={{
                  top: `${isLargeScreen ? "210px" : "26em"}`,
                  bottom: `${isLargeScreen ? "9em" : "-15em"}`,
                  position: "relative",
                }}
              >
                <span
                  style={{
                    display: "inline",
                    "margin-top": "-31em",
                    top: "-14.5em",
                    left: `${!isPortrait || isLargeScreen ? "" : "6vw"}`,
                    bottom: `${isLargeScreen ? "20em" : "-7.5em"}`,
                    position: `${isLargeScreen ? "" : "relative"}`,
                  }}
                >
                  <p>Keep me signed in</p>
                  <div class="switch">
                    <input
                      name="keepMeSignedIn"
                      class="switch-input"
                      type="checkbox"
                      id="keepMeSignedIn"
                      checked={staySignedIn}
                      onClick={() => {
                        toggleStaySignedIn();
                      }}
                    ></input>
                    <label class="switch-paddle" for="keepMeSignedIn">
                      <span class="show-for-sr">Keep me signed in</span>
                    </label>
                  </div>
                </span>
              </div>
            </Flexbox>
          </Flexbox>
          <Flexbox flexDirection="column">
            <button
              type="button"
              id="deleteAccountButton"
              className="userButton button secondary"
              style={{
                maxWidth: `${isLargeScreen ? "10%" : "100%"}`,
                float: "right",
                top: `${!isPortrait || isLargeScreen ? "10em" : "13em"}`,
                "margin-top": "10em",
                width: `${isLargeScreen ? "10%" : "10em"}`,
                position: `${isLargeScreen ? "" : "relative"}`,
              }}
              onClick={() => {
                setDeleteModal(true);
              }}
            >
              Delete Account
            </button>
          </Flexbox>
        </div>
        <RecentlyViewed />
        <br></br>
        <nav
          className="darkNav"
          onLoad={() => {
            setDefaults();
          }}
          aria-label="You are here:"
          role="navigation"
        >
          <ul class="breadcrumbs">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/account">Account</Link>
            </li>
            <li>
              <span class="show-for-sr">Current: Account</span>
            </li>
          </ul>
        </nav>
      </div>
    );
  } else if (anonUser) {
    return (
      <div>
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
              <Link to="/account">Account</Link>
            </li>
            <li>
              <span class="show-for-sr">Current: Account</span>
            </li>
          </ul>
        </nav>
        <h1>Account</h1>
        {/* <div className="shadowed centered" style={{
                    // "borderRadius": "25vw",
                    "position": "absolute",
                    "height": "70%",
                    "zIndex": "30",
                    "width": `${isLargeScreen ? "30%" : "90%"}`,
                    "top": "40%",
                    "left": "35vw"
                }}></div> */}
        <div className="text-center centered">
          <h4
            style={{
              "background-color": "#565759",
              padding: ".25em",
              "border-radius": "13px",
              width: `${isLargeScreen ? "30%" : "90%"}`,
              zIndex: "86",
              left: `${isLargeScreen ? "35vw" : "5vw"}`,
              position: "relative",
            }}
          >
            You are browsing as a guest.
          </h4>
        </div>
        <SignInWithEmail style={{ zIndex: "86" }} />
      </div>
    );
  } else if (!userSignedIn || !firebase.auth().currentUser) {
    return (
      <div>
        <h1>Account</h1>
        <h2>Choose a sign-in method below:</h2>
        {/* <div className="shadowed centered" style={{
                    // "borderRadius": "25vw",
                    "position": "absolute",
                    "height": "70%",
                    "zIndex": "30",
                    "width": `${isLargeScreen ? "30%" : "90%"}`,
                    "top": "40%",
                    "left": "35vw"
                }}></div> */}
        <SignInWithEmail />
        {/* <div id="firebaseui-auth-container"></div> */}
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
              <Link to="/account">Account</Link>
            </li>
            <li>
              <span class="show-for-sr">Current: Account</span>
            </li>
          </ul>
        </nav>
      </div>
    );
  } else {
    return (
      <div>
        <h2>One moment please...</h2>
        <div class="text-center">
          <div class="spinner-border" role="status"></div>
        </div>
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
              <Link to="/account">Account</Link>
            </li>
            <li>
              <span class="show-for-sr">Current: Account</span>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Account;
// includes to firebase auth UI ID.
