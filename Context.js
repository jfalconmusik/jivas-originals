import React, { useState, useEffect } from "react";
import Images from "./images";
import firebase from "firebase";
import { jQuery } from "jquery";
import { loadStripe } from "@stripe/stripe-js";
import windowSize from "react-window-size";
import { useMediaQuery } from "react-responsive";

const Context = React.createContext({ cartCount: 0, contextTotalPrice: 0 });

function ContextProvider({ children }) {
  // router state, for use with ui (deprecated):
  const [routerString, setRouterString] = useState("");

  // for productPage component:
  const [productPageComponent, setProductPageComponent] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);

  // image url storage
  const storage = firebase.storage();
  const storageRef = storage.ref();

  ///// User Context:

  const [userInfo, setUserInfo] = useState({});
  const [signInDisplayed, setSignInDisplayed] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);
  const [prevAddressBilling, setPrevAddressBilling] = useState([]);
  const [prevAddressShipping, setPrevAddressShipping] = useState([]);

  const [addressShipResultData, setAddressShipResultData] = useState([]);
  const [addressBillResultData, setAddressBillResultData] = useState([]);

  const [tempShipAddress, setTempShipAddress] = useState([]);
  const [tempBillAddress, setTempBillAddress] = useState([]);

  const [itemsMerged, setItemsMerged] = useState(false);

  // Wishlist variables:
  const [wishlistItems, setWishlistItems] = useState([]);
  const [normalWishlistCount, setNormalWishlistCount] = useState([]);
  // const [wishlistCount, setWishlistCount] = useState([])
  const [contextWishlistCount, setContextWishlistCount] = useState(0);

  const [allowNotify, setAllowNotify] = useState(true);
  const [notifyUpdated, setNotifyUpdated] = useState(false);

  const [categorySearch, setCategorySearch] = useState("");

  const [addressHandled, setAddressHandled] = useState(true);

  const [searchString, setSearchString] = useState("");

  function getUserAddress() {
    setAddressHandled(false);
    let address = firebase
      .functions()
      .httpsCallable("getUserAddress")()
      .then((result) => {
        const newShippingArr = [];
        const newBillingArr = [];

        console.log(result.data);

        let addressValues =
          result.data._fieldsProto.address_shipping.arrayValue.values;

        if (addressValues.includes(undefined)) {
          setTimeout(() => {
            let address = firebase
              .functions()
              .httpsCallable("getUserAddress")()
              .then((result) => {
                result.data._fieldsProto.address_shipping.arrayValue.values.forEach(
                  (obj) => {
                    if (obj.stringValue) {
                      newShippingArr.push(obj.stringValue);
                      console.log(
                        `obj: ${obj} obj.data: ${obj.data} stringValue: ${obj.stringValue}`
                      );
                      console.log(newShippingArr);
                    } else if (obj.booleanValue) {
                      newShippingArr.push(obj.booleanValue);
                      console.log(
                        `obj: ${obj} obj.data: ${obj.data} stringValue: ${obj.booleanValue}`
                      );
                      console.log(newShippingArr);
                    }
                  }
                );
                result.data._fieldsProto.address_billing.arrayValue.values.forEach(
                  (obj) => {
                    if (obj.stringValue) {
                      newBillingArr.push(obj.stringValue);
                      console.log(
                        `obj: ${obj} obj.data: ${obj.data} stringValue: ${obj.stringValue}`
                      );
                      console.log(newBillingArr);
                    } else if (obj.booleanValue) {
                      newBillingArr.push(obj.booleanValue);
                      console.log(
                        `obj: ${obj} obj.data: ${obj.data} stringValue: ${obj.booleanValue}`
                      );
                      console.log(newBillingArr);
                    }
                  }
                );
              });
            return address;
          }, 10000);
        } else {
          result.data._fieldsProto.address_shipping.arrayValue.values.forEach(
            (obj) => {
              if (obj.stringValue) {
                newShippingArr.push(obj.stringValue);
                console.log(
                  `obj: ${obj} obj.data: ${obj.data} stringValue: ${obj.stringValue}`
                );
                console.log(newShippingArr);
              } else if (obj.booleanValue) {
                newShippingArr.push(obj.booleanValue);
                console.log(
                  `obj: ${obj} obj.data: ${obj.data} stringValue: ${obj.booleanValue}`
                );
                console.log(newShippingArr);
              }
            }
          );
          result.data._fieldsProto.address_billing.arrayValue.values.forEach(
            (obj) => {
              if (obj.stringValue) {
                newBillingArr.push(obj.stringValue);
                console.log(
                  `obj: ${obj} obj.data: ${obj.data} stringValue: ${obj.stringValue}`
                );
                console.log(newBillingArr);
              } else if (obj.booleanValue) {
                newBillingArr.push(obj.booleanValue);
                console.log(
                  `obj: ${obj} obj.data: ${obj.data} stringValue: ${obj.booleanValue}`
                );
                console.log(newBillingArr);
              }
            }
          );
        }

        let allowNotifications = result.data._fieldsProto.allowNotify;
        console.log(allowNotifications);
        console.log(allowNotifications.booleanValue);

        let notifyBool = allowNotifications.booleanValue;

        setAllowNotify(notifyBool);

        // let addressValues = result.data._fieldsProto.address_shipping.arrayValue.values

        setPrevAddressShipping(newShippingArr);
        setPrevAddressBilling(newBillingArr);
        console.log(newShippingArr);
        console.log(newBillingArr);
        setAddressHandled(true);
        return result.data;
      });
    return address;
  }

  function getUserCart() {
    // setContextCount(0);
    setContextPrice(0);
    setNormalCost(0);
    setNormalCount(0);
    setCartLoaded(true);

    firebase
      .functions()
      .httpsCallable("viewCart")()
      .then((result) => {
        console.log(result);
        if (result.data._fieldsProto !== null) {
          const items = result.data._fieldsProto.items.arrayValue.values;

          // get product data for each item in cart
          const itemStringMap = items.map((item) => item.stringValue);
          console.log(itemStringMap);

          itemStringMap.forEach((item) => {
            const newItem = item.split("%%");
            const itemCost = Number(newItem[2]);
            cartCost.push(itemCost);
            count.push(1);

            itemArray.push(newItem);
            console.log(newItem);
            console.log(itemArray);
            console.log(itemList);
          });
          console.log(itemArray);

          setItemList(itemArray);

          console.log(itemList);

          console.log(
            `UserInfo updated, so cart is updated. cartCost: ${cartCost}, itemList: ${itemList}, itemArray: ${itemArray}, addedCost: ${addedCost}`
          );

          const addedCost = cartCost.reduce((a, b) => a + b, 0);
          setTotalCost(addedCost);
          setNormalCost(addedCost);
          setPriceAfterStoreCredit(addedCost);
          console.log("totalCost " + totalCost);

          const addedCount = count.reduce((a, b) => a + b, 0);
          setItemCount(addedCount);
          setNormalCount(addedCount);
          console.log(count);
          console.log(itemCount);

          setCostTallyFinished(true);
        }
      });
  }

  ////////////////////////////////////////////////

  useEffect(() => {
    console.log(prevAddressBilling);

    if (prevAddressBilling !== undefined) {
      setUserInfo({
        providerId: userInfo.providerId,
        uid: userInfo.uid,
        displayName: userInfo.displayName,
        userEmail: userInfo.userEmail,
        photourl: userInfo.photoURL,
        anonUser: userInfo.anonUser,
        prevAddressShipping,
        prevAddressBilling,
        payMethod,
      });
    }
    if (prevAddressBilling[1] && prevAddressShipping[1]) {
      setAddressSaved(true);
    }
  }, [prevAddressBilling]);

  useEffect(() => {
    console.log(prevAddressShipping);

    if (prevAddressShipping !== undefined) {
      setUserInfo({
        providerId: userInfo.providerId,
        uid: userInfo.uid,
        displayName: userInfo.displayName,
        userEmail: userInfo.userEmail,
        photourl: userInfo.photoURL,
        anonUser: userInfo.anonUser,
        prevAddressShipping,
        prevAddressBilling,
        payMethod,
      });
    }
    if (prevAddressBilling[1] && prevAddressShipping[1]) {
      setAddressSaved(true);
    }
  }, [prevAddressShipping]);

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  //// Account:
  const [providerId, setProviderId] = useState("");
  const [uid, setUid] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [anonUser, setAnonUser] = useState(true);
  const [userSignedInCount, setUserSignedInCount] = useState(0);

  const [signInUiLoaded, setSignInUiLoaded] = useState(false);
  const [termsDisplay, setTermsDisplay] = useState(false);

  const [receiptEmail, setReceiptEmail] = useState("");

  const [accountName, setAccountName] = useState("");
  const [twitterUser, setTwitterUser] = useState(false);

  const [staySignedIn, setStaySignedIn] = useState(true);

  useEffect(() => {
    ///
    firebase.auth().onAuthStateChanged(function (user) {
      setAnonUser(true);
      if (user && !user.isAnonymous) {
        // User is signed in.
        console.log(user);
        let provider;
        let id;
        let name;
        let mail;
        let photo;
        user.providerData.forEach(function (profile) {
          setProviderId(profile.providerId);
          provider = profile.providerId;
          setUid(profile.uid);
          id = profile.uid;
          setDisplayName(profile.displayName);
          name = profile.displayName;
          setUserEmail(profile.email);
          mail = profile.email;
          setPhotoURL(profile.photoURL);
          photo = profile.photURL;

          if (profile.displayName !== null) {
            setAccountName(profile.displayName);
          }

          if (profile.providerId === "twitter.com") {
            setTwitterUser(true);
          }
          // setReceiptEmail(profile.receipt_email)
          // receipt email is technically not a part of firebase profile, but in docs
        });
        console.log("user.isAnonymous: " + user.isAnonymous);

        setAnonUser(false);
        setUserInfo({
          providerId: provider,
          uid: id,
          displayName: name,
          userEmail: mail,
          photoURL: photo,
          anonUser,
          // receiptEmail
        });
        getUserAddress();
      } else if (user.isAnonymous) {
        console.log("user.isAnonymous: " + user.isAnonymous);
        console.log(user);
        setAnonUser(true);
        setItemList([]);
        setUserInfo(user);
        setTotalCost(0);
        setItemCount(0);
        setItemsMerged(false);
        setAccountName("");
      } else if (!user) {
        firebase
          .auth()
          .signInAnonymously()
          .then((anon) => {
            console.log(user + " " + anon);
            console.log(anon.data);
            setAnonUser(true); // so that the prompt will definitely load
            setItemList([]);
            setUserInfo(anon);
            setTotalCost(0);
            setItemCount(0);
            setItemsMerged(false);
            setAccountName("");
          });
        // No user is signed in
        console.log("No user was signed in. Now anon guest session.");
      } else {
        firebase
          .auth()
          .signInAnonymously()
          .then((anon) => {
            console.log(user + " " + anon);
            console.log(anon.data);
            setAnonUser(true); // so that the prompt will definitely load
            setItemList([]);
            setUserInfo(anon);
            setTotalCost(0);
            setItemCount(0);
            setItemsMerged(false);
            setAccountName("");
          });
        // No user is signed in
        console.log("user could not be accessed. Anon guest session started.");
      }
      getUserCart();
      userTertiaryInfo();
      console.log(`user: ${user}, ${JSON.stringify(user)}`);
    });
    console.log(
      `userInfo: ${userInfo} userInfo.data: ${JSON.stringify(userInfo)}`
    );

    let user = firebase.auth().currentUser;

    if (user) {
      console.log(user.displayName);
      console.log(user.email);
      console.log(user.photoURL);
      console.log(user.emailVerified);
      console.log(user.uid);
      console.log(user.providerId);
      console.log(user);
      // User is signed in.

      if (user.providerId.includes("twitter") && !user.email) {
        console.log("make user provide email to verify. Save email to user.");
      }
    } else {
      console.log("no user");
      // No user is signed in.
    }

    if (!userInfo.uid) {
      firebase
        .auth()
        .signInAnonymously()
        .then((anon) => {
          console.log(user + " " + anon);
          console.log(anon.data);
          setAnonUser(true); // so that the prompt will definitely load
          setUserInfo(anon);
          setItemList([]);
          setTotalCost(0);
          setItemCount(0);
          setItemsMerged(false);
          setAccountName("");
        });
    }
  }, [userSignedInCount]);

  useEffect(() => {
    if (!anonUser) {
      setUserInfo({
        providerId,
        uid,
        displayName,
        userEmail,
        photoURL,
        anonUser,
        prevAddressShipping,
        prevAddressBilling,
        payMethod,
      });
    }
    // console.log(`userInfo: ${userInfo} userInfo.data: ${JSON.stringify(userInfo)}`)
  }, [anonUser]);

  useEffect(() => {
    console.log(
      `userInfo: ${userInfo} userInfo.data: ${JSON.stringify(userInfo)}`
    );
  }, []);

  //// Cart Context:

  const [contextPrice, setContextPrice] = useState(0);
  const [contextCount, setContextCount] = useState(0);
  const [cartInfo, setCartInfo] = useState({});
  const [costTallyFinished, setCostTallyFinished] = useState(false);

  // From Cart Item List:
  const [itemList, setItemList] = useState([]);
  const [itemsPurchased, setItemsPurchased] = useState("");

  // set up anonCart temp list for merging:
  const [anonCart, setAnonCart] = useState([]);

  useEffect(() => {
    // initialize app with an empty cart;
    setItemList([]);
    setAnonCart([]);
  }, []);

  const itemArray = [];
  const wishlistArray = [];

  const cartCost = [];
  const [totalCount, setTotalCount] = useState(0);
  const [itemCost, setItemCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [costTaxShipping, setCostTaxShipping] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [normalCost, setNormalCost] = useState(0);
  const [normalCount, setNormalCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
  const count = [];
  const wishlistCount = [];
  const [itemNumberString, setItemNumberString] = useState("");
  const [cartLoaded, setCartLoaded] = useState(false);
  const [wishlistLoaded, setWishlistLoaded] = useState(false);

  // changes made to cart are saved to context, cost and count are changed at that time.
  useEffect(() => {
    if (cartLoaded) {
      console.log(
        `totalCost is now: ${
          normalCost + contextPrice
        }, normalCost: ${normalCost}, contextPrice: ${contextPrice}`
      );
      setTotalCost(normalCost + contextPrice);
      setItemCount(normalCount + contextCount);
    }
  }, [contextCount, normalCount]);

  useEffect(() => {
    if (wishlistLoaded) {
      setWishlistItemCount(normalWishlistCount + contextWishlistCount);
    }
  }, [contextWishlistCount]);

  useEffect(() => {
    if (totalCost < 0) {
      console.log("total cost set to 0 as totalCost is currently ", totalCost);
      setTotalCost(0);
      setContextPrice(0);
    }
    console.log(`totalCost: ${totalCost}`);
  }, [totalCost]);

  useEffect(() => {
    if (itemCount < 0) {
      setItemCount(0);
      setContextCount(0);
    }
  }, [itemCount]);

  useEffect(() => {
    if (anonCart.length > 0 && !itemsMerged) {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user && !user.isAnonymous) {
          setAnonUser(false);
          anonCart.map((item) => {
            let cartItem = [
              item[0],
              [],
              Number(item[2]) / 100,
              [],
              [],
              item[1],
            ];
            let colorArr = item[4].split("_");

            let options = [item[3], colorArr[0], colorArr[1], 1];
            // name - url - price - size - color

            modifyTotalPrice(Number(item[2]) * 1);

            console.log(item);
            modifyCartCount(1);
            return addToCart(cartItem, options);
          });
          setItemList([...itemList, ...anonCart]);

          if (anonCart.length > 0) {
            activateMergeCartModal(anonCart);
          }
          setAnonCart([]);
          setItemsMerged(true);
        }
      });
    }
    // if (anonUser && !itemsMerged) {

    // let newArray = []

    // const newCart = itemList.filter(item => !(
    //     (item[0] == cartItem[0]) &&
    //     (item[1] == cartItem[1]) &&
    //     (item[2] == cartItem[2]) &&
    //     (item[3] == cartItem[3]) &&
    //     (item[4] == cartItem[4])
    // )
    // )

    // setAnonCart([...anonCart, ...itemList])
    //     setAnonCart(itemList)
    //     console.log(anonCart)
    // }
    // itemList
  }, [userInfo]);

  // get the list of all products

  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    return firebase
      .functions()
      .httpsCallable("getAllProducts")()
      .then((result) => {
        const newArr = [];

        result.data.forEach((item) => {
          // console.log(`name: ${item.productName} url: ${item.imageURL} price: ${item.Price}`)
          newArr.push([
            item.productName,
            item.imageURL,
            item.Price,
            item.descriptBrief,
            item.descriptLong,
            item.imageTrueUrl,
            item.colors,
            item.sizes,
            item.categories,
            item.boughtWith,
            item.Stock,
            item.Bestseller,
            item.Sale,
            item.moreImages,
          ]);
        });
        // console.log(`result: ${result} result.data: ${result.data}`)
        console.log(newArr);
        setAllProducts(newArr);
        setProductsLoaded(true);
      });
  }, []);

  const [beltCategory, setBeltCategory] = useState([]);
  const [topCategory, setTopCategory] = useState([]);
  const [skirtCategory, setSkirtCategory] = useState([]);
  const [fullSetCategory, setFullSetCategory] = useState([]);

  useEffect(() => {
    if (productsLoaded) {
      let beltsArray = [];
      let fullSetsArr = [];
      let topsArray = [];
      let skirtsArray = [];

      allProducts.forEach((item) => {
        console.log(item);
        console.log(item[8]);
        if (item[8].includes("Belt")) {
          beltsArray.push(item);
        }
        if (item[8].includes("Full Set")) {
          fullSetsArr.push(item);
        }
        if (item[8].includes("Top")) {
          topsArray.push(item);
        }
        if (item[8].includes("Skirt")) {
          skirtsArray.push(item);
        }
      });

      console.log(beltsArray);
      console.log(topsArray);
      console.log(skirtsArray);
      console.log(fullSetsArr);

      setBeltCategory([...beltsArray]);
      setTopCategory([...topsArray]);
      setSkirtCategory([...skirtsArray]);
      setFullSetCategory([...fullSetsArr]);
    }
  }, [productsLoaded]);

  const [itemCategory, setItemCategory] = useState("");

  // get the items in cart and tally cost, count
  // useEffect(() => {

  // }, [userInfo]);

  useEffect(() => {
    setContextWishlistCount(0);
    setNormalWishlistCount(0);

    firebase
      .functions()
      .httpsCallable("viewWishlist")()
      .then((result) => {
        console.log(result);
        if (result.data._fieldsProto !== null) {
          const items = result.data._fieldsProto.items.arrayValue.values;

          // get product data for each item in cart
          const itemStringMap = items.map((item) => item.stringValue);
          console.log(itemStringMap);

          itemStringMap.forEach((item) => {
            const newItem = item.split("%%");
            wishlistCount.push(1);

            wishlistArray.push(newItem);
            console.log(newItem);
            console.log(wishlistArray);
          });
          console.log(wishlistArray);
          setWishlistItems(wishlistArray);

          let wishlistLengthArray = [];
          if (wishlistTempCache.length > 0) {
            let newWishlistArray = [];

            wishlistTempCache.map((item) => {
              if (!itemStringMap.includes(item)) {
                let newerItem = item.split("%%");
                newWishlistArray.push(newerItem);
                firebase.functions().httpsCallable("addToWishlist")({ item });
                modifyWishlistCount(1);
                wishlistLengthArray.push(1);
              }
            });

            let finalArray = [...wishlistArray, ...newWishlistArray];
            setWishlistItems(finalArray);

            setWishlistTempCache([]);

            console.log("items merged to wishlist.");
          }

          const addedCount = wishlistCount.reduce((a, b) => a + b, 0);
          const secondAddedCount = wishlistLengthArray.reduce(
            (a, b) => a + b,
            0
          );

          setWishlistItemCount(addedCount + secondAddedCount);
          setNormalWishlistCount(addedCount);
          console.log(count);
          console.log(itemCount);
          setWishlistLoaded(true);
        }
      });
  }, [userInfo]);

  useEffect(() => {
    console.log(itemList);
  }, [itemList]);

  useEffect(() => {
    console.log(totalCost);
  }, [totalCost, setCostTallyFinished]);
  // when remove from cart is clicked, subtract 1 from count and price from price

  // use proper english plurals for itemCount
  useEffect(() => {
    if (itemCount == 0 || itemCount > 1) {
      setItemNumberString("Items");
    } else {
      setItemNumberString("Item");
    }
  }, [itemCount]);

  const [loaderOn, setLoaderOn] = useState(true);

  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    if (loadedCount == allProducts.length) {
      setLoaderOn(false);
    } else {
      setLoaderOn(true);
    }
  }, [loadedCount]);

  ////
  //// display changes to cart instantly:

  function modifyCartCount(itemNumber) {
    console.log(
      "ContextCount: " + contextCount + " itemNumber (-1): " + itemNumber
    );
    setContextCount(contextCount + itemNumber);
  }

  function modifyWishlistCount(itemNumber) {
    setContextWishlistCount(contextWishlistCount + itemNumber);
  }

  function modifyTotalPrice(priceNumber) {
    console.log(
      "ContextPrice: " + contextPrice + " priceNumber: " + priceNumber
    );
    setContextPrice(contextPrice + priceNumber);
  }

  function modifyAddressSaved(bool) {
    setAddressSaved(bool);
  }

  // sign out:
  function handleSignOut() {
    firebase
      .auth()
      .signOut()
      .then(function () {
        setUserInfo({});
        setUserSignedInCount(userSignedInCount + 1);
        setTotalCost(0);
        setItemCount(0);
        setItemList([]);
        setAccountName("");
        setTwitterUser(false);
        document.getElementById("firebaseui-auth-container").style.display =
          "initial";

        // (function ($) {

        //     $("#firebaseui-auth-container").load(document.URL + " #firebaseui-auth-container");
        // })(jQuery)

        // Sign-out successful.
      })
      .catch(function (error) {
        // An error happened.
      });
    window.location.reload();
  }

  ///////////////////// increment products in Db when they are ordered:
  function updateDatabaseOrders(item) {
    firebase.functions().httpsCallable("updateOrders")({ item });
  }

  const [wishlistTempCache, setWishlistTempCache] = useState([]);

  //////////////// to streamline cart and wishlist functions across app
  function addToWishlist(item) {
    const user = firebase.auth().currentUser.email;
    console.log(item + " Added to wishlist under " + user);

    let sale = item[12];

    if (!sale) {
      let wishlistCache = `${item[0]}%%${item[5]}%%${item[2]}00`;
      firebase.functions().httpsCallable("addToWishlist")({ wishlistCache });
      const newItem = [item[0], item[5], Number(item[2]) * 100];

      setWishlistItems([...wishlistItems, newItem]);

      setWishlistTempCache([...wishlistTempCache, wishlistCache]);
    } else {
      let wishlistCache = `${item[0]}%%${item[5]}%%${item[12]}00`;
      firebase.functions().httpsCallable("addToWishlist")({ wishlistCache });
      const newItem = [item[0], item[5], Number(item[12]) * 100];

      setWishlistItems([...wishlistItems, newItem]);

      setWishlistTempCache([...wishlistTempCache, wishlistCache]);
    }
  }

  function removeFromWishlist(item) {
    console.log("item removed from wishlist " + item);
    firebase.functions().httpsCallable("removeFromWishlist")({ item });
    const newList = wishlistItems.filter((i) => !i.includes(item));
    setWishlistItems(newList);
  }

  // saving item info to cart
  function addToCart(item, options) {
    const user = firebase.auth().currentUser.email;
    console.log(item + " Added to cart under " + user);

    let colorArr = [options[1], options[2]];
    let colorString = colorArr.join("_");
    console.log(options);
    console.log(colorString);

    // options0 is size
    // options1 and 2 are color name and hex
    // options3 is quantity

    let itemAlreadyInCartArray = itemList.filter((i) => i === item);
    let prevItemCartCount = itemAlreadyInCartArray.length;

    let quant = Number(options[3]);
    let quantDifference = Number(quant - prevItemCartCount);

    let sale = item[12];

    let tempArray = [];

    if (quantDifference > 0) {
      let i;
      for (i = 0; i < quantDifference; i++) {
        if (!sale) {
          let cartCache = `${item[0]}%%${item[5]}%%${item[2]}00%%${options[0]}%%${colorString}`;
          firebase.functions().httpsCallable("addToCart")({ cartCache });

          const newItem = [
            item[0],
            item[5],
            Number(item[2]) * 100,
            options[0],
            colorString,
          ];

          tempArray.push(newItem);
        } else {
          let cartCache = `${item[0]}%%${item[5]}%%${sale}00%%${options[0]}%%${colorString}`;
          firebase.functions().httpsCallable("addToCart")({ cartCache });

          const newItem = [
            item[0],
            item[5],
            Number(sale) * 100,
            options[0],
            colorString,
          ];

          tempArray.push(newItem);
        }
      }
      setItemList([...itemList, ...tempArray]);
      if (anonUser) {
        setAnonCart([...anonCart, ...tempArray]);
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////
  function fromWishlistToCart(item) {
    const user = firebase.auth().currentUser.email;
    console.log(item + " Added to cart under " + user);

    let sale = item[12];
    let normalPrice = item[2];

    if (!sale) {
      let cartCache = `${item[0]}%%${item[1]}%%${normalPrice}00`;
      firebase.functions().httpsCallable("addToCart")({ cartCache });

      const newItem = [item[0], item[1], Number(item[2]) * 100];

      setItemList([...itemList, newItem]);
    } else {
      let cartCache = `${item[0]}%%${item[1]}%%${sale}00`;
      firebase.functions().httpsCallable("addToCart")({ cartCache });

      const newItem = [item[0], item[1], Number(sale) * 100];

      setItemList([...itemList, newItem]);
    }
  }

  function removeFromCart(cartItem, amount) {
    // to remove an item, split all items of that name into an array, remove one from it,
    // and pass it back.
    console.log("Item removed from cart " + cartItem);

    // let sale = cartItem[12]
    let normalPrice = cartItem[2];

    // if (!sale) {
    let cartCache = `${cartItem[0]}%%${cartItem[1]}%%${normalPrice}%%${cartItem[3]}%%${cartItem[4]}`;
    const newCart = itemList.filter(
      (item) =>
        !(
          item[0] == cartItem[0] &&
          item[1] == cartItem[1] &&
          item[2] == cartItem[2] &&
          item[3] == cartItem[3] &&
          item[4] == cartItem[4]
        )
    );
    const arrayOfGivenItem = itemList.filter(
      (item) =>
        item[0] == cartItem[0] &&
        item[1] == cartItem[1] &&
        item[2] == cartItem[2] &&
        item[3] == cartItem[3] &&
        item[4] == cartItem[4]
    );

    let i;
    for (i = 0; i < amount; i++) {
      firebase.functions().httpsCallable("removeFromCart")({ cartCache });
      // newArr.push([item[0], item[1], item[2], item[3], item[4]])
      arrayOfGivenItem.pop();
    }

    console.log(newCart);
    console.log(arrayOfGivenItem);

    if (arrayOfGivenItem.length > 0) {
      let finalCart = [...newCart, ...arrayOfGivenItem];

      setItemList([...finalCart]);

      if (anonUser) {
        setAnonCart([...finalCart]);
      }
      return console.log(finalCart);
    } else {
      setItemList([...newCart]);
      if (anonUser) {
        setAnonCart([...newCart]);
      }

      return console.log(newCart);
    }

    // } else {

    // let cartCache = `${cartItem[0]}%%${cartItem[1]}%%${sale}%%${cartItem[3]}%%${cartItem[4]}`
    // const newCart = itemList.filter(item => !(
    //     (item[0] == cartItem[0]) &&
    //     (item[1] == cartItem[1]) &&
    //     (item[2] == cartItem[2]) &&
    //     (item[3] == cartItem[3]) &&
    //     (item[4] == cartItem[4])
    // )
    // )
    // const arrayOfGivenItem = itemList.filter(item => (
    //     (item[0] == cartItem[0]) &&
    //     (item[1] == cartItem[1]) &&
    //     (item[2] == cartItem[2]) &&
    //     (item[3] == cartItem[3]) &&
    //     (item[4] == cartItem[4])
    // )
    // )

    // let i;
    // for (i = 0; i < amount; i++) {
    //     firebase.functions().httpsCallable('removeFromCart')({ cartCache })
    //     // newArr.push([item[0], item[1], item[2], item[3], item[4]])
    //     arrayOfGivenItem.pop()

    // }

    // console.log(newCart)
    // console.log(arrayOfGivenItem)

    // if (arrayOfGivenItem.length > 0) {
    //     let finalCart = [...newCart, ...arrayOfGivenItem]

    //     setItemList([...finalCart])

    //     if (anonUser) {
    //         setAnonCart([...finalCart])
    //     }
    //     return console.log(finalCart)

    // } else {

    //     setItemList([...newCart])
    //     if (anonUser) {
    //         setAnonCart([...newCart])
    //     }

    //     return console.log(newCart)
    // }

    // }
  }

  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [prevOrders, setPrevOrders] = useState([]);

  const [payMethod, setPayMethod] = useState([]);

  const [storeCredit, setStoreCredit] = useState(0);

  const [darkMode, setDarkMode] = useState(true);
  /////////////////////// get user orders info to view in their account section.
  ///// .... as well as a bunch of additional info

  function userTertiaryInfo() {
    if ((userInfo.userEmail && !anonUser) || twitterUser) {
      let ordersArray = [];

      let emailArray = [];
      let email = emailArray[0];

      let userEmail = userInfo.userEmail;
      if (twitterUser) {
        firebase
          .functions()
          .httpsCallable("getTwitterUserEmail")()
          .then((result) => {
            let theEmail = result.data._fieldsProto.customer_email.stringValue;
            console.log(theEmail);
            return emailArray.push(theEmail);
          })
          .catch((error) => {
            console.log("error getting twitter email: " + error);
          });
      } else {
        emailArray.push(userEmail);
      }

      firebase
        .functions()
        .httpsCallable("getUserOrders")({ email })
        .then((result) => {
          console.log(result);
          console.log(result.data);

          result.data.forEach((order) => {
            // let itemsAndUrls = []
            let date = order[0];
            let orderAmount = order[2];
            let orderItems = order[1];
            let orderType = order[3];
            let orderCreditUsed = order[4];
            let orderStatus = order[5];
            let orderTracking = order[6];
            let fullOrderData = [
              date,
              orderItems,
              orderAmount,
              orderType,
              orderCreditUsed,
              orderStatus,
              orderTracking,
            ];
            console.log(fullOrderData);

            ordersArray.push(fullOrderData);
          });
          console.log(ordersArray);
        });
      // ordersArray.sort(function (a, b) { return (Number(b[0]) - Number(a[0])) })

      setPrevOrders(ordersArray);
      setOrdersLoaded(true);
      // phase 2 of this effect: get pay method:
      firebase
        .functions()
        .httpsCallable("getPayMethod")()
        .then((result) => {
          console.log(result);
          console.log(result.data);
          let newArr = [];
          let paymentMethod =
            result.data._fieldsProto.payMethod.arrayValue.values;
          paymentMethod.forEach((item) => {
            newArr.push(item.stringValue);
          });
          console.log(newArr);
          console.log(`paymentMethod: ${paymentMethod}, newArr: ${newArr}`);
          setPayMethod(newArr);
          setUserInfo({
            providerId,
            uid,
            displayName,
            userEmail,
            photoURL,
            anonUser,
            prevAddressShipping,
            prevAddressBilling,
            payMethod: newArr,
          });

          // this function gets the entire customer document, so it also retrieves store credit
          console.log(result.data._fieldsProto.storeCredit);
          let store_credit = result.data._fieldsProto.storeCredit.integerValue;
          setStoreCredit(Number(store_credit) * 100);
          setModdedStoreCredit(Number(store_credit) * 100);

          let staySigned = result.data._fieldsProto.staySignedIn.booleanValue;
          console.log(staySigned);

          if (staySigned == true) {
            setStaySignedIn(true);
          } else {
            setStaySignedIn(false);
          }

          let notify = result.data._fieldsProto.allowNotify.booleanValue;

          console.log(notify);

          if (notify == true) {
            setUpdatesChoice(true);
            setAllowNotify(true);
          } else {
            setUpdatesChoice(false);
            setAllowNotify(false);
          }

          let dark = result.data._fieldsProto.darkMode.booleanValue;
          console.log(dark);
          if (dark === false) {
            setDarkMode(false);
          } else {
            setDarkMode(true);
          }
        });
      console.log(payMethod);
      console.log(storeCredit);
    }
  }
  ////////////////////////////// < Modals code >

  const [modalTempItem, setModalTempItem] = useState([]);
  const [modalTempOptions, setModalTempOptions] = useState([]);
  const [modalTempProductQuant, setModalTempProductQuant] = useState(0);

  const [modalFunction, setModalFunction] = useState("");
  const [modalText, setModalText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (modalOpen) {
      document.getElementById("functionalModalButton").disabled = false;
    }
  }, [modalText]);

  function activateAddToWishlistModal(item) {
    setModalTempItem(item);
    setModalText(`Added ${item} to Favorites`);
    setModalFunction("removeWishlist");

    setModalOpen(false);
    setModalOpen(true);
    ////
  }

  function activateRemoveFromWishlistModal(item) {
    setModalTempItem(item);
    setModalText(`Removed ${item[0]} from Favorites`);
    setModalFunction("addWishlist");

    setModalOpen(false); // so that modal 5 second limit is reset
    setModalOpen(true);
    ////
  }

  function activateAddToCartModal(item, options) {
    setModalTempItem(item);
    setModalTempOptions(options);
    setModalText(`Added ${item[0]} to Cart`);
    setModalFunction("removeCart");

    setModalOpen(false);
    setModalOpen(true);
    ////
  }

  function activateRemoveFromCartModal(item, options) {
    setModalTempItem(item);
    setModalTempOptions(options);
    setModalText(`Removed ${item[0]} from Cart`);
    setModalFunction("addCart");

    setModalOpen(false);
    setModalOpen(true);
    ////
  }

  function activateMergeCartModal(itemsArray) {
    setModalTempItem(itemsArray);
    // setModalTempOptions(options)
    let itemNameArray = itemsArray.map((item) => item[0]);
    let itemNames = itemNameArray.join(", ");
    // let namesAndCommas = itemNames.split(" ")

    // if (itemNameArray.length > 0) {

    //     let lastItem = namesAndCommas.pop()
    //     namesAndCommas.push("and")
    //     namesAndCommas.push(lastItem)

    // }
    // let newItemNames = namesAndCommas.join(" ")

    setModalText(
      `${itemNames} ${itemNameArray.length > 1 ? "were" : "was"} merged to Cart`
    );
    setModalFunction("mergeCart");

    setModalOpen(false);
    setModalOpen(true);
    ////
  }

  const [wishListDisplayed, setWishlistDisplayed] = useState(false);

  const [finalItemList, setFinalItemList] = useState([]);

  function handleRemoveMultipleFromCart(item, amount) {
    let newArr = [];
    let i;
    // for (i = 0; i < amount; i++) {
    //     removeFromCart(item, amount)
    //     // newArr.push([item[0], item[1], item[2], item[3], item[4]])

    // }

    removeFromCart(item, amount);

    const newFinalList = finalItemList.filter(
      (i) =>
        !(
          i[0] == item[0] &&
          i[1] == item[1] &&
          i[2] == item[2] &&
          i[3] == item[3] &&
          i[4] == item[4] &&
          i[5] == item[5]
        )
    );
    const arrayOfGivenItem = itemList.filter(
      (i) =>
        i[0] == item[0] &&
        i[1] == item[1] &&
        i[2] == item[2] &&
        i[3] == item[3] &&
        i[4] == item[4] &&
        i[5] == item[5]
    );
    arrayOfGivenItem.pop();

    let finalList = [...newFinalList, ...arrayOfGivenItem];
    setFinalItemList([...finalList]);
    setItemList(finalList);
    // setItemList()
  }

  function modalExecute() {
    document.getElementById("functionalModalButton").disabled = true;

    let item = modalTempItem;
    let options = modalTempOptions;
    let itemQuant = Number(modalTempOptions[3]);

    console.log(modalTempItem);
    console.log(modalTempOptions);
    console.log(itemQuant);

    if (modalFunction == "removeCart") {
      removeFromCart(item, options);
      modifyCartCount(Number(options) * -1);
      modifyTotalPrice(Number(item[2]) * (Number(options) * -1));
    } else if (modalFunction == "addCart") {
      addToCart(item, options);
      modifyCartCount(itemQuant);
      modifyTotalPrice(Number(item[2]) * 100 * itemQuant);
    } else if (modalFunction == "removeWishlist") {
      removeFromWishlist(item);
      modifyWishlistCount(-1);
    } else if (modalFunction == "addWishlist") {
      addToWishlist(item);
      modifyWishlistCount(1);
    } else if (modalFunction == "mergeCart") {
      let storageArr = [];

      let parseItemList = item.map((i) => {
        // let similarItemArray = item.filter(j => j == i)
        // let itemQuant = similarItemArray.length
        console.log(item);
        console.log(itemList);
        // if (!storageArr.includes(i)) {

        modifyCartCount(Number(1) * -1);
        modifyTotalPrice(Number(i[2]) * (Number(1) * -1));
        return handleRemoveMultipleFromCart(i, 1);
        // }

        // storageArr.push(i)
      });
      return parseItemList;
      // "item" is the array of all cart items.
      // removeFromCart expects (itemSingular, amount)
    } else {
      console.log("improper modal function!");
    }

    console.log(itemList);
  }

  //// the options modal:

  const [optionsModalText, setOptionsModalText] = useState("");
  const [optionsModalDisplayed, setOptionsModalDisplayed] = useState(false);

  function activateOptionsModal(text) {
    setOptionsModalDisplayed(false);
    if (text == "color") {
      setOptionsModalText("Please select a color");
    } else if (text == "size") {
      setOptionsModalText("Please select a size");
    } else if (text == "colorSize") {
      setOptionsModalText("Please select a size and color");
    }

    setOptionsModalDisplayed(true);
  }

  useEffect(() => {
    if (optionsModalDisplayed) {
      document.getElementById("itemOptionsModal").style.display = "initial";
      setTimeout(() => {
        document.getElementById("itemOptionsModal").style.display = "none";
        setOptionsModalDisplayed(false);
      }, 5000);
    } else {
      document.getElementById("itemOptionsModal").style.display = "none";
    }
  }, [optionsModalDisplayed]);

  function closeOptionsModal() {
    document.getElementById("itemOptionsModal").style.display = "none";
  }

  ///////////////////////////// </ Modals code >

  // for moderating number of products in shop pages:
  const [productOnPageCount, setProductOnPageCount] = useState(0);

  const [accountTitleString, setAccountTitleString] = useState("Your Account");

  /////////////////// For handling store credit...

  function handleStoreCreditPrompt() {
    document.getElementById("storeCreditModal").style.display = "initial";
  }

  const [moddedStoreCredit, setModdedStoreCredit] = useState(0);
  const [priceAfterStoreCredit, setPriceAfterStoreCredit] = useState(0);
  const [storeCreditUsed, setStoreCreditUsed] = useState(0);

  const [exchangePurchase, setExchangePurchase] = useState(false);

  function handleAllCredit() {
    // if ((storeCredit * 100) >= totalCost) {
    //     setPriceAfterStoreCredit(0)
    //     setStoreCreditUsed(totalCost)
    // }
    // else {
    if (storeCredit >= totalCost) {
      setPriceAfterStoreCredit(0);
      setStoreCreditUsed(totalCost);
      setExchangePurchase(true);
    } else {
      setPriceAfterStoreCredit(totalCost - storeCredit);
      setStoreCreditUsed(storeCredit);

      let moddedCost = Number(totalCost - storeCredit);
      console.log(moddedCost);
      if (moddedCost > 50) {
        firebase
          .functions()
          .httpsCallable("createPaymentIntent")({ moddedCost })
          .then((result) => {
            // setPaymentInt(result.data)
            return console.log(
              "paymentIntent created using store credit" + result.data
            );
          })
          .catch((error) => {
            return console.log("no response from callable " + error);
          });
      } else {
        setExchangePurchase(true);
      }
    }
    // }
  }
  function modStoreCredit() {
    let chosenCreditProto = document.getElementById("modStoreCreditInput")
      .value;
    console.log(chosenCreditProto);
    let chosenCredit = Number(chosenCreditProto) * 100;
    let moddedCost = Number(totalCost - chosenCredit);
    setStoreCreditUsed(chosenCredit);
    setPriceAfterStoreCredit(moddedCost);
    if (moddedCost > 50) {
      firebase
        .functions()
        .httpsCallable("createPaymentIntent")({ moddedCost })
        .then((result) => {
          // setPaymentInt(result.data)
          return console.log(
            "paymentIntent created using store credit" + result.data
          );
        })
        .catch((error) => {
          return console.log("no response from callable " + error);
        });
    } else {
      setExchangePurchase(true);
    }
  }

  const [exchangePurchaseComplete, setExchangePurchaseComplete] = useState(
    false
  );
  const [
    lastExchangeOrderCreditUsed,
    setLastExchangeOrderCreditUsed,
  ] = useState(0);

  useEffect(() => {
    if (itemList.length > 0) {
      setExchangePurchaseComplete(false);
      setExchangePurchase(false);
    }
  }, [itemList]);

  function confirmExchangeOrder(orderString, itemList, deliverDate) {
    // let timeStamp = new Date(Date.now())

    let exchangeNote = document.getElementById("exchangeNote").value;
    // callable('exchangeOrder')
    firebase
      .functions()
      .httpsCallable("exchangeOrder")({
        itemList,
        orderString,
        deliverDate,
        exchangeNote,
      })

      .then((result) => {
        console.log(result);
        // cartItems, cost, lastFour, deliverDate

        // setOrderComplete(true)
        // setProcessError(false)
        let itemNameArray = itemList.map((item) => {
          return item[0];
        });

        let nameArrayJoined = itemNameArray.join(", ");
        setItemsPurchased(nameArrayJoined);
        // send receipt email:
        // if (userInfo.userEmail) {
        console.log("normal email sent");
      })
      .then((result) => {
        itemList.forEach((i) => {
          // let singleItem = fullItem[0]
          // let itemPrice = singleItem[2]

          let item = i[0];
          let itemPrice = i[2];

          console.log("item: " + item);
          console.log("itemPrice: " + itemPrice);

          updateDatabaseOrders(item);
          modifyTotalPrice(Number(itemPrice) * -1);
          modifyCartCount(-1);
        });
        let newArr = [];
        setItemList([]);
        // setAnonList([])
        setFinalItemList(newArr);
        // setSpinnerDisplayed(false)
        setExchangePurchaseComplete(true);

        if (storeCreditUsed > 0) {
          firebase
            .functions()
            .httpsCallable("updateCredit")({ storeCreditUsed })
            .then((result) => {
              setLastExchangeOrderCreditUsed(storeCreditUsed);
              setStoreCredit(storeCredit - storeCreditUsed);
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
  }

  ////////////////////// Bool for loading a modal on checkout page

  const [onCheckout, setOnCheckout] = useState(false);
  const [updatesChoice, setUpdatesChoice] = useState(false);

  const [allNumber, setAllNumber] = useState(0);
  const [displayNumber, setDisplayNumber] = useState(false);
  const [itemString, setItemString] = useState("");

  const [wishlistString, setWishlistString] = useState("Favorites");

  const [itemLoadedCount, setItemLoadedCount] = useState(0);

  window.onbeforeunload = function () {
    if (!staySignedIn) {
      handleSignOut();
    }
    setAllNumber(0);
    setDisplayNumber(0);
    setItemList([]);
    setFinalItemList([]);
    setUserInfo({});
  };

  const [expressCheckoutOn, setExpressCheckoutOn] = useState(false);

  function handleExpressModal() {
    if (!expressCheckoutOn) {
      document.getElementById("expressModal").style.display = "initial";
    }
  }

  useEffect(() => {
    if (accountTitleString == "Your Account" || !userInfo.userEmail) {
      setExpressCheckoutOn(false);
    } else if (
      accountTitleString !== "Your Account" &&
      userInfo.userEmail &&
      userInfo.payMethod &&
      userInfo.payMethod.length > 0
    ) {
      setExpressCheckoutOn(true);
    }
  }, [accountTitleString, userInfo]);

  const [orderComplete, setOrderComplete] = useState(false);
  const [orderFinished, setOrderFinished] = useState(false);

  const [useExpressMode, setUseExpressMode] = useState(false);

  useEffect(() => {
    if (orderFinished) {
      setFinalItemList([]);
      setItemList([]);
    }
  }, [orderFinished]);
  // ///////////////
  //////////////////
  const stripePromise = loadStripe(
    "pk_live_jEO9oUQ2IJ2pZ2NiOsloU4ag00KAuGAjPB"
  );
  ///////////////////////////

  //// Screen size hook:

  const isClient = typeof window === "object";

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  function useWindowSize() {
    useEffect(() => {
      if (!isClient) {
        return false;
      }
      function handleResize() {
        setWindowSize(getSize());
      }

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return windowSize;
  }

  const screenSize = useWindowSize();

  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [canResize, setCanResize] = useState(true);

  const [homeLoaded, setHomeLoaded] = useState(0);

  useEffect(() => {
    if (canResize) {
      // 16:9 is the common aspect ratio
      let largeAspectRatio = Number(16 / 9);
      let smallAspectRatio = Number(10.16 / 16);
      if (Number(windowSize.width / windowSize.height) >= largeAspectRatio) {
        setIsLargeScreen(true);
        setIsSmallScreen(false);
      } else if (
        Number(windowSize.width / windowSize.height) <= smallAspectRatio
      ) {
        setIsLargeScreen(false);
        setIsSmallScreen(true);
      } else {
        setIsLargeScreen(false);
        setIsSmallScreen(false);
      }
    }
  }, [windowSize, homeLoaded]);
  const otherDriaTopPhoto =
    "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/w%20bg%20lace%20x%20top%20IMG_1340.jpg?alt=media&token=2d18f3dd-4fb6-4380-8cac-35f8c1cabcaa";

  const [topsPhoto, setTopsPhoto] = useState(
    "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/w%20bg%20lace%20x%20top%20IMG_1340.jpg?alt=media&token=2d18f3dd-4fb6-4380-8cac-35f8c1cabcaa"
  );
  const [beautifulDriaPhoto, setBeautifulDriaPhoto] = useState(
    "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/70346107_2503742322981878_8139699380883030016_o.jpg?alt=media&token=021e7085-75ff-47c7-8e09-739326bcb5b9"
  );
  const [landingPhoto, setLandingPhoto] = useState(
    "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/best%20cover%20photo%202%20(2).jpg?alt=media&token=3670d217-2999-41ab-b7dd-5141e67f620c"
  );

  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });
  const isBigScreen = useMediaQuery({ query: "(min-device-width: 1824px)" });

  useEffect(() => {
    // if (isPortrait) {
    //   setIsSmallScreen(true);
    // }
    // // if (isDesktopOrLaptop) {
    // //   setIsLargeScreen(true);
    // // }
    if (isBigScreen || isDesktopOrLaptop) {
      setIsLargeScreen(true);
    }
    console.log(`isPortrait: ${isPortrait}`);
    // console.log(`isDesktopOrLaptop: ${isDesktopOrLaptop}`);
    console.log(`isBigScreen: ${isBigScreen}`);

    if (!isPortrait) {
      setTopsPhoto(
        // "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/w%20bg%20long%20sleeve%20x%20top%20IMG_1243.jpg?alt=media&token=ee4f33f6-5ca4-48a0-904c-0f4a7e5907c4"
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/w%20bg%20lace%20x%20top%20IMG_1340.jpg?alt=media&token=2d18f3dd-4fb6-4380-8cac-35f8c1cabcaa"
      );
      setBeautifulDriaPhoto(
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/70346107_2503742322981878_8139699380883030016_o.jpg?alt=media&token=021e7085-75ff-47c7-8e09-739326bcb5b9"
      );
      setLandingPhoto(
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/best%20cover%20photo%202%20(2).jpg?alt=media&token=3670d217-2999-41ab-b7dd-5141e67f620c"
      );
    } else {
      setTopsPhoto(
        // "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/w%20bg%20long%20sleeve%20x%20top%20IMG_1243%20-%20Copy.png?alt=media&token=19362f2a-ef30-4555-94ef-6ec3e4800157"
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/w%20bg%20lace%20x%20top%20IMG_1340.jpg?alt=media&token=2d18f3dd-4fb6-4380-8cac-35f8c1cabcaa"
      );
      setBeautifulDriaPhoto(
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/70346107_2503742322981878_8139699380883030016_o%20(2).jpg?alt=media&token=38319a3b-4d5b-43b1-a23e-89409f72813b"
      );
      setLandingPhoto(
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/best%20cover%20photo%202%20-%20Copy%20(2).jpg?alt=media&token=54bf23d3-2ef4-4b65-b27f-d824f3c9e9f8"
      );
    }
  }, [isBigScreen, isDesktopOrLaptop, isPortrait]);

  useEffect(() => {
    // locOrientation = window.screen.lockOrientation || window.screen.mozLockOrientation || window.screen.msLockOrientation || window.screen.orientation.lock;

    if (isLargeScreen) {
      if (window.screen.lockOrientation) {
        window.screen.lockOrientation("landscape");
      } else if (window.screen.mozLockOrientation) {
        window.screen.mozLockOrientation("landscape");
      } else if (window.screen.msLockOrientation) {
        window.screen.msLockOrientation("landscape");
      } else if (window.screen.orientation.lock) {
        window.screen.orientation.lock("landscape");
      }
      // locOrientation("landscape")
    } else {
      // locOrientation("portrait")
      if (window.screen.lockOrientation) {
        window.screen.lockOrientation("portrait");
      } else if (window.screen.mozLockOrientation) {
        window.screen.mozLockOrientation("portrait");
      } else if (window.screen.msLockOrientation) {
        window.screen.msLockOrientation("portrait");
      } else if (window.screen.orientation.lock) {
        window.screen.orientation.lock("portrait");
      }
    }
  }, [isLargeScreen]);

  function incrementHome() {
    setHomeLoaded(homeLoaded + 1);
  }

  const [displayPayPal, setDisplayPayPal] = useState(false);
  const [payPalHeightArr, setPayPalHeightArr] = useState([]);

  const [stripeDisplayed, setStripeDisplayed] = useState(false);

  function displayStripe() {
    // document.getElementById("shipRush").setAttribute('disabled', "true")
    // document.getElementById("shipRush").disabled = true
    // document.getElementById("shipExpedited").setAttribute('disabled', "true")
    // document.getElementById("shipExpedited").disabled = true
    // document.getElementById("shipStandard").setAttribute('disabled', "true")
    // document.getElementById("shipStandard").disabled = true
    // document.getElementById("shippingInput").setAttribute('display', 'none')

    setStripeDisplayed(true);
  }

  const [storeCreditExceedsCost, setStoreCreditExceedsCost] = useState(false);

  const [onProductPage, setOnProductPage] = useState(false);

  useEffect(() => {
    if (storeCredit >= totalCost) {
      setStoreCreditExceedsCost(true);
    } else {
      setStoreCreditExceedsCost(false);
    }
  }, [storeCredit, totalCost]);

  const [changeAmount, setChangeAmount] = useState(false);

  const [previouslyViewed, setPreviouslyViewed] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  ////////

  const [enterPaymentAllowed, setEnterPaymentAllowed] = useState(true);

  ///

  const [responsiveEmail, setResponsiveEmail] = useState("");

  useEffect(() => {
    window.mobileCheck = function () {
      let check = false;
      (function (a) {
        if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            a
          ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substr(0, 4)
          )
        )
          check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      if (check == true) {
        setIsLargeScreen(false);
      }
      return check;
    };
  }, []);

  const [onHomeScreen, setOnHomeScreen] = useState(false);
  ////
  return (
    <Context.Provider
      value={{
        setContextCount,
        setContextPrice,

        contextCount,
        contextPrice,

        modifyCartCount,
        modifyTotalPrice,
        modifyWishlistCount,

        cartInfo,
        userInfo,

        setCartInfo,
        setUserInfo,

        addressSaved,
        modifyAddressSaved,
        setAddressSaved,

        itemList,
        setItemList,
        itemArray,

        itemNumberString,
        setItemNumberString,

        itemCount,
        totalCount,

        itemCost,
        totalCost,

        providerId,
        uid,
        displayName,
        userEmail,
        photoURL,
        anonUser,
        setAnonUser,

        signInUiLoaded,
        setSignInUiLoaded,

        handleSignOut,

        userSignedInCount,
        setUserSignedInCount,

        costTallyFinished,
        setCostTallyFinished,

        itemsPurchased,
        setItemsPurchased,

        wishlistItems,
        setWishlistItems,
        wishlistItemCount,

        addToWishlist,
        addToCart,
        fromWishlistToCart,

        removeFromWishlist,
        removeFromCart,

        allProducts,

        routerString,
        setRouterString,

        productPageComponent,
        setProductPageComponent,

        productsLoaded,
        setProductsLoaded,

        termsDisplay,
        setTermsDisplay,

        itemsMerged,
        setItemsMerged,

        updateDatabaseOrders,

        prevOrders,
        ordersLoaded,

        costTaxShipping,
        setCostTaxShipping,

        taxAmount,
        setTaxAmount,

        itemCategory,
        setItemCategory,

        beltCategory,
        skirtCategory,
        topCategory,
        fullSetCategory,

        activateAddToCartModal,
        activateAddToWishlistModal,

        activateRemoveFromCartModal,
        activateRemoveFromWishlistModal,

        activateMergeCartModal,

        modalTempItem,
        modalExecute,
        modalText,
        modalOpen,

        setModalOpen,

        finalItemList,
        setFinalItemList,

        optionsModalText,
        activateOptionsModal,
        closeOptionsModal,

        receiptEmail,
        setReceiptEmail,

        prevAddressBilling,
        prevAddressShipping,

        payMethod,
        setPayMethod,

        uid,

        productOnPageCount,
        setProductOnPageCount,

        accountName,
        accountTitleString,
        setAccountTitleString,

        storeCredit,
        setStoreCredit,

        handleStoreCreditPrompt,

        moddedStoreCredit,
        setModdedStoreCredit,

        priceAfterStoreCredit,
        setPriceAfterStoreCredit,

        handleAllCredit,
        modStoreCredit,
        storeCreditUsed,

        exchangePurchase,
        confirmExchangeOrder,
        exchangePurchaseComplete,
        lastExchangeOrderCreditUsed,

        onCheckout,
        setOnCheckout,

        wishlistTempCache,
        allowNotify,
        setAllowNotify,
        notifyUpdated,
        setNotifyUpdated,
        updatesChoice,
        setUpdatesChoice,

        categorySearch,
        setCategorySearch,
        displayNumber,
        allNumber,
        itemString,
        setAllNumber,
        setDisplayNumber,
        setItemString,

        itemLoadedCount,
        setItemLoadedCount,

        setStaySignedIn,
        staySignedIn,

        darkMode,
        setDarkMode,

        wishListDisplayed,
        setWishlistDisplayed,
        wishlistString,
        setWishlistString,

        expressCheckoutOn,
        setExpressCheckoutOn,

        handleExpressModal,

        addressHandled,

        orderComplete,
        setOrderComplete,

        tempShipAddress,
        setTempShipAddress,

        tempBillAddress,
        setTempBillAddress,

        setOrderFinished,

        useExpressMode,
        setUseExpressMode,

        stripePromise,

        isLargeScreen,
        isSmallScreen,

        loaderOn,
        setLoaderOn,
        loadedCount,
        setLoadedCount,

        displayPayPal,
        payPalHeightArr,

        setDisplayPayPal,
        setPayPalHeightArr,

        searchString,
        setSearchString,

        stripeDisplayed,
        setStripeDisplayed,
        displayStripe,

        storeCreditExceedsCost,
        setStoreCreditExceedsCost,

        changeAmount,
        setChangeAmount,

        previouslyViewed,
        setPreviouslyViewed,

        sidebarOpen,
        setSidebarOpen,

        toggleMenu,
        setToggleMenu,
        toggleString,
        setToggleString,
        handleToggleMenu,

        enterPaymentAllowed,
        setEnterPaymentAllowed,

        onProductPage,
        setOnProductPage,

        responsiveEmail,
        setResponsiveEmail,

        homeLoaded,
        setHomeLoaded,
        incrementHome,

        canResize,
        setCanResize,

        isPortrait,
        // isDesktopOrLaptop,
        isBigScreen,
        setIsLargeScreen,
        setIsSmallScreen,
        topsPhoto,
        landingPhoto,
        beautifulDriaPhoto,

        onHomeScreen,
        setOnHomeScreen,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export { ContextProvider, Context };
