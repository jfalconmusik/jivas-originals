import React, { useContext, useEffect, useState, useRef } from "react";
import { Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Foundation, { Menu, TopBar, Accordion } from "react-foundation";
// import NavBar from "./components/navbar";
import "./App.css";
import Header from "./Header";
import { Link, Switch, Route } from "react-router-dom";
import Cart from "./Cart";
import CartSignIn from "./CartSignIn";
import About from "./About";
import Checkout from "./Checkout";
import Contact from "./Contact";
import Shop from "./Shop";
import Account from "./Account";
import Home from "./Home";
// import CardSection from "./CardSection"
import SignInSuccessful from "./SignInSuccessful";
import SignInSuccessEmail from "./SignInSuccessEmail";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";
import { Context, ContextProvider } from "./Context";
import firebase from "firebase";
import * as firebaseui from "firebaseui";
import SignInWithEmail from "./SignInWithEmail";
import OrderSuccess from "./OrderSuccess";
import ShippingComponent from "./ShippingOrderReview";
import ProductPage from "./ProductPage";
import MyOrders from "./MyOrders";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import ReactModal from "react-modal";
import MultiSelect from "react-multi-select-component";
import usePortal from "react-cool-portal";
import FullSets from "./FullSets";
import Tops from "./Tops";
import Skirts from "./Skirts";
import Belts from "./Belts";
import ExpressCheckout from "./ExpressCheckout";
import Blog from "./Blog";
import ReturnPolicy from "./ReturnPolicy";
import Flexbox from "flexbox-react";
import Wishlist from "./Wishlist";
import Favorites from "./Favorites";
import Sidebar from "react-sidebar";
import RecentlyViewed from "./RecentlyViewed";

function App() {
  const options = ["one", "two", "three"];
  const defaultOption = options[0];

  const {
    userInfo,
    setUserInfo,
    anonUser,
    setAnonUser,
    itemList,
    setItemList,
    signInUiLoaded,
    routerString,
    setRouterString,
    productPageComponent,
    termsDisplay,
    allProducts,
    setItemCategory,
    modalExecute,
    modalOpen,
    setModalOpen,
    modalText,
    optionsModalText,
    closeOptionsModal,
    activateOptionsModal,
    accountName,
    accountTitleString,
    setAccountTitleString,
    handleAllCredit,
    modStoreCredit,
    storeCredit,
    totalCost,
    onCheckout,
    wishlistTempCache,
    categorySearch,
    setCategorySearch,
    topCategory,
    beltCategory,
    fullSetCategory,
    productsLoaded,
    skirtCategory,
    displayNumber,
    allNumber,
    itemString,
    setAllNumber,
    setDisplayNumber,
    setItemString,
    handleSignOut,
    setWishlistString,
    wishlistString,
    setWishlistDisplayed,
    isLargeScreen,
    searchString,
    setSearchString,
    storeCreditExceedsCost,
    setStoreCreditExceedsCost,
    changeAmount,
    setChangeAmount,
    // sidebarOpen,
    // setSidebarOpen,
    homeIncrement,
    isSmallScreen,
    isPortrait,
    isBigScreen,
  } = useContext(Context);

  const [selected, setSelected] = useState([]);

  const [productPageLinkString, setProductPageLinkString] = useState("");
  const [modalOpenBool, setModalOpenBool] = useState(false);
  const [mouseOverModal, setMouseOverModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  function closeExpressModal() {
    document.getElementById("expressModal").style.display = "none";
  }

  function handleDelayedCloseModal() {
    setTimeout(() => {
      if (!mouseOverModal) {
        setModalOpenBool(false);
      }
    }, 1000);
  }
  function handleDelayedOpenModal() {
    setTimeout(() => {
      if (mouseOverModal) {
        setModalOpenBool(true);
      }
    }, 1000);
  }

  useEffect(() => {
    if (modalOpen) {
      document.getElementById("functionalModalButton").disabled = false;

      setTimeout(() => {
        setModalOpen(false);
      }, 4000);
    }
  }, [modalOpen]);

  useEffect(() => {
    document.getElementById("firebaseui-auth-container").style.display = "none";
  }, []);

  // firebase auth ui:
  useEffect(() => {
    if (
      !firebase.auth().currentUser ||
      firebase.auth().currentUser.isAnonymous
    ) {
      var data = null;
      var anonymousUser = firebase.auth().currentUser;
      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start("#firebaseui-auth-container", {
        credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM,
        autoUpgradeAnonymousUsers: true,
        signInFlow: "popup",
        signInSuccessUrl: "https://www.jivasoriginals.com/account",
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
          // signInFailure callback must be provided to handle merge conflicts which
          // occur when an existing credential is linked to an anonymous user.
          signInFailure: function (error) {
            // For merge conflicts, the error.code will be
            // 'firebaseui/anonymous-upgrade-merge-conflict'.
            if (error.code != "firebaseui/anonymous-upgrade-merge-conflict") {
              return Promise.resolve();
            }
            // The credential the user tried to sign in with.
            var cred = error.credential;
            // Copy data from anonymous user to permanent user and delete anonymous
            // user.
            // ...
            // Finish sign-in after data is copied.
            return firebase.auth().signInWithCredential(cred);
          },
        },
        // Other config options...
      });

      // setSignInUiLoaded(true)

      // <div className="authEmailButton"><Link to='/sign-in-with-email' onClick={() => handleReload()}>Sign in with Email</Link></div>
      // <Link to='/sign-in-with-email-v2' onClick={() => handleReload()}>Sign In With Email</Link>
    }
  }, []);

  const storage = firebase.storage();
  const storageRef = storage.ref();

  // get cart item number icon url:

  const [urlString, setUrlString] = useState("");
  const [listShow, setListShow] = useState("hidden");

  useEffect(() => {
    if (!firebase.auth().currentUser && itemList.length == 0) {
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-0.png?alt=media&token=60e4c09e-23b4-4ebe-831b-85a9f862d73c";
      // let img = document.getElementById('headerCartIcon');
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 0) {
      // storageRef.child("cart-no-0.svg").getDownloadURL().then(function (url) {
      // })

      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-0.png?alt=media&token=60e4c09e-23b4-4ebe-831b-85a9f862d73c";
      // let img = document.getElementById('headerCartIcon');
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 1) {
      // storageRef.child("cart-no-1.svg").getDownloadURL().then(function (url) {
      // })
      // let img = document.getElementById('headerCartIcon');
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-1.png?alt=media&token=90a75d25-258d-4250-b2be-b3d1e00bce38";
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 2) {
      // storageRef.child("cart-no-2.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-2.png?alt=media&token=2ad512f5-44cd-4497-bb2a-66f63290cdba";
      // let img = document.getElementById('headerCartIcon');
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 3) {
      // storageRef.child("cart-no-3.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-3.png?alt=media&token=950bac7a-f4ff-41fa-95ae-be66f8d62e61";
      // let img = document.getElementById('headerCartIcon');
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 4) {
      // storageRef.child("cart-no-4.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-4.png?alt=media&token=441f1ed0-7c9b-4aa7-8cf5-6ab08d2016e7";
      // let img = document.getElementById('headerCartIcon');
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 5) {
      // storageRef.child("cart-no-5.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-5.png?alt=media&token=d6119f05-fd88-433d-986b-6ce26240f448";
      // let img = document.getElementById('headerCartIcon');
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 6) {
      // storageRef.child("cart-no-6.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-6.png?alt=media&token=19b8b73a-245d-42cf-89cc-1a5094bbb695";
      // let img = document.getElementById('headerCartIcon');
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 7) {
      // storageRef.child("cart-no-7.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-7.png?alt=media&token=92ecf7bd-ce5a-4169-99e7-959e20d74058";
      // let img = document.getElementById('headerCartIcon');
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 8) {
      // storageRef.child("cart-no-8.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-8.png?alt=media&token=f1cf9f6a-3638-4653-9271-373ee29abfe5";
      // let img = document.getElementById('headerCartIcon');
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 9) {
      // storageRef.child("cart-no-9.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-9.png?alt=media&token=d6229d45-2575-455b-8cbd-b9b1fcba2105";
      // let img = document.getElementById('headerCartIcon');
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 10) {
      // storageRef.child("cart-no-10.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-10.png?alt=media&token=8174d8ad-4519-4a62-bbe0-bfac03ad39d3";
      // let img = document.getElementById('headerCartIcon');
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 11) {
      // storageRef.child("cart-no-11.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-11.png?alt=media&token=1b1d61ea-2761-43c2-bdb6-82421f27c3c3";
      // let img = document.getElementById('headerCartIcon');
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 12) {
      // storageRef.child("cart-no-12.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-12.png?alt=media&token=37f85708-53fa-49f0-9aa0-7b6faff6291f";
      // let img = document.getElementById('headerCartIcon');
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 13) {
      // storageRef.child("cart-no-13.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-13.png?alt=media&token=519e8de7-35d6-4f3d-b146-46faa2f8df01";
      // let img = document.getElementById('headerCartIcon');
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length > 13) {
      // storageRef.child("cart-smiley-2.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-full.png?alt=media&token=de1671de-333a-4049-9b91-2907b8d29871";
      // let img = document.getElementById('headerCartIcon');
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    }
  }, [itemList, userInfo]);

  // useEffect(function anonSignIn() {
  //   firebase.auth().onAuthStateChanged(function (user) {
  //     if (user && (user.isAnonymous == false) && (userInfo !== user)) {
  //       setUserInfo(user)
  //       setAnonUser(false)
  //       console.log(userInfo)
  //       // User is signed in. No need to sign in anonymously

  //     } else if (!user) {
  //       firebase.auth().signInAnonymously()
  //         .then(() => {
  //           console.log("Anonymous user: " + userInfo)
  //           setUserInfo(user)
  //           setAnonUser(true)
  //         }
  //         ).catch(function (error) {
  //           // Handle Errors here.
  //           var errorCode = error.code;
  //           var errorMessage = error.message;
  //           // ...
  //         });
  //       // No user is signed in
  //       console.log("No user signed in.")
  //     }
  //   });
  // }, [])

  const [updatesBool, setUpdatesBool] = useState(true);

  useEffect(() => {
    let bool = updatesBool;

    if (userInfo.length > 1) {
      firebase.functions().httpsCallable("allowNotifications")({ bool });
    }
  }, [updatesBool]);

  function PrivacyAndTermsAgreement() {
    document.getElementById("firebaseui-auth-container").style.display =
      "initial";

    return (
      <div style={{ "z-index": "87" }}>
        <p>
          By signing up, you agree to our
          <Link to="/privacy-policy">Privacy Policy</Link> and our
          <Link to="/terms-of-service">Terms of Service</Link>
        </p>
      </div>
    );
  }

  function dropDownChanges() {
    document.getElementById("dropId").onselect();
  }

  function handleRefresh() {
    if (!firebase.auth().currentUser.email || !firebase.auth().currentUser) {
      window.location.reload();
    }
  }

  const [mouseOverShop, setMouseOverShop] = useState(false);

  useEffect(() => {
    if (!mouseOverModal && !mouseOverShop) {
      setModalOpenBool(false);
    } else {
      // setTimeOutMS(0)
      setModalOpenBool(true);
    }
  }, [mouseOverModal, mouseOverShop]);

  // useEffect(() => {
  //   if (modalOpenBool) {
  //     document.getElementById('categoryModal').style.display = "initial"
  //   } else {
  //     document.getElementById('categoryModal').style.display = "none"
  //   }
  // }, [modalOpenBool])

  useEffect(() => {
    if (modalOpen) {
      document.getElementById("functionalModal").style.display = "initial";
    } else {
      document.getElementById("functionalModal").style.display = "none";
    }
  }, [modalOpen]);

  // const [timeOutMS, setTimeOutMS] = useState(10000)

  /// List of product categories to render:

  // useEffect(() => {
  //   if (modalOpenBool) {
  //     setTimeout(() => {
  //       setModalOpenBool(false)
  //     }, 4000)
  //   }

  // }, [modalOpenBool])

  function handleOverModal(bool) {
    if (bool === true) {
      setMouseOverModal(true);
    } else if (bool === false) {
      setTimeout(() => {}, 1000);
      setMouseOverModal(false);
    }
  }

  function handleOverShop(bool) {
    if (bool === true) {
      setMouseOverShop(true);
    } else if (bool === false) {
      setTimeout(() => {
        setMouseOverShop(false);
      }, 1000);
    }
  }

  const stripePromise = loadStripe(
    "pk_test_vSUOdXUItkZoDH7AA0LQppyq00W7RQlEuV"
  );

  // why do I have the test stripe promise right here?

  useEffect(() => {
    if (accountName) {
      if (!accountName.includes("@")) {
        let newArr = accountName.split(" ");
        let firstName = newArr[0];
        setAccountTitleString(`${firstName}'s Account`);
      }
    }
    console.log(accountName);
  }, [accountName]);

  const [navString, setNavString] = useState("");
  const [leaveCheckoutModal, setLeaveCheckoutModal] = useState(false);

  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleString, setToggleString] = useState("none");
  // false here means not opened.

  function handleToggleMenu() {
    if (!toggleMenu) {
      setToggleMenu(true);
      setToggleString("initial");
      // document.getElementById('accordionMenu').foundation('showAll');
    } else {
      setToggleMenu(false);
      setToggleString("none");
      // document.getElementById('accordionMenu').foundation('hideAll');
    }
  }

  useEffect(() => {
    document.getElementById("checkoutModal").setAttribute("display", "none");
    document.getElementById("checkoutModal").style.display = "none";
    // document.getElementById('accordionMenu').foundation('hideAll');
  }, []);

  useEffect(() => {
    if (leaveCheckoutModal) {
      document
        .getElementById("checkoutModal")
        .setAttribute("display", "initial");
      document.getElementById("checkoutModal").style.display = "initial";
    } else {
      document.getElementById("checkoutModal").setAttribute("display", "none");
      document.getElementById("checkoutModal").style.display = "none";
    }
  }, [leaveCheckoutModal]);

  function turnOffModal() {
    setModalOpen(false);
  }

  /////////////////////////////////////////////////////////////////
  // <   AutoComplete Code Section >
  /////////////////////////////////////////////////////////

  function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
      var a,
        b,
        i,
        val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) {
        return false;
      }
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function (e) {
            /*insert the value for the autocomplete text field:*/
            inp.value = this.getElementsByTagName("input")[0].value;
            /*close the list of autocompleted values,
            (or any other open lists of autocompleted values:*/
            closeAllLists();
          });
          a.appendChild(b);
        }
      }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) {
        //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = x.length - 1;
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
      closeAllLists(e.target);
    });
  }

  /////////////////////////////////////////////////////////////////
  // </  AutoComplete Code Section >
  /////////////////////////////////////////////////////////

  const [tops, setTops] = useState([]);
  const [belts, setBelts] = useState([]);
  const [sets, setSets] = useState([]);
  const [skirts, setSkirts] = useState([]);
  const [productsArray, setProductsArray] = useState([]);

  useEffect(() => {
    const topNames = topCategory.map((item) => {
      return item[0];
    });
    setTops(topNames);
  }, [topCategory]);

  useEffect(() => {
    const beltNames = beltCategory.map((item) => {
      return item[0];
    });
    setBelts(beltNames);
  }, [beltCategory]);

  useEffect(() => {
    const setNames = fullSetCategory.map((item) => {
      return item[0];
    });
    setSets(setNames);
  }, [fullSetCategory]);

  useEffect(() => {
    const productNames = allProducts.map((item) => {
      return item[0];
    });
    setProductsArray(productNames);
  }, [productsLoaded]);

  useEffect(() => {
    const skirtNames = skirtCategory.map((item) => {
      return item[0];
    });
    setSkirts(skirtNames);
  }, [skirtCategory]);

  const [searchArray, setSearchArray] = useState([]);
  const [searchClass, setSearchClass] = useState("");

  useEffect(() => {
    if (categorySearch == "belt") {
      setSearchArray(belts);
      setSearchClass("belts");
      setSearchString("Belts");
    } else if (categorySearch == "skirt") {
      setSearchArray(skirts);
      setSearchClass("skirts");
      setSearchString("Skirts");
    } else if (categorySearch == "top") {
      setSearchArray(tops);
      setSearchClass("tops");
      setSearchString("Tops");
    } else if (categorySearch == "fullSet") {
      setSearchArray(sets);
      setSearchClass("fullSets");
      setSearchString("Sets");
    } else if (categorySearch == "all") {
      setSearchArray(productsArray);
      setSearchClass("allProducts");
      setSearchString("Shop");
    }
  }, [categorySearch]);

  function handleSearchShop(prop) {
    let input = document.getElementById(`${prop}`).value;
    console.log(input);
    let filt1 = input.toUpperCase();
    let filter = filt1.split(" ").join("");
    let filtArr = filt1.split(" ");
    let filtSplit1 = filtArr[0];

    let filtSplit2Arr = [];
    if (filtArr.length > 1) {
      let filtSplit2 = filtArr[1];
      filtSplit2Arr.push(filtSplit2);
    }

    let all = document.getElementsByClassName(`${searchClass}`);
    console.log(all);
    console.log(all.length);
    console.log(all[0]);
    console.log(all[0].id);

    let allArray = Array.prototype.slice.call(all, 0, all.length + 1);
    console.log(allArray);
    console.log(allArray.length);

    let newArr = [];

    allArray.forEach((prod) => {
      console.log(prod);
      console.log(newArr);
      let prodID = prod.id;
      console.log(prodID);

      if (
        prodID.includes(filter) ||
        prodID.includes(filt1) ||
        prodID.includes(filtSplit1) ||
        (prodID.includes(filtSplit2Arr[0]) && prodID.includes(filtSplit1))
      ) {
        document.getElementById(prodID).style.display = "initial";
        document.getElementById(prodID).setAttribute("display", "initial");
        newArr.push(prodID);
        console.log(newArr);
      } else {
        document.getElementById(prodID).style.display = "none";
        document.getElementById(prodID).setAttribute("display", "none");
        console.log(newArr);
      }
    });

    // let i
    // for (i = 0; i < fullSetsArray.length; i++) {
    //     return (function handleIterate() {

    // console.log(i)
    // let fullSet = fullSetsArray[i]
    // console.log(fullSet)
    // })()
    // }

    let searchQuant = newArr.length;
    setAllNumber(searchQuant);
    console.log(searchQuant);
    console.log(newArr);

    if (input.length > 0) {
      setDisplayNumber(true);
    } else {
      setDisplayNumber(false);
    }

    if (newArr.length == 1) {
      setItemString("item matches your search");
    } else {
      setItemString("items match your search");
    }
  }

  const [mobileBrowsing, setMobileBrowsing] = useState(false);
  const [hamburgerDisplayString, setHamburgerDisplayString] = useState(
    "visible"
  );
  const [listItemDisplay, setListItemDisplay] = useState("visible");

  const [verticalMenuString, setVerticalMenuString] = useState("hidden");
  const [positionSetting, setPositionSetting] = useState("fixed");

  function handleVerticalMenu() {
    if (verticalMenuString == "hidden") {
      setPositionSetting("sticky");
      setVerticalMenuString("visible");
    } else if (verticalMenuString == "visible") {
      setVerticalMenuString("hidden");
      setPositionSetting("fixed");
    }
  }

  // useEffect(() => {
  //   if (mobileBrowsing) {
  //     setHamburgerDisplayString("visible")
  //     setListItemDisplay("hidden")
  //   } else {
  //     setHamburgerDisplayString("hidden")
  //     setListItemDisplay("visible")
  //   }

  // }, [mobileBrowsing])

  // useEffect(() => {

  //   window.mobileCheck = function () {
  //     let check = false;
  //     (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);

  //     if (check == true) {
  //       setMobileBrowsing(true)

  //     } else if (check == false) {
  //       setMobileBrowsing(false)
  //     }

  //     return check;
  //   };
  // }, [])
  // to decide if the viewport is mobile or not:

  // window.onscroll = function () { scrollSet() };

  // function scrollSet() {
  //   var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  //   var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  //   var scrolled = (winScroll / height) * 100;
  //   document.getElementById("progressBar").value = scrolled;
  // }
  const [toggleShopCategory, setToggleShopCategory] = useState("none");

  // let elem = new Foundation.Sticky(element, options)

  function handleToggleShopCategory() {
    if (toggleShopCategory == "initial") {
      setToggleShopCategory("none");
    } else if (toggleShopCategory == "none") {
      setToggleShopCategory("initial");
    }
  }

  // useEffect(() => {
  //   if (isLargeScreen) {
  //     setSidebarOpen(false);
  //   }
  // }, [isLargeScreen]);

  useEffect(() => {
    console.log(`sidebar open: ${sidebarOpen}`);
  }, [sidebarOpen]);

  function handleSidebar() {
    // the same element cannot handle multiple keyframes. That's why it only transitions out right now.

    console.log(`handleSidebar fired while ${sidebarOpen}`);
    let sidebar = document.getElementById("sidebar");

    if (sidebar) {
      // if (!isLargeScreen) {
      if (sidebarOpen) {
        sidebar.classList.add("slideOut");
        // void sidebar.offsetWidth;
        setTimeout(() => {
          setSidebarOpen(false);
          sidebar.classList.remove("slideOut");
          document.getElementById("sidebar").style.display = "none";
          document.getElementById("sidebar").setAttribute("display", "none");
        }, 300);
      } else {
        // an atrocious js animation:
        setSidebarOpen(true);
        document.getElementById("sidebar").style.display = "initial";
        document.getElementById("sidebar").setAttribute("display", "initial");

        sidebar.style.left = "-300px";
        setTimeout(() => {
          sidebar.style.left = "-285px";
        }, 12);
        setTimeout(() => {
          sidebar.style.left = "-275px";
        }, 25);
        setTimeout(() => {
          sidebar.style.left = "-260px";
        }, 37);
        setTimeout(() => {
          sidebar.style.left = "-250px";
        }, 50);
        setTimeout(() => {
          sidebar.style.left = "-235px";
        }, 62);
        setTimeout(() => {
          sidebar.style.left = "-225px";
        }, 75);
        setTimeout(() => {
          sidebar.style.left = "-210px";
        }, 90);
        setTimeout(() => {
          sidebar.style.left = "-200px";
        }, 100);
        setTimeout(() => {
          sidebar.style.left = "-185px";
        }, 112);
        setTimeout(() => {
          sidebar.style.left = "-175px";
        }, 125);
        setTimeout(() => {
          sidebar.style.left = "-160px";
        }, 137);
        setTimeout(() => {
          sidebar.style.left = "-150px";
        }, 150);
        setTimeout(() => {
          sidebar.style.left = "-130px";
        }, 162);
        setTimeout(() => {
          sidebar.style.left = "-125px";
        }, 175);
        setTimeout(() => {
          sidebar.style.left = "-115px";
        }, 185);
        setTimeout(() => {
          sidebar.style.left = "-100px";
        }, 200);
        setTimeout(() => {
          sidebar.style.left = "-90px";
        }, 212);
        setTimeout(() => {
          sidebar.style.left = "-75px";
        }, 225);
        setTimeout(() => {
          sidebar.style.left = "-60px";
        }, 237);
        setTimeout(() => {
          sidebar.style.left = "-50px";
        }, 250);
        setTimeout(() => {
          sidebar.style.left = "-35px";
        }, 265);
        setTimeout(() => {
          sidebar.style.left = "-25px";
        }, 275);
        setTimeout(() => {
          sidebar.style.left = "-10px";
        }, 290);
        setTimeout(() => {
          sidebar.style.left = "-00px";
        }, 300);
        // sidebar.classList.add("slideIn");
        // sidebar.classList.remove("slideIn");
        // void sidebar.offsetWidth;
      }
      // }
    }
  }

  ///
  ///    <Desktop Modal Popup Menus>
  ///
  ///
  ///
  ///
  ///

  const [showMenuHome, setShowMenuHome] = useState(false);
  const [showMenuShop, setShowMenuShop] = useState(false);
  const [showMenuAccount, setShowMenuAccount] = useState(false);

  const menuHomeRef = useRef();
  const menuShopRef = useRef();
  const menuAccountRef = useRef();

  // Hook
  function useOnClickOutside(ref, handler) {
    useEffect(
      () => {
        const listener = (event) => {
          // Do nothing if clicking ref's element or descendent elements
          if (!ref.current || ref.current.contains(event.target)) {
            return;
          }

          handler(event);
        };

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
          document.removeEventListener("mousedown", listener);
          document.removeEventListener("touchstart", listener);
        };
      },
      // Add ref and handler to effect dependencies
      // It's worth noting that because passed in handler is a new ...
      // ... function on every render that will cause this effect ...
      // ... callback/cleanup to run every render. It's not a big deal ...
      // ... but to optimize you can wrap handler in useCallback before ...
      // ... passing it into this hook.
      [ref, handler]
    );
  }

  useOnClickOutside(menuHomeRef, () => setShowMenuHome(false));
  useOnClickOutside(menuShopRef, () => setShowMenuShop(false));
  useOnClickOutside(menuAccountRef, () => setShowMenuAccount(false));

  useEffect(() => {
    if (showMenuAccount) {
      setShowMenuHome(false);
      setShowMenuShop(false);
    }
  }, [showMenuAccount]);

  useEffect(() => {
    if (showMenuHome) {
      setShowMenuAccount(false);
      setShowMenuShop(false);
    }
  }, [showMenuHome]);

  useEffect(() => {
    if (showMenuShop) {
      setShowMenuAccount(false);
      setShowMenuHome(false);
    }
  }, [showMenuShop]);

  function ShopMenu() {
    return (
      <div
        ref={menuShopRef}
        onMouseOver={() => {
          setShowMenuShop(true);
        }}
        className={`darkGraded modalMenu`}
        style={{
          position: "absolute",
          display: `${
            showMenuShop && !isPortrait && !isSmallScreen ? "flex" : "none"
          }`,
          zIndex: "99",
          justifyContent: "space-evenly",
          flexDirection: "column",
          left: "200px",
          top: "53px",
          height: "202px",
          // marginleft: "5px",
          width: "175px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            flexDirection: "column",
            height: "200px",
            bottom: "30px",
            position: "relative",
            right: "7px",
          }}
        >
          <div>
            <Link className="smallText" to="/shop">
              <button
                type="button"
                className="button primary small"
                onClick={() => setShowMenuShop(false)}
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  top: "5px",
                  bottom: "5px",
                }}
              >
                All
              </button>
            </Link>
          </div>
          <div>
            <Link className="smallText" to="/shop/full-sets">
              <button
                type="button"
                className="button primary small"
                onClick={() => setShowMenuShop(false)}
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  top: "5px",
                  bottom: "5px",
                }}
              >
                Sets
              </button>
            </Link>
          </div>
          <div>
            <Link className="smallText" to="/shop/tops">
              <button
                type="button"
                className="button primary small"
                onClick={() => setShowMenuShop(false)}
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  top: "5px",
                  bottom: "5px",
                }}
              >
                Tops
              </button>
            </Link>
          </div>
          <div>
            <Link className="smallText" to="/shop/skirts">
              <button
                type="button"
                className="button primary small"
                onClick={() => setShowMenuShop(false)}
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  top: "5px",
                  bottom: "5px",
                }}
              >
                Skirts
              </button>
            </Link>
          </div>
          <div>
            <Link className="smallText" to="/shop/belts">
              <button
                type="button"
                className="button primary small"
                onClick={() => setShowMenuShop(false)}
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  top: "5px",
                  bottom: "5px",
                }}
              >
                Belts
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function HomeMenu() {
    return (
      <div
        ref={menuHomeRef}
        onMouseOver={() => {
          setShowMenuHome(true);
        }}
        className={`show-for-large darkGraded modalMenu`}
        style={{
          position: "absolute",
          display: `${
            showMenuHome && !isPortrait && !isSmallScreen ? "flex" : "none"
          }`,
          justifyContent: "space-around",
          flexDirection: "column",
          top: "53px",
          width: "170px",
        }}
      >
        <div>
          <Link className="smallText" to="/">
            <button
              type="button"
              className="button primary small"
              onClick={() => setShowMenuHome(false)}
              style={{ left: "3em", float: "left", margin: "2px" }}
            >
              Home
            </button>
          </Link>
        </div>
        <div>
          <Link className="smallText" to="/privacy-policy">
            <button
              type="button"
              className="button primary small"
              onClick={() => setShowMenuHome(false)}
              style={{ left: "3em", float: "left", margin: "2px" }}
            >
              Privacy Policy
            </button>
          </Link>
        </div>
        <div>
          <Link className="smallText" to="/terms-of-service">
            <button
              type="button"
              className="button primary small"
              onClick={() => setShowMenuHome(false)}
              style={{ left: "3em", float: "left", margin: "2px" }}
            >
              Terms of Service
            </button>
          </Link>
        </div>
        <div>
          <Link className="smallText" to="/contact">
            <button
              type="button"
              className="button primary small"
              onClick={() => setShowMenuHome(false)}
              style={{ left: "3em", float: "left", margin: "2px" }}
            >
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    );
  }

  function AccountMenu() {
    return (
      <div
        ref={menuAccountRef}
        onMouseOver={() => {
          setShowMenuAccount(true);
        }}
        className={`show-for-large darkGraded modalMenu`}
        style={{
          position: "absolute",
          display: `${
            showMenuAccount && !isPortrait && !isSmallScreen ? "flex" : "none"
          }`,
          justifyContent: "space-evenly",
          flexDirection: "column",
          height: `${
            accountTitleString !== "Your Account" ? "150px" : "100px"
          }`,
          top: "38px",
          width: "170px",
        }}
      >
        {accountTitleString === "Your Account" ? (
          <div>
            <Link className="smallText" to="/account">
              <button
                style={{
                  padding: ".5em",
                  marginLeft: "0em",
                  marginRight: "0em",
                  marginBottom: "1em",
                  marginTop: "1em",
                }}
                type="button"
                className="button primary small"
                onClick={() => setShowMenuAccount(false)}
              >
                Sign In
              </button>
            </Link>
          </div>
        ) : (
          <div
            style={{
              // display: `${toggleString}`,
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "column",
              bottom: "20px",
              position: "relative",
            }}
          >
            <div
              style={{
                left: "1em",
                float: "left",
                margin: "2px",
              }}
            >
              <Link
                className="smallText"
                to="/account"
                onClick={() => {
                  setWishlistDisplayed(true);
                  setWishlistString("Hide Favorites");
                }}
                style={{
                  padding: ".5em",
                  marginLeft: "7px",
                  marginRight: "0em",
                  marginBottom: "12px",
                }}
              >
                <button
                  onClick={() => setShowMenuAccount(false)}
                  type="button"
                  className="button primary small"
                >
                  Favorites
                </button>
              </Link>
            </div>
            <div
              style={{
                left: "0em",
                float: "left",
                margin: "5px",
                marginLeft: "1px",
                marginBottom: "4px",
                position: "relative",
              }}
            >
              <Link className="smallText" to="/cart">
                <button
                  style={{
                    padding: ".5em",
                    marginLeft: "0em",
                    marginRight: "0em",
                  }}
                  type="button"
                  className="button primary small"
                  onClick={() => setShowMenuAccount(false)}
                >
                  Cart
                </button>
              </Link>
            </div>
            <div
              style={{
                left: "0em",
                float: "left",
                margin: "2px",
                position: "relative",
                // marginTop: "-2px",
                marginLeft: "1px",
              }}
            >
              <Link className="smallText" to="/my-orders">
                <button
                  style={{
                    padding: ".5em",
                    marginLeft: "0em",
                    marginRight: "0em",
                    marginBottom: "10px",
                  }}
                  type="button"
                  className="button primary small"
                  onClick={() => setShowMenuAccount(false)}
                >
                  Orders
                </button>
              </Link>
            </div>
            <div
              style={{
                left: "0m",
                float: "left",
                margin: "4px",
                marginLeft: "0px",
                position: "relative",
              }}
            >
              <Link
                className="smallText"
                to="/account"
                onClick={() => {
                  handleSignOut();
                  setShowMenuAccount(false);
                }}
              >
                <button
                  style={{
                    padding: ".5em",
                    marginLeft: "0em",
                    marginRight: "0em",
                  }}
                  type="button"
                  className="button primary small"
                >
                  Sign Out
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  ///
  ///
  ///
  ///
  ///
  ///
  ///    </Desktop Modal Popup Menus>

  return (
    <div
      className="App"
      id="App"
      style={{
        maxWidth: `${isLargeScreen ? "99.55%" : "100%"}`,
      }}
    >
      <progress
        id="progressBar"
        max="100"
        value="0"
        width="100%"
        style={{
          "z-index": "99",
          width: "100%",
          bottom: "5em",
          top: "0em",
          position: "sticky",
          "overflow-x": "visible",
          transition: "value .5s",
        }}
      ></progress>
      <TopBar
        style={{
          "background-color": "black",
          color: "white",
          "max-height": "4em",
          position: "sticky",
          "overflow-x": "visible",
          top: "0",
          "z-index": "98",
          float: "top",
        }}
      ></TopBar>
      <header
        style={{
          "max-height": "8em",
          bottom: "7em",
          "background-color": "black",
        }}
      >
        <div>
          <div id="headerHeight">
            <Header />
          </div>
        </div>
      </header>
      <div
        // data-toggle="example-menu"
        onMouseOut={() => setListShow("hidden")}
        data-sticky-container
        data-stick-to="top"
        style={{
          position: "sticky",
          "overflow-x": "visible",
          top: "1em",
          "z-index": "99",
        }}
      >
        <div
          // main sticky responsive bar
          style={{
            maxHeight: "3.5em",
            zIndex: "96",
            maxWidth: "100vw",
            boxShadow: "0px 1px 0px #42536e",
          }}
          id="example-menu"
          className="title-bar"
          data-responsive-toggle="example-menu"
          hideFor="medium"
        >
          <div
            style={{ whiteSpace: "nowrap", maxWidth: "100vw" }}
            className="title-bar-title show-for-large"
          >
            <Link to="/" onMouseOver={() => setShowMenuHome(true)}>
              <Flexbox flexDirection="row">
                <img
                  alt=""
                  width="30%"
                  height="10%"
                  src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/svg%2Fjiva%20rose.png?alt=media&token=d3a1a81a-6f5d-4c5b-8aa6-e0ae18e77639"
                  style={{
                    bottom: "10px",
                    marginRight: "10px",
                    marginBottom: "5px",
                    transform: "scale(0.55)",
                  }}
                ></img>
                <h1
                  style={{
                    position: "relative",
                    // "top": "2em",
                    marginTop: ".3em",
                    marginBottom: "22px",
                    marginRight: "-.7em",
                    marginLeft: "-.2em",
                    color: "white",
                    textDecoration: "none",
                    fontFamily: "Luminari",
                  }}
                >
                  Jiva
                </h1>
              </Flexbox>
            </Link>
            <HomeMenu />
          </div>
          <button
            onClick={() => handleSidebar()}
            style={{
              visibility: `${hamburgerDisplayString}`,
              "z-index": "99",
              "font-size": "larger",
              top: ".75em",
              width: "8vw",
              height: "10vw",
              position: "absolute",
              // paddingRight: "-50px",
              display: `${!isLargeScreen || !isBigScreen ? "initial" : "none"}`,
            }}
            data-toggle="example-menu"
            className="hide-for-large menu-icon"
            type="button"
          ></button>
          <Link
            style={{
              whiteSpace: "nowrap",
              margin: "0em",
              zIndex: "99",
              display: `${isPortrait || isSmallScreen ? "none" : "initial"}`,
            }}
            to="/"
          >
            <img
              alt=""
              width="100vw"
              height="auto"
              src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/logo%20rose%20finished.svg?alt=media&token=d4f6fc6b-cec1-4832-adcb-440dae63563b"
            ></img>
          </Link>

          <div
            className="hide-for-large"
            style={{
              float: "left",
              display: "inline-block",
              top: "5em",
            }}
          >
            <Flexbox flexDirection="row" style={{ maxWidth: "100%" }}>
              <form
                // this is the search box for mobile
                className="hide-for-large"
                autocomplete="off"
                style={{
                  float: "left",
                  visibility: `${listItemDisplay}`,
                  display: "inline-block",
                  "margin-left": "34vw",
                  "margin-top": "10em",
                  "margin-bottom": "1.3em",
                }}
              >
                <div
                  className="autocomplete"
                  style={{
                    float: "left",
                  }}
                >
                  {!searchString ? (
                    <Link to="/shop">
                      <input
                        style={{
                          left: "20em",
                          width: "40vw",
                          fontSize: "small",
                        }}
                        type="text"
                        id="menuSearch"
                        onKeyPress={() => {
                          handleSearchShop("menuSearch");
                        }}
                        onKeyUp={() => {
                          handleSearchShop("menuSearch");
                          autocomplete(
                            document.getElementById(`menuSearch`),
                            searchArray
                          );
                        }}
                        placeholder={`Search ${
                          searchString ? searchString : "Jiva"
                        }...`}
                      ></input>
                    </Link>
                  ) : (
                    <input
                      style={{
                        left: "20em",
                        width: "40vw",
                        fontSize: "small",
                      }}
                      type="text"
                      id="menuSearch"
                      onKeyPress={() => {
                        handleSearchShop("menuSearch");
                      }}
                      onKeyUp={() => {
                        handleSearchShop("menuSearch");
                        autocomplete(
                          document.getElementById(`menuSearch`),
                          searchArray
                        );
                      }}
                      placeholder={`Search ${
                        searchString ? searchString : "Jiva"
                      }...`}
                    ></input>
                  )}
                </div>
              </form>
              <div
                style={{
                  display: "inline-block",
                  float: "right",
                  top: "15em",
                  "margin-left": "5vw",
                  "margin-top": "6em",
                  marginBottom: "-1.7em",
                }}
              >
                <Link to="/cart" className="cartIcon">
                  <img
                    alt=""
                    src={`${urlString}`}
                    style={{ minWidth: "40px" }}
                    id="headerCartIcon4"
                    width={`${isLargeScreen ? "50px" : "40px"}`}
                    height="auto"
                  ></img>
                </Link>
              </div>
            </Flexbox>
          </div>
          <ul
            className="dropdown menu"
            hideFor="medium"
            style={{
              position: "static",
              "max-height": "3.5em",
            }}
            data-dropdown-menu
          >
            <li className="menu-text">{/* Jiva Fashions */}</li>

            <li
              style={{ right: "4em" }}
              onMouseOver={() => setShowMenuShop(true)}
            >
              <li style={{ display: "flex", flexDirection: "column" }}>
                <Link
                  style={{
                    float: "left",
                    height: "50px",
                    left: `200px`,
                    bottom: "7px",
                    "overflow-x": "hidden",
                    visibility: `${listItemDisplay}`,
                    "font-size": "xx-large",
                    position: "absolute",
                    padding: "10px",
                    paddingBottom: "15px",
                  }}
                  to="/shop"
                  className="show-for-large"
                  id="shopId"
                >
                  | Shop
                </Link>
                <ShopMenu />
              </li>
            </li>
            <li
              style={{
                display: "flex",
                float: "right",
                position: "relative",
                whiteSpace: "nowrap",
                bottom: ".6em",
              }}
            >
              <span
                style={{
                  display: "flex",
                  float: "right",
                  position: "relative",
                  marginLeft: "60vw",
                  whiteSpace: "nowrap",
                  maxHeight: "2em",
                }}
              >
                <span style={{}}>
                  <form
                    className="show-for-large"
                    autocomplete="off"
                    style={{
                      position: "relative",
                      bottom: "-3.5em",
                      right: "1.8em",
                      float: "left",
                      visibility: `${listItemDisplay}`,
                    }}
                  >
                    <div
                      className="autocomplete"
                      style={{
                        right: "15%",
                        bottom: "-15em",
                        float: "left",
                      }}
                    >
                      {!searchString ? (
                        <Link to="/shop">
                          <input
                            style={{
                              right: "4em",
                              float: "left",
                              width: "130%",
                            }}
                            type="text"
                            id="menuSearch2"
                            onKeyPress={() => {
                              handleSearchShop("menuSearch2");
                            }}
                            onKeyUp={() => {
                              handleSearchShop("menuSearch2");
                              autocomplete(
                                document.getElementById(`menuSearch2`),
                                searchArray
                              );
                            }}
                            placeholder={`Search in ${
                              searchString ? searchString : "Shop"
                            }...`}
                          ></input>
                        </Link>
                      ) : (
                        <input
                          style={{
                            right: "15%",
                            float: "left",
                            width: "110%",
                          }}
                          type="text"
                          id="menuSearch2"
                          onKeyPress={() => {
                            handleSearchShop("menuSearch2");
                          }}
                          onKeyUp={() => {
                            handleSearchShop("menuSearch2");
                            autocomplete(
                              document.getElementById(`menuSearch2`),
                              searchArray
                            );
                          }}
                          placeholder={`Search in ${searchString}...`}
                        ></input>
                      )}
                    </div>
                  </form>
                </span>
                <span
                  onMouseOver={() => setShowMenuAccount(true)}
                  className="show-for-large"
                  style={{
                    visibility: `${listItemDisplay}`,
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    bottom: "8px",
                  }}
                >
                  <Link to="/account" className="li row">
                    {accountTitleString}
                  </Link>
                  <AccountMenu />
                </span>
                <Link
                  to="/cart"
                  className="cartIcon show-for-large"
                  style={{
                    display: "inline",
                    "white-space": "nowrap",
                    bottom: "19px",
                    position: "relative",
                  }}
                >
                  <img
                    alt="go to cart"
                    src={`${urlString}`}
                    id="headerCartIcon3"
                    width="50px"
                    height="50px"
                  ></img>
                </Link>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div
        id="sidebar"
        className="sidebar"
        style={{
          background: "black",
          opacity: "0.89",
          position: "fixed",
          zIndex: "99",
          top: "0em",
          left: "0em",
          width: "65%",
          marginTop: "1em",
          height: "250vh",
          display: `${sidebarOpen ? "initial" : "none"}`,
        }}
      >
        <div
        // className="table-scroll"
        // id="sidebar"
        >
          <table>
            <Flexbox
              flexDirection="row"
              style={{
                position: "fixed",
                top: "1.3em",
              }}
            >
              <Flexbox
                flexDirection="column"
                // onLoad={() => {
                //   setSidebarOpen(false);
                // }}
                style={{
                  top: "0.4em",
                  position: "relative",
                  left: "2em",
                  textAlign: "left",
                }}
              >
                <Link
                  className="largeText smushed"
                  to="/"
                  onClick={() => handleSidebar()}
                >
                  <button type="button" className="button success hollow small">
                    Home
                  </button>
                </Link>
                <Link className="largeText smushed" to="/contact">
                  <button
                    type="button"
                    className="button primary hollow small"
                    onClick={() => {
                      handleSidebar();
                    }}
                  >
                    Contact Us
                  </button>
                </Link>
                <br></br>
                <Link
                  className="largeText smushed"
                  to="/shop"
                  onClick={() => {
                    handleSidebar();
                  }}
                >
                  <button type="button" className="button success hollow small">
                    Shop All
                  </button>
                </Link>
                <Link
                  className="largeText smushed"
                  to="/shop/full-sets"
                  onClick={() => {
                    handleSidebar();
                  }}
                >
                  <button
                    type="button"
                    className="button primary hollow small"
                    onClick={() => {
                      handleSidebar();
                    }}
                  >
                    Sets
                  </button>
                </Link>
                <Link
                  className="largeText smushed"
                  to="/shop/tops"
                  onClick={() => {
                    handleSidebar();
                  }}
                >
                  <button type="button" className="button primary hollow small">
                    Tops
                  </button>
                </Link>
                <Link
                  className="largeText smushed"
                  to="/shop/skirts"
                  onClick={() => {
                    handleSidebar();
                  }}
                >
                  <button type="button" className="button primary hollow small">
                    Skirts
                  </button>
                </Link>
                <Link
                  className="largeText smushed"
                  to="/shop/belts"
                  onClick={() => {
                    handleSidebar();
                  }}
                >
                  <button
                    type="button"
                    className="button primary hollow small"
                    onClick={() => {
                      handleSidebar();
                    }}
                  >
                    Belts
                  </button>
                </Link>
                <br></br>
                {accountTitleString === "Your Account" ? (
                  <Link
                    className="largeText smushed"
                    to="/account"
                    onClick={() => {
                      handleSidebar();
                    }}
                  >
                    <button
                      type="button"
                      className="button success hollow small"
                    >
                      Sign In
                    </button>
                  </Link>
                ) : (
                  <Flexbox flexDirection="column">
                    <Link
                      className="largeText smushed"
                      to="/account"
                      onClick={() => {
                        handleSidebar();
                      }}
                    >
                      <button
                        type="button"
                        className="button success hollow small"
                      >
                        {accountTitleString}
                      </button>
                    </Link>
                    <Link
                      className="largeText smushed"
                      to="/favorites"
                      onClick={() => {
                        handleSidebar();
                      }}
                    >
                      <button
                        type="button"
                        className="button primary hollow small"
                      >
                        Favorites
                      </button>
                    </Link>

                    <Link
                      className="largeText smushed"
                      to="/cart"
                      onClick={() => {
                        handleSidebar();
                      }}
                    >
                      <button
                        type="button"
                        className="button primary hollow small"
                      >
                        Cart
                      </button>
                    </Link>
                    <Link
                      className="largeText smushed"
                      to="/my-orders"
                      onClick={() => {
                        handleSidebar();
                      }}
                    >
                      <button
                        type="button"
                        className="button primary hollow small"
                      >
                        Orders
                      </button>
                    </Link>
                    <Link
                      className="largeText smushed"
                      to="/account"
                      onClick={() => {
                        handleSignOut();
                        handleSidebar();
                      }}
                    >
                      <button
                        type="button"
                        className="button primary hollow small"
                      >
                        Sign Out
                      </button>
                    </Link>
                  </Flexbox>
                )}
              </Flexbox>
              <button
                style={{
                  position: "relative",
                  top: "24vh",
                  left: "26vw",
                }}
                onClick={() => {
                  handleSidebar();
                }}
                type="button"
              >
                <img
                  alt=""
                  width="32em"
                  height="auto"
                  src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/left%20arrow%20white.svg?alt=media&token=9f166f00-6ab3-4c6f-b889-64178ab8472a"
                />
              </button>
            </Flexbox>
          </table>
        </div>
      </div>

      <div
        className="functionalModal"
        id="functionalModal"
        style={{
          // top: `${isLargeScreen ? "40vw" : "80vw"}`,

          left: `${isPortrait || isSmallScreen ? "10vw" : "60vw"}`,
          bottom: `${isPortrait || isSmallScreen ? "5px" : "auto"}`,
          // marginRight: `${isPortrait || isSmallScreen ? "20px" : ""}`,
          fontSize: `${isLargeScreen ? "initial" : "small"}`,
          display: "none",
          "box-shadow": "0px 0px 5px white",
        }}
      >
        <p
          style={{
            left: `${isLargeScreen ? "initial" : "-5vw"}`,
          }}
        >
          {modalText}
        </p>
        <button
          type="button"
          className="functionalModalButton button primary small"
          id="functionalModalButton"
          style={{ width: "5em", marginRight: "1em" }}
          onClick={() => {
            turnOffModal();
          }}
        >
          OK
        </button>
        <button
          type="button"
          className="functionalModalButton button primary small"
          id="functionalModalButton"
          style={{ width: "5em" }}
          onClick={() => {
            modalExecute();
            turnOffModal();
          }}
        >
          Undo
        </button>
      </div>
      <div
        className="itemOptionsModal"
        id="itemOptionsModal"
        style={{
          // top: `${isLargeScreen ? "16.5vw" : "75vw"}`,
          // left: `${isLargeScreen ? "30vw" : "5vw"}`,
          right: `${isSmallScreen || isPortrait ? "80vw" : "60vw"}`,
          fontSize: `${isLargeScreen ? "initial" : "small"}`,
          display: "none",
          "box-shadow": "0px 0px 5px white",
        }}
      >
        <p
          style={{
            left: `${isLargeScreen ? "initial" : "-5vw"}`,
          }}
        >
          {optionsModalText}
        </p>
        <button
          type="button"
          className="itemOptionsModalButton button primary small"
          id="itemOptionsModalButton"
          onClick={() => closeOptionsModal()}
        >
          OK
        </button>
      </div>
      <div
        className="itemOptionsModal"
        id="expressModal"
        style={{
          top: `${isLargeScreen ? "16.5vw" : "50vw"}`,
          left: `${isLargeScreen ? "30vw" : "5vw"}`,
          fontSize: `${isLargeScreen ? "initial" : "small"}`,
          display: "none",
          "box-shadow": "0px 0px 5px white",
        }}
      >
        <p
          style={{
            left: `${isLargeScreen ? "initial" : "-5vw"}`,
          }}
        >
          Sign in to use Express Checkout
        </p>
        <Link to="/account">
          <button
            type="button"
            className="itemOptionsModalButton button primary small"
            id="expressModalYes"
            onClick={() => closeExpressModal()}
          >
            Sign In
          </button>
        </Link>
        <button
          type="button"
          className="itemOptionsModalButton button primary small"
          id="expressModalNo"
          onClick={() => closeExpressModal()}
        >
          No Thanks
        </button>
      </div>
      <div
        className="itemOptionsModal"
        id="checkoutModal"
        style={{
          display: "none",
          "box-shadow": "0px 0px 5px white",
        }}
      >
        <h3>Leave checkout and return to {navString}?</h3>
        <Link to={`/${navString}`}>
          <button
            type="button"
            className="itemOptionsModalButton button primary small"
            id="checkoutModalButtonYes"
            onClick={() => {
              setLeaveCheckoutModal(false);
            }}
          >
            Yes
          </button>
        </Link>

        <button
          type="button"
          className="itemOptionsModalButton button primary small"
          id="checkoutModalButtonNo"
          onClick={() => {
            setLeaveCheckoutModal(false);
          }}
        >
          No
        </button>
      </div>
      <div
        className="backgroundElement"
        style={{ display: `${onHomeScreen ? "" : "none"}` }}
      ></div>
      <div
        className="baseElement"
        style={{ backgroundImage: `${onHomeScreen ? "" : ""}` }}
      >
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/blog">
            <Blog />
          </Route>
          <Route path="/checkout">
            <ShippingComponent />
          </Route>
          <Route path="/express-checkout">
            <Elements stripe={stripePromise}>
              <ExpressCheckout />
            </Elements>
          </Route>
          <Route exact path="/shop">
            <Shop />
          </Route>
          <Route path="/shop/full-sets">
            <FullSets />
          </Route>
          <Route path="/shop/tops">
            <Tops />
          </Route>
          <Route path="/shop/skirts">
            <Skirts />
          </Route>
          <Route path="/shop/belts">
            <Belts />
          </Route>
          {allProducts.map((product) => {
            let productPageLinkString = product[0].split(" ").join("-");
            return (
              <Route path={`/product/${productPageLinkString}`}>
                <ProductPage item={product} />
              </Route>
            );
          })}
          <Route path="/about">
            <About />
          </Route>
          <Route path="/cart">
            <Cart />
          </Route>
          <Route path="cart-sign-in">
            <CartSignIn />
          </Route>
          <Route path="/account">
            <Account />
          </Route>
          <Route path="/contact">
            <Contact />
          </Route>
          <Route path="/sign-in-successful">
            <SignInSuccessful />
          </Route>
          <Route path="/privacy-policy">
            <PrivacyPolicy />
          </Route>
          <Route path="/terms-of-service">
            <TermsOfService />
          </Route>
          <Route path="/sign-in-success-email">
            <SignInSuccessEmail />
          </Route>
          <Route path="/sign-in-with-email">
            <SignInWithEmail />
          </Route>
          <Route path="/order-success">
            <OrderSuccess />
          </Route>
          <Route path="/my-orders">
            <MyOrders />
          </Route>
          <Route path="/favorites">
            <Favorites />
          </Route>
          <Route path="/return-policy">
            <ReturnPolicy />
          </Route>
        </Switch>

        <div
          id="firebaseui-auth-container"
          style={{
            zIndex: "86",
            marginTop: "-.5em",
            position: "relative",
            bottom: "1.2em",
          }}
        ></div>
        <div>
          {termsDisplay && (
            <div>
              <PrivacyAndTermsAgreement />
              {wishlistTempCache.length > 0 && (
                <h4
                  style={{
                    position: "relative",
                    // "background-color": "#565759",
                    backgroundImage:
                      "linear-gradient(to bottom right, #241d2b, black)",
                    padding: ".25em",
                    "border-radius": "13px",
                    width: `${isLargeScreen ? "30%" : "90%"}`,
                    left: `${isLargeScreen ? "35vw" : "5vw"}`,
                  }}
                  classsName="grayblock centered"
                >
                  Sign in to see your Favorites
                </h4>
              )}
              <RecentlyViewed />
            </div>
          )}
        </div>
      </div>
      <br></br>
      <nav className="footer">
        <h2
          style={{
            position: "relative",
            top: ".5em",
            left: ".25em",
          }}
          className="footItem"
        >
          <Link to="/privacy-policy" className="li">
            Privacy Policy
          </Link>
        </h2>
        <h2 className="footItem">
          <Link to="/terms-of-service" className="li">
            Terms of Service
          </Link>
        </h2>
        <h2 className="footItem">
          <Link to="/contact" className="li">
            Contact Us
          </Link>
        </h2>
        <a href="https://www.facebook.com/jivaoriginals">
          <img
            alt=""
            src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/fb2.svg?alt=media&token=0cc8b80d-8da9-43d4-9767-0248c8669473"
            width="30em"
            height="auto"
          ></img>
        </a>
      </nav>
    </div>
  );
}

export default App;
