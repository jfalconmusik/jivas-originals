import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Checkout from "./Checkout";
import { Context } from "./Context";
import ShippingItemList from "./ShippingItemList";
import firebase from "firebase";
import Flexbox from "flexbox-react";
import { Checkmark } from "react-checkmark";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "react-phone-number-input/style.css";
import PhoneInput, {
  isPossiblePhoneNumber,
  formatPhoneNumber,
  formatPhoneNumberIntl,
} from "react-phone-number-input";
import {
  CountryDropdown,
  RegionDropdown,
  CountryRegionData,
} from "react-country-region-selector";
import KeyboardedInput from "react-touch-screen-keyboard";
import "react-touch-screen-keyboard/lib/Keyboard.css"; // if you just want css
import FocusLock from "react-focus-lock";

function ShippingComponent() {
  // state info
  const {
    userInfo,
    modifyAddressSaved,
    addressSaved,
    prevAddressShipping,
    prevAddressBilling,
    routerString,
    setRouterString,
    setTermsDisplay,
    taxAmount,
    setTaxAmount,
    costTaxShipping,
    setCostTaxShipping,
    totalCost,
    anonUser,
    setReceiptEmail,
    receiptEmail,
    tempShipAddress,
    setTempShipAddress,
    tempBillAddress,
    setTempBillAddress,
    itemList,
    updateDatabaseOrders,
    modifyCartCount,
    setItemList,
    setAnonList,
    setFinalItemList,
    modifyTotalPrice,
    setOnCheckout,
    itemsPurchased,
    lastExchangeOrderCreditUsed,
    uid,
    addressHandled,
    orderComplete,
    setOrderComplete,
    isLargeScreen,
    setDisplayPayPal,
    setSearchString,
    stripeDisplayed,
    setStripeDisplayed,
    displayStripe,
    enterPaymentAllowed,
    setEnterPaymentAllowed,
    setOnProductPage,
    responsiveEmail,
    setResponsiveEmail,
    canResize,
    setCanResize,
    // applePayDevice
  } = useContext(Context);

  const [shippingNotSet, setShippingNotSet] = useState(true);

  const [userEmail, setUserEmail] = useState("");

  const [deliverDate, setDeliverDate] = useState("");
  useEffect(() => {
    setOnProductPage(false);
    // convert timestamp to milliseconds, add two weeks, make abbreviated string of Date.
    setSearchString("");
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

    setEnterPaymentAllowed(true);
  }, []);

  const [focusLocked, setFocusLocked] = useState(true);

  useEffect(() => {
    if (tempShipAddress[8]) {
      setResponsiveEmail(tempShipAddress[8]);
    }
  }, [tempShipAddress]);

  useEffect(() => {
    if (userInfo.userEmail) {
      setUserEmail(userInfo.userEmail);
    }
  }, [userInfo]);

  const [orderString, setOrderString] = useState("");
  // userinfo 1 is the uid
  let userIDSubstring = uid.substring(0, 4);
  let randNum = Math.floor(Math.random() * 100000);
  let semiUniqueString = `${userIDSubstring}${randNum}`;
  // make sure to pass this to the email as well.
  useEffect(() => {
    console.log(userIDSubstring);
    console.log(semiUniqueString);

    setOrderString(semiUniqueString);
  }, []);

  useEffect(() => {
    setOnCheckout(true);
  }, []);

  useEffect(() => {
    handleShipType("standard");
  }, []);

  const [shippingCost, setShippingCost] = useState(0);
  const [shippingInternational, setShippingInternational] = useState(false);

  // const [] = useState("")
  // const [] = useState("")

  const [payPalCost, setPayPalCost] = useState(0);
  const [payPalSuccess, setPayPalSuccess] = useState(false);
  const [payPalFailure, setPayPalFailure] = useState(false);

  useEffect(() => {
    let ppCost = (Number(totalCost) / 100).toFixed(2);
    setPayPalCost(ppCost);
  }, []);

  const [showEmailInput, setShowEmailInput] = useState(true);

  useEffect(() => {
    if (userInfo.userEmail && !anonUser && !userInfo.prevAddressShipping) {
      setShowEmailInput(false);
    }
  }, []);

  const [willSaveEmail, setWillSaveEmail] = useState(true);

  // function toggleSaveEmail() {

  //     if (willSaveEmail) {
  //         // saveEmail WAS selected, now is not
  //         document.getElementById('saveThisEmail').checked = false
  //     } else {
  //         document.getElementById('saveThisEmail').checked = true
  //     }

  //     setWillSaveEmail(!willSaveEmail)
  // }

  const [spinnerDisplayed, setSpinnerDisplayed] = useState(false);
  function saveEmail() {
    if (document.getElementById("emailInputText")) {
      let emailVal = document.getElementById("emailInputText").value;
      setReceiptEmail(emailVal);
      firebase.functions().httpsCallable("saveEmail")({ emailVal });

      if (tempShipAddress && tempBillAddress) {
        let userEmail = emailVal;
        setSpinnerDisplayed(true);
        firebase
          .functions()
          .httpsCallable("createAnonStripeCustomer")({
            userEmail,
            tempShipAddress,
            tempBillAddress,
          })
          .then((result) => {
            console.log(result);
            return setSpinnerDisplayed(false);
          });
      }
    }
  }

  useEffect(() => {
    setRouterString("shipping");
  }, []);

  useEffect(() => {
    setTermsDisplay(false);
    document.getElementById("firebaseui-auth-container").style.display = "none";
  }, []);

  const [address2Shipping, setAddress2Shipping] = useState(false);
  const [address2Billing, setAddress2Billing] = useState(false);
  const [address2BillingButton, setAddress2BillingButton] = useState(
    "⊕ Add Address 2"
  );
  const [address2ShippingButton, setAddress2ShippingButton] = useState(
    "⊕ Add Address 2"
  );
  const [address2, setAddress2] = useState("none");
  const [addressCache, setAddressCache] = useState({});

  const [americaBilling, setAmericaBilling] = useState(true);
  const [americaShipping, setAmericaShipping] = useState(true);

  const [deliverStandardDate, setDeliverStandardDate] = useState("");
  const [deliverExpeditedDate, setDeliverExpeditedDate] = useState("");
  const [deliverRushDate, setDeliverRushDate] = useState("");

  const [estDelivery, setEstDelivery] = useState([]);
  const [shipType, setShipType] = useState("");

  const [orderDate, setOrderDate] = useState("");

  const [errorShipping, setErrorShipping] = useState(false);
  const [errorBilling, setErrorBilling] = useState(false);

  const [billingAddress, setBillingAddress] = useState(false);

  const [shippingSaved, setShippingSaved] = useState(false);
  const [billingSaved, setBillingSaved] = useState(false);

  const [usePrevShipping, setUsePrevShipping] = useState(false);
  const [usePrevBilling, setUsePrevBilling] = useState(false);

  const [displayAddressForm, setDisplayAddressForm] = useState(true);

  const [enableOrderConfirm, setEnableOrderConfirm] = useState(false);

  function saveThisEmail() {
    let emailVal = document.getElementById("newEmail").value;

    setReceiptEmail(emailVal);

    firebase.functions().httpsCallable("saveEmail")({ emailVal });
  }

  useEffect(() => {
    if (userInfo.prevAddressBilling !== undefined) {
      if (
        userInfo.prevAddressBilling[0] &&
        userInfo.prevAddressBilling[0] !== undefined
      ) {
        setBillingSaved(true);
        setUsePrevBilling(true);
      }
    }
    if (userInfo.prevAddressShipping) {
      if (userInfo.prevAddressShipping[0]) {
        setShippingSaved(true);
        setUsePrevShipping(true);
        setDisplayAddressForm(false);
      }
    }
  }, [userInfo]);

  const inputErrorMessage = "Please Complete All Required Fields: ";

  ///////////////////////////

  useEffect(() => {
    if (billingSaved && shippingSaved) {
      modifyAddressSaved(true);
      setEnableOrderConfirm(true);
    } else {
      modifyAddressSaved(false);
    }
  }, [billingSaved, shippingSaved]);

  ////////////////////////////

  // set estimated delivery date for each of 3 shipping options, based on current date:
  useEffect(() => {
    const currentDate = new Date(Date.now());
    setOrderDate(currentDate);

    const twoWeeksAway = 12096e5;
    const oneWeekAway = 6.04e8;
    const fiveDaysAway = 4.32e8;

    // standard delivery: two weeks from date. USPS takes 3-5 days, typical total 14 days
    const standardDate = new Date(Date.now() + twoWeeksAway);
    const standardDateString = standardDate.toString().split(" ");
    const dateArr = [
      standardDateString[0],
      standardDateString[1],
      standardDateString[2],
      standardDateString[3],
    ];
    const StandardDateStringJoined = dateArr.join(" ");
    setDeliverStandardDate(StandardDateStringJoined);

    // expedited delivery: one week from date. USPS takes 2-3 days, typical total 10 days

    const expeditedDate = new Date(Date.now() + oneWeekAway);
    const expeditedDateString = expeditedDate.toString().split(" ");
    const dateArr2 = [
      expeditedDateString[0],
      expeditedDateString[1],
      expeditedDateString[2],
      expeditedDateString[3],
    ];
    const ExpeditedDateStringJoined = dateArr2.join(" ");
    setDeliverExpeditedDate(ExpeditedDateStringJoined);

    // rush delivery: five days from date. USPS takes 1-2 days, typical total 3-5 days

    const rushDate = new Date(Date.now() + fiveDaysAway);
    const rushDateString = rushDate.toString().split(" ");
    const dateArr3 = [
      rushDateString[0],
      rushDateString[1],
      rushDateString[2],
      rushDateString[3],
    ];
    const RushDateStringJoined = dateArr3.join(" ");
    setDeliverRushDate(RushDateStringJoined);
  }, []);
  ///////////////////////////////

  function handleUsePrevAddress(bool) {
    if (bool == true) {
      setEnableOrderConfirm(true);
      setDisplayAddressForm(false);
    } else if (bool == false) {
      setDisplayAddressForm(true);
      setEnableOrderConfirm(false);
    }
  }

  const [sameAsBilling, setSameAsBilling] = useState(true);

  useEffect(() => {
    setDisplayPayPal(false);
  }, []);

  // useEffect(() => {

  //     if (billingAddress) {
  //         setSameAsBilling(false)
  //     } else {
  //         setSameAsBilling(true)
  //     }

  // }, [billingAddress, sameAsBilling])

  // is billing address different?
  function toggleBillingAddress() {
    setBillingAddress(!billingAddress);

    if (sameAsBilling) {
      // setSameAsBilling(false)
      setBillingSaved(false);
    } else {
      // setSameAsBilling(true)
    }

    setUsePrevBilling(!usePrevBilling);
  }

  /////////////////////////

  // const [bothAddressesSaved, setBothAddressesSaved] = useState(false)

  useEffect(() => {
    if (shippingSaved && billingSaved) {
      setEnableOrderConfirm(true);
    }
  }, [shippingSaved, billingSaved]);

  const [eachLoaded, setEachLoaded] = useState(false);

  const [displayEmailCheckmark, setDisplayEmailCheckmark] = useState(false);

  useEffect(() => {
    let checkmark = document.getElementById("displayEmailCheckmark");
    setEachLoaded(true);
    if (eachLoaded) {
      if (displayEmailCheckmark) {
        checkmark.style.visibility = "visible";
        checkmark.setAttribute("visibility", "visible");
      } else {
        checkmark.style.visibility = "hidden";
        checkmark.setAttribute("visibility", "hidden");
      }
    }
  }, [displayEmailCheckmark]);

  const [
    displaySaveShipAddressCheckmark,
    setDisplaySaveShipAddressCheckmark,
  ] = useState(false);
  const [
    displaySaveBillAddressCheckmark,
    setDisplaySaveBillAddressCheckmark,
  ] = useState(false);

  useEffect(() => {
    let checkmark = document.getElementById("saveShipAddressCheck");
    setEachLoaded(true);
    if (eachLoaded) {
      if (displaySaveShipAddressCheckmark) {
        checkmark.style.visibility = "visible";
        checkmark.setAttribute("visibility", "visible");
      } else {
        checkmark.style.visibility = "hidden";
        checkmark.setAttribute("visibility", "hidden");
      }
    }
  }, [displaySaveShipAddressCheckmark]);

  useEffect(() => {
    setEachLoaded(true);
    if (eachLoaded) {
      let checkmark = document.getElementById("saveBillAddressCheck");

      if (checkmark) {
        if (displaySaveBillAddressCheckmark) {
          checkmark.style.visibility = "visible";
          checkmark.setAttribute("visibility", "visible");
        } else {
          checkmark.style.visibility = "hidden";
          checkmark.setAttribute("visibility", "hidden");
        }
      }
    }
  }, [displaySaveBillAddressCheckmark]);

  function handleUsePrevEmail() {
    // if useprevemail, change the other values, then flip useprevemail
    if (!usePrevEmail) {
      setShowEmailInput(false);
      setDisplayEmailCheckmark(true);
    } else {
      setShowEmailInput(true);
      setDisplayEmailCheckmark(false);
    }

    setUsePrevEmail(!usePrevEmail);
  }

  const [phoneNumber, setPhoneNumber] = useState("");

  function handleFocus(addressType) {
    let firstName = document.getElementById(`firstName${addressType}`).value;
    console.log(firstName);

    let lastName = document.getElementById(`lastName${addressType}`).value;

    let countryElement = document.getElementById(`country${addressType}`);
    let country = countryElement.value;
    let address1 = document.getElementById(`address1${addressType}`).value;

    if (document.getElementById(`address2${addressType}`) !== null) {
      let value = document.getElementById(`address2${addressType}`).value;
      setAddress2(value);
      console.log(address2);
    } else {
      setAddress2("none");
      console.log(address2);
    }
    console.log(address2);
    let city = document.getElementById(`city${addressType}`).value;
    let phone = document.getElementById(`phone${addressType}`).value;
    let zipCode = document.getElementById(`zipCode${addressType}`).value;

    setPhoneNumber(phone);

    let phone2 = phone;

    let natNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    let phoneNumbers = phone2.split("").filter((i) => natNumbers.includes(i));

    if (
      firstName &&
      lastName &&
      country &&
      address1 &&
      city &&
      phone &&
      zipCode
    ) {
      setFocusLocked(false);

      if (addressType == "shipping") {
        // handleSaveAddress("shipping");
        handleButtonsEnabled("shipping");
        setShippingNotSet(false);
        setShipSaveModal(true);
        if (document.getElementById("shipSavedModal")) {
          document.getElementById("shipSavedModal").style.display = "initial";
          document
            .getElementById("shipSavedModal")
            .setAttribute("display", "initial");
        }
      } else {
        handleButtonsEnabled("billing");
        setShipSaveModal(true);
        document.getElementById("shipSavedModal").style.display = "initial";
      }
      handleSaveAddress(addressType);
    }
  }

  function handleSaveAddress(addressType) {
    console.log(addressType);

    if (
      addressType == "shipping" &&
      document.getElementById("shipNextButton")
    ) {
      setShippingSaved(true);
      setShipNextDisabled(false);
      document.getElementById("shipNextButton").disabled = false;
      document
        .getElementById("shipNextButton")
        .setAttribute("disabled", "false");
    } else if (
      addressType == "billing" &&
      document.getElementById("billNextButton")
    ) {
      setBillingSaved(true);
      setBillNextDisabled(false);
      document.getElementById("billNextButton").disabled = false;
      document
        .getElementById("billNextButton")
        .setAttribute("disabled", "false");
    }
    // get the user's input based on address type

    console.log(`handleSaveAddress executed. addressType: ${addressType}`);

    let firstName = document.getElementById(`firstName${addressType}`).value;
    console.log(firstName);

    let lastName = document.getElementById(`lastName${addressType}`).value;

    let countryElement = document.getElementById(`country${addressType}`);
    let country = countryElement.value;
    let address1 = document.getElementById(`address1${addressType}`).value;

    if (document.getElementById(`address2${addressType}`) !== null) {
      let value = document.getElementById(`address2${addressType}`).value;
      setAddress2(value);
      console.log(address2);
    } else {
      setAddress2("none");
      console.log(address2);
    }
    console.log(address2);
    let city = document.getElementById(`city${addressType}`).value;
    let phone = document.getElementById(`phone${addressType}`).value;
    let zipCode = document.getElementById(`zipCode${addressType}`).value;

    // required fields incomplete for shipping?
    if (
      (firstName == null ||
        lastName == null ||
        country == null ||
        address1 == null ||
        city == null ||
        phone == null) &&
      addressType == "shipping"
    ) {
      setErrorShipping(true);
      goToError("shipping");
      console.log("error with shipping.");

      // required fields incomplete for billing?
    } else if (
      (firstName == null ||
        lastName == null ||
        country == null ||
        address1 == null ||
        city == null ||
        phone == null) &&
      addressType == "billing"
    ) {
      setErrorBilling(true);
      goToError("billing");
      console.log("error with billing");

      // is this address in america?
    } else if (
      (addressType == "shipping" && americaShipping) ||
      (addressType == "billing" && americaBilling)
    ) {
      let stateElement = document.getElementById(`state${addressType}`);
      let state = stateElement.value;

      // has the user not selected their state?
      if (state == null && addressType == "shipping") {
        setErrorShipping(true);
        goToError("shipping");
        console.log("error with shipping");
      } else if (state == null && addressType == "billing") {
        setErrorBilling(true);
        goToError("billing");
        console.log("error with billing");
      } else {
        if (addressType == "shipping") {
          setErrorShipping(false);
        } else if (addressType == "billing") {
          setErrorBilling(false);
        }

        let addressInfo = {
          addressType,
          firstName,
          lastName,
          country,
          address1,
          address2,
          city,
          state,
          zipCode,
          phone,
          sameAsOtherAddress: !billingAddress,
        };
        console.log(addressInfo);

        let tempInfo = [
          addressType,
          firstName,
          lastName,
          country,
          address1,
          address2,
          city,
          state,
          zipCode,
          phone,
          !billingAddress,
        ];

        console.log(tempInfo);

        let email = document.getElementById(`emailInputText`).value;

        firebase.functions().httpsCallable("saveUserAddress")({ addressInfo });
        if (addressType == "shipping") {
          // save temp shipping address
          setTempShipAddress([
            firstName,
            lastName,
            address1,
            city,
            state,
            zipCode,
            country,
            phone,
            email,
          ]);
        } else if (addressType == "billing") {
          setTempBillAddress([
            firstName,
            lastName,
            address1,
            city,
            state,
            zipCode,
            country,
            phone,
            email,
          ]);
        }

        if (addressType == "shipping") {
          setShippingSaved(true);
          console.log(shippingSaved);
          setDisplaySaveShipAddressCheckmark(true);
        } else if (addressType == "billing") {
          setBillingSaved(true);
          console.log(billingSaved);
          setDisplaySaveBillAddressCheckmark(true);
        }
      }
      // Is this address not in america?
    } else if (
      (addressType == "shipping" && !americaShipping) ||
      (addressType == "billing" && !americaBilling)
    ) {
      let state = document.getElementById(`state${addressType}`).value;

      // has the user not selected their state?
      if (state == null && addressType == "shipping") {
        setErrorShipping(true);
        goToError("shipping");
        console.log("error shipping");
      } else if (state == null && addressType == "billing") {
        setErrorBilling(true);
        goToError("billing");
        console.log("error billing");
      } else {
        if (addressType == "shipping") {
          setErrorShipping(false);
          console.log("no error shipping");
        } else if (addressType == "billing") {
          setErrorBilling(false);
          console.log("no error shipping");
        }

        let addressInfo = {
          addressType,
          firstName,
          lastName,
          country,
          address1,
          address2,
          city,
          state,
          zipCode,

          phone,
          sameAsOtherAddress: !billingAddress,
        };

        let tempInfo = [
          addressType,
          firstName,
          lastName,
          country,
          address1,
          address2,
          city,
          state,
          zipCode,
          phone,
          !billingAddress,
        ];

        console.log(tempInfo);

        setAddressCache(addressInfo);

        console.log(addressInfo);
        // if (!anonUser) {
        firebase.functions().httpsCallable("saveUserAddress")({ addressInfo });
        if (addressType == "shipping") {
          // save temp shipping address
          setTempShipAddress(tempInfo);
        } else if (addressType == "billing") {
          setTempBillAddress(tempInfo);
        }
        // }

        if (addressType == "shipping") {
          setShippingSaved(true);
          console.log("shipping saved");
          setDisplaySaveShipAddressCheckmark(true);
        } else if (addressType == "billing") {
          setBillingSaved(true);
          console.log("billing saved");
          setDisplaySaveBillAddressCheckmark(true);
        }
      }
    }

    console.log("save address finished. Address cache: " + addressCache);
  }

  const [shipSaveModal, setShipSaveModal] = useState(false);

  /////////////////////
  // const [stripeDisplayed, setStripeDisplayed] = useState(false)

  // function displayStripe() {
  //     // document.getElementById("shipRush").setAttribute('disabled', "true")
  //     // document.getElementById("shipRush").disabled = true
  //     // document.getElementById("shipExpedited").setAttribute('disabled', "true")
  //     // document.getElementById("shipExpedited").disabled = true
  //     // document.getElementById("shipStandard").setAttribute('disabled', "true")
  //     // document.getElementById("shipStandard").disabled = true
  //     // document.getElementById("shippingInput").setAttribute('display', 'none')

  //     setStripeDisplayed(true)

  // }

  // should we display address line two for this address type?
  function handleAddress2(addressType) {
    if (addressType == "shipping") {
      setAddress2Shipping(!address2Shipping);
    } else if (addressType == "billing") {
      setAddress2Billing(!address2Billing);
    }

    address2Shipping
      ? setAddress2ShippingButton("⊕ Add Address Line 2")
      : setAddress2ShippingButton("⊖ Remove Address Line 2");

    address2Billing
      ? setAddress2BillingButton("⊕ Add Address Line 2")
      : setAddress2BillingButton("⊖ Remove Address Line 2");
  }

  //////////////////////////////

  function handleCountry(addressType) {
    let e = document.getElementById(`country${addressType}`);
    let selectedCountry = e.options[e.selectedIndex].value;

    if (addressType == "shipping") {
      if (selectedCountry == "United States of America" && !americaShipping) {
        setAmericaShipping(true);
      } else if (
        selectedCountry !== "United States of America" &&
        americaShipping
      ) {
        setAmericaShipping(false);
        setShippingInternational(true);
      } else {
        return;
      }
    } else if (addressType == "billing") {
      if (selectedCountry == "United States of America" && !americaBilling) {
        setAmericaBilling(true);
      } else if (
        selectedCountry !== "United States of America" &&
        americaBilling
      ) {
        setAmericaBilling(false);
      } else {
        return;
      }
    }
  }

  const [usePrevEmail, setUsePrevEmail] = useState(true);
  const [notUsePrevEmail, setNotUsePrevEmail] = useState(false);

  useEffect(() => {
    if (usePrevEmail) {
      setNotUsePrevEmail(false);
    } else {
      setNotUsePrevEmail(true);
    }
  }, [usePrevEmail]);

  ///////////////////// calculate international shipping as necessary
  useEffect(() => {
    if (shippingInternational) {
      let costWithTax = Number(totalCost * 1.05);
      setShippingCost(2500);
      setCostTaxShipping(Number(costWithTax + 2500));
    }
  }, [shippingInternational]);

  ///////////////////////////
  // set automatic shipping and tax...
  useEffect(() => {
    let costWithTax = Number(totalCost * 1.05);
    setTaxAmount(Number(costWithTax - totalCost));
  }, []);

  //////////////

  const [finalCostDisplayed, setFinalCostDisplayed] = useState(false);
  const [shippingSelected, setShippingSelected] = useState(true);

  function handleShipType(input) {
    // lousiana tax rate is just less than 5%. Shipping price is included in cents, as is cost
    setShipType(input);
    setFinalCostDisplayed(true);
    setShippingSelected(true);
    let costWithTax = Number(totalCost * 1.05);

    if (input == "standard") {
      setEstDelivery(deliverStandardDate);
      setShippingCost(900);
      setCostTaxShipping(Number(costWithTax + 900));
    } else if (input == "expedited") {
      setEstDelivery(deliverExpeditedDate);
      setShippingCost(1200);
      setCostTaxShipping(Number(costWithTax + 1200));
    } else if (input == "rush") {
      setEstDelivery(deliverRushDate);
      setShippingCost(1600);
      setCostTaxShipping(Number(costWithTax + 1600));
    }
  }

  ////////////////////////////////

  function goToError(addressType) {
    var loc = document.location.toString().split("#")[0];
    document.location = loc + "#" + `anchor${addressType}`;
    return false;
  }

  ////////////////////////////////

  const [value, setValue] = useState("");
  const [possibleNumber, setPossibleNumber] = useState(false);

  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");

  useEffect(() => {
    let bool = isPossiblePhoneNumber(value);
    setPossibleNumber(bool);
  }, [value]);

  useEffect(() => {
    if (userInfo.prevAddressBilling) {
      if (userInfo.prevAddressBilling[0] === undefined) {
        setDisplayAddressForm(true);
      }
    } else {
      setDisplayAddressForm(true);
    }
  }, []);

  const [shipButtonDisabled, setShipButtonDisabled] = useState(false);
  const [billButtonDisabled, setBillButtonDisabled] = useState(false);

  function handleButtonsEnabled(addressType) {
    console.log(addressType);
    let first = document.getElementById(`firstName${addressType}`).value;
    console.log(first + first.length);
    let last = document.getElementById(`lastName${addressType}`).value;
    console.log(last + last.length);
    let add = document.getElementById(`address1${addressType}`).value;
    console.log(add + add.length);
    let city = document.getElementById(`city${addressType}`).value;
    console.log(city + city.length);
    let state = document.getElementById(`state${addressType}`).value;
    console.log(state + state.length);
    let zip = document.getElementById(`zipCode${addressType}`).value;
    console.log(zip + zip.length);
    let count = document.getElementById(`country${addressType}`).value;
    console.log(count + count.length);
    let phone = document.getElementById(`phone${addressType}`).value;
    console.log(phone + phone.length);
    let email = document.getElementById("emailInputText").value;
    console.log(email + email.length);
    let num = Number(
      email.length *
        phone.length *
        count.length *
        zip.length *
        state.length *
        city.length *
        add.length *
        last.length *
        first.length
    );
    console.log(num);
    console.log(num > 0);
    let num2 = Number(
      phone.length *
        count.length *
        zip.length *
        state.length *
        city.length *
        add.length *
        last.length *
        first.length
    );
    console.log(num2);
    console.log(num2 > 0);

    if (addressType == "shipping" && num > 0) {
      console.log("shipping");
      console.log(num > 0);
      let tempInfo = [
        document.getElementById(`firstName${addressType}`).value,
        document.getElementById(`lastName${addressType}`).value,
        document.getElementById(`address1${addressType}`).value,
        document.getElementById(`city${addressType}`).value,
        document.getElementById(`state${addressType}`).value,
        document.getElementById(`zipCode${addressType}`).value,
        document.getElementById(`country${addressType}`).value,
        document.getElementById(`phone${addressType}`).value,
        document.getElementById("emailInputText").value,
      ];
      setTempShipAddress(tempInfo);
      console.log("temp info: " + tempInfo);
      setShipButtonDisabled(false);
      handleSaveAddress("shipping");
    } else if (addressType == "shipping" && num == 0) {
      setShipButtonDisabled(true);
      console.log("disabled ship button");
      console.log(num);
    } else if (addressType == "billing" && num2 > 0) {
      console.log("billing");
      console.log(num2);

      let tempInfo = [
        document.getElementById(`firstName${addressType}`).value,
        document.getElementById(`lastName${addressType}`).value,
        document.getElementById(`address1${addressType}`).value,
        document.getElementById(`city${addressType}`).value,
        document.getElementById(`state${addressType}`).value,
        document.getElementById(`zipCode${addressType}`).value,
        document.getElementById(`country${addressType}`).value,
        document.getElementById(`phone${addressType}`).value,
        document.getElementById("emailInputText").value,
      ];
      setTempBillAddress(tempInfo);
      console.log("temp info: " + tempInfo);
      setBillButtonDisabled(false);
      handleSaveAddress("billing");
    } else if (addressType == "billing" && num2 == 0) {
      console.log(num2);
      setBillButtonDisabled(true);
      console.log("disabled bill button");
    }
  }

  function AddressComponent(props) {
    console.log(props);
    console.log(`${props.addressType}`);
    let addressType = props.addressType.toString();
    let addressTypeBilling = addressType == "billing";
    let addressTypeShipping = addressType == "shipping";
    return (
      <div
        style={{
          width: "80%",
          "max-width": "80vw",
          "background-color": "black",
          "z-index": "89",
          "box-shadow": "0px 0px 5px white",
          "margin-top": "1em",
          height: `${isLargeScreen ? "initial" : "100em"}`,
        }}
        className="centered rounded"
        id={`addressComponent${addressType}`}
      >
        <a href={`/checkout/#${addressType}`}>
          <h1>
            {props.addressType.toString().charAt(0).toUpperCase() +
              props.addressType.toString().slice(1)}{" "}
            Details
          </h1>
        </a>
        <br></br>
        <p className="subscript" style={{ fontSize: "small" }}>
          *required field
        </p>
        {addressTypeShipping && errorShipping && (
          <div className="centered">
            <h2 className="error centered">{inputErrorMessage}</h2>
          </div>
        )}
        {addressTypeBilling && errorBilling && (
          <div className="centered">
            <h2 className="error centered">{inputErrorMessage}</h2>
          </div>
        )}
        <FocusLock disabled={!focusLocked || isLargeScreen}>
          <div
            // onChange={() => {
            //   handleFocus(addressType);
            // }}
            className="addressInfoForm centered2"
            style={{
              "margin-left": `${isLargeScreen ? "auto" : "none"}`,
              "margin-right": `${isLargeScreen ? "50vw" : "none"}`,
            }}
          >
            <div className="show-for-large"></div>
            <div>
              <Flexbox
                flexDirection={isLargeScreen ? "row" : "column"}
                style={{
                  width: `${isLargeScreen ? "46vw" : "70vw"}`,
                  right: "20vw",
                }}
              >
                <span
                  style={{
                    width: `${isLargeScreen ? "23vw" : "70vw"}`,
                    display: "inline",
                    margin: "1em",
                  }}
                >
                  <h4>First Name *</h4>
                  <input
                    onClick={() => {
                      setFocusLocked(true);
                    }}
                    id={`firstName${addressType}`}
                    type="text"
                    required
                  ></input>
                </span>
                <span
                  style={{
                    width: `${isLargeScreen ? "23vw" : "70vw"}`,
                    display: "inline",
                    margin: "1em",
                  }}
                >
                  <h4>Last Name *</h4>
                  <input
                    onClick={() => {
                      setFocusLocked(true);
                    }}
                    // onClick={() => document.getElementById(`lastName${addressType}`).focus()}
                    // onClick={() => setCanResize(false)}
                    // onBlur={() => setCanResize(true)}
                    id={`lastName${addressType}`}
                    type="text"
                    required
                  ></input>
                </span>
              </Flexbox>
            </div>
            <div>
              <Flexbox
                flexDirection={isLargeScreen ? "row" : "column"}
                style={{ width: `${isLargeScreen ? "45vw" : "100vw"}` }}
              >
                <span
                  style={{
                    width: `${isLargeScreen ? "23vw" : "70vw"}`,
                    display: "inline",
                    margin: "1em",
                  }}
                >
                  <h4 className="centered">Address *</h4>

                  <input
                    onClick={() => {
                      setFocusLocked(true);
                    }}
                    // onClick={() => setCanResize(false)}
                    // onBlur={() => setCanResize(true)}
                    width={isLargeScreen ? "22vw" : "70vw"}
                    className="centered"
                    id={`address1${addressType}`}
                    type="text"
                    required
                  ></input>

                  {props.addressType == "shipping" && (
                    <div
                      className="centered"
                      style={{
                        display: "inline",
                        // "bottom": "-3.5em",
                        // "position": "absolute",
                        // "right": "30vw",
                        width: "10vw",
                      }}
                    >
                      <button
                        style={{
                          fontSize: `${isLargeScreen ? "medium" : "small"}`,
                        }}
                        className="button primary"
                        type="button"
                        onClick={() => {
                          handleAddress2(`${addressType}`);
                        }}
                      >
                        {address2ShippingButton}
                      </button>
                    </div>
                  )}
                  {props.addressType === "billing" && (
                    <div
                      className="centered"
                      style={{
                        display: "inline",
                        // "bottom": "-3.5em",
                        // "position": "absolute",
                        // "right": "30vw",
                        width: `${isLargeScreen ? "10vw" : "20vw"}`,
                      }}
                    >
                      <button
                        style={{
                          fontSize: `${isLargeScreen ? "medium" : "small"}`,
                        }}
                        className="button primary"
                        type="button"
                        onClick={() => {
                          handleAddress2(`${addressType}`);
                        }}
                      >
                        {address2BillingButton}
                      </button>
                    </div>
                  )}
                </span>
                <span
                  style={{
                    width: "20vw",
                    display: "inline",
                    margin: "1em",
                  }}
                >
                  {((address2Shipping && addressTypeShipping) ||
                    (address2Billing && addressTypeBilling)) && (
                    <div>
                      <h4 style={{ whiteSpace: "nowrap" }} width="100%">
                        Address Line 2
                      </h4>

                      <input
                        onClick={() => {
                          setFocusLocked(true);
                        }}
                        // onClick={() => setCanResize(false)}
                        // onBlur={() => setCanResize(true)}
                        style={{ width: `${isLargeScreen ? "20vw" : "70vw"}` }}
                        className="centered"
                        id={`address2${addressType}`}
                        type="text"
                      ></input>
                    </div>
                  )}
                </span>
              </Flexbox>
              <Flexbox
                flexDirection={isLargeScreen ? "row" : "column"}
                style={{ width: "100vw" }}
              >
                <span
                  style={{
                    width: "20vw",
                    display: "inline",
                    margin: "1em",
                  }}
                >
                  <h4 className="centered">City *</h4>

                  <input
                    onClick={() => {
                      setFocusLocked(true);
                    }}
                    // onClick={() => setCanResize(false)}
                    // onBlur={() => setCanResize(true)}
                    style={{ width: `${isLargeScreen ? "20vw" : "70vw"}` }}
                    className="centered"
                    id={`city${addressType}`}
                    type="text"
                    required
                  ></input>
                </span>
                <span
                  style={{
                    width: `${isLargeScreen ? "20vw" : "70vw"}`,
                    display: "inline",
                    margin: "1em",
                  }}
                >
                  <h4>Zip *</h4>
                  <input
                    onClick={() => {
                      setFocusLocked(true);
                    }}
                    // onClick={() => setCanResize(false)}
                    // onBlur={() => setCanResize(true)}
                    id={`zipCode${addressType}`}
                    type="text"
                    required
                  ></input>
                </span>
              </Flexbox>
              <Flexbox
                onClick={() => {
                  setFocusLocked(false);
                }}
                flexDirection={isLargeScreen ? "row" : "column"}
                style={{ width: "100vw" }}
              >
                <span
                  style={{
                    width: `${isLargeScreen ? "20vw" : "70vw"}`,
                    display: "inline",
                    margin: "1em",
                    height: "6em",
                  }}
                >
                  <h4 className="centered">Country *</h4>
                  <input
                    onClick={() => {
                      setFocusLocked(true);
                    }}
                    id={`country${addressType}`}
                    type="text"
                    required
                  ></input>
                </span>
                <span
                  style={{
                    width: `${isLargeScreen ? "20vw" : "70vw"}`,
                    display: "inline",
                    margin: "1em",
                  }}
                >
                  <h4>State/Province *</h4>

                  <input
                    onClick={() => {
                      setFocusLocked(true);
                    }}
                    // onClick={() => setCanResize(false)}
                    // onBlur={() => setCanResize(true)}
                    id={`state${addressType}`}
                    type="text"
                    required
                  ></input>
                </span>
              </Flexbox>
              <Flexbox
                flexDirection={isLargeScreen ? "row" : "column"}
                style={{ width: `${isLargeScreen ? "45vw" : "40vw"}` }}
              >
                <span
                  style={{
                    width: `${isLargeScreen ? "23vw" : "70vw"}`,
                    display: "inline",
                    margin: "1em",
                    marginTop: "1.3em",
                  }}
                >
                  <h4>Phone *</h4>
                  <input
                    onClick={() => {
                      setFocusLocked(true);
                    }}
                    id={`phone${addressType}`}
                    type="text"
                    required
                  ></input>
                </span>
                <span
                  style={{
                    width: `${isLargeScreen ? "23vw" : "70vw"}`,
                    display: "inline",
                    margin: "1em",
                  }}
                >
                  {showEmailInput && (
                    <span
                      className="centered"
                      style={{
                        width: "100%",
                        bottom: "2em",
                        left: `${isLargeScreen && ".5em"}`,
                      }}
                    >
                      <h3>Email *</h3>
                      <input
                        onClick={() => {
                          setFocusLocked(true);
                        }}
                        width={isLargeScreen ? "38vw" : "50vw"}
                        type="text"
                        id="emailInputText"
                      ></input>
                    </span>
                  )}
                </span>
              </Flexbox>
            </div>
          </div>
          <div
            className=" centered"
            style={{
              position: "relative",
              margin: "5em",
              float: `${isLargeScreen ? "none" : "left"}`,
              top: `${isLargeScreen ? "none" : "-5em"}`,
            }}
          >
            <Flexbox
              flexDirection="column"
              style={{
                bottom: `${isLargeScreen ? "10em" : "12em"}`,
                "max-width": "50vw",
                left: `${isLargeScreen ? "20vw" : "0vw"}`,
              }}
            >
              {addressTypeShipping && (
                <div
                  class={`${
                    isLargeScreen ? "switch centered" : "switch centered tiny"
                  }`}
                  style={{ margin: `${isLargeScreen ? "initial" : "0em"}` }}
                >
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
                      setBillingAddress(!billingAddress);
                    }}
                  ></input>
                  <label class="switch-paddle" for="sameAsBilling">
                    <span style={{ color: "white" }} class="show-for-sr">
                      Same as billing address
                    </span>
                  </label>
                </div>
              )}

              <div style={{ height: "4em" }}></div>
              <div className="hide-for-large" style={{ height: "1em" }}></div>

              {addressTypeShipping && !shipButtonDisabled && isLargeScreen && (
                <div
                  style={{
                    float: `${isLargeScreen ? "inherit" : "left"}`,
                  }}
                >
                  <button
                    type="button"
                    className="centered button primary fromRight"
                    id="saveShipping"
                    style={{
                      top: `${isLargeScreen ? "7em" : "15em"}`,
                      width: `${isLargeScreen ? "20vw" : "40vw"}`,
                      float: `${isLargeScreen ? "inherit" : "left"}`,
                      fontSize: `${isLargeScreen ? "medium" : "smaller"}`,
                      left: `${isLargeScreen ? "initial" : "2em"}`,
                    }}
                    onClick={() => {
                      handleFocus("shipping");
                      setFocusLocked(false);
                      // handleSaveAddress("shipping");
                      handleButtonsEnabled("shipping");
                      setShippingNotSet(false);
                      setShipSaveModal(true);
                      document.getElementById("shipSavedModal").style.display =
                        "initial";
                      document
                        .getElementById("shipSavedModal")
                        .setAttribute("display", "initial");
                    }}
                  >
                    {sameAsBilling ? "Save Address" : "Save Shipping"}
                  </button>
                </div>
              )}
              {addressTypeShipping && !shipButtonDisabled && !isLargeScreen && (
                <Flexbox
                  flexDirection="row"
                  style={{
                    top: "10em",
                    position: "relative",
                    whiteSpace: "nowrap",
                    right: "2em",
                  }}
                >
                  <div
                    style={{
                      float: `${isLargeScreen ? "inherit" : "left"}`,
                    }}
                  >
                    <button
                      type="button"
                      className="centered button primary fromRight"
                      id="saveShipping"
                      style={{
                        top: `${isLargeScreen ? "7em" : "15em"}`,
                        width: `${isLargeScreen ? "20vw" : "40vw"}`,
                        float: `${isLargeScreen ? "inherit" : "left"}`,
                        fontSize: `${isLargeScreen ? "medium" : "smaller"}`,
                        left: `${isLargeScreen ? "initial" : "2em"}`,
                      }}
                      onClick={() => {
                        handleFocus("shipping");
                        setFocusLocked(false);
                        // handleSaveAddress("shipping");
                        handleButtonsEnabled("shipping");
                        setShippingNotSet(false);
                        setShipSaveModal(true);
                        if (document.getElementById("shipSavedModal")) {
                          document.getElementById(
                            "shipSavedModal"
                          ).style.display = "initial";
                          document
                            .getElementById("shipSavedModal")
                            .setAttribute("display", "initial");
                        }
                      }}
                    >
                      {sameAsBilling ? "Save Address" : "Save Shipping"}
                    </button>
                  </div>
                  {/* <div className="shadowed">
                                        <button
                                            // style={{
                                            //     "right": `${isLargeScreen ? "-8vw" : "40vw"}`,
                                            //     "top": `${isLargeScreen ? "-9em" : "135em"}`,
                                            //     // "bottom": `${isLargeScreen ? "inherit" : "20em"}`,
                                            //     "fontSize": `${isLargeScreen ? "medium" : "small"}`,
                                            //     "position": `${isLargeScreen ? "relative" : ""}`,
                                            //     "left": `${isLargeScreen ? "initial" : "11em"}`
                                            // }}
                                            id='shipNextButton'
                                            className="button primary narrowed centered"
                                            disabled={shipNextDisabled}
                                            type="button" onClick={() => { handleProgressShipAddress() }}>Next</button>
                                    </div> */}
                </Flexbox>
              )}
              {addressTypeShipping && shipButtonDisabled && isLargeScreen && (
                <div
                  style={{
                    float: `${isLargeScreen ? "inherit" : "left"}`,
                  }}
                >
                  <span
                    data-tooltip
                    class="has-tip top"
                    tabindex="2"
                    title="Make sure to complete all required fields."
                  >
                    <button
                      style={{
                        top: `${isLargeScreen ? "7em" : "15em"}`,
                        width: `${isLargeScreen ? "20vw" : "40vw"}`,
                        float: `${isLargeScreen ? "inherit" : "left"}`,
                        fontSize: `${isLargeScreen ? "medium" : "smaller"}`,
                        left: `${isLargeScreen ? "initial" : "2em"}`,
                      }}
                      type="button"
                      className="centered button primary fromRight"
                      id="saveShipping"
                      style={{ top: "7em" }}
                      onClick={() => {
                        handleFocus("shipping");
                        setFocusLocked(false);
                        // handleSaveAddress("shipping");
                        handleButtonsEnabled("shipping");
                        setShippingNotSet(false);
                        // setShipSaveModal(true);
                      }}
                    >
                      {sameAsBilling ? "Save Address" : "Save Shipping"}
                    </button>
                  </span>
                </div>
              )}
              {addressTypeShipping && shipButtonDisabled && !isLargeScreen && (
                <Flexbox flexDirection="row">
                  <div
                    style={{
                      float: `${isLargeScreen ? "inherit" : "left"}`,
                    }}
                  >
                    <span
                      data-tooltip
                      class="has-tip top"
                      tabindex="2"
                      title="Make sure to complete all required fields."
                    >
                      <button
                        style={{
                          top: `${isLargeScreen ? "7em" : "15em"}`,
                          width: `${isLargeScreen ? "20vw" : "40vw"}`,
                          float: `${isLargeScreen ? "inherit" : "left"}`,
                          fontSize: `${isLargeScreen ? "medium" : "smaller"}`,
                          left: `${isLargeScreen ? "initial" : "2em"}`,
                        }}
                        type="button"
                        className="centered button primary fromRight"
                        id="saveShipping"
                        style={{ top: "7em" }}
                        onClick={() => {
                          handleFocus("shipping");
                          setFocusLocked(false);
                          // handleSaveAddress("shipping");
                          handleButtonsEnabled("shipping");
                          setShippingNotSet(false);
                          // setShipSaveModal(true);
                        }}
                      >
                        {sameAsBilling ? "Save Address" : "Save Shipping"}
                      </button>
                    </span>
                  </div>
                  {/* <div className="shadowed">
                                        <button
                                            // style={{
                                            //     "right": `${isLargeScreen ? "-8vw" : "40vw"}`,
                                            //     "top": `${isLargeScreen ? "-9em" : "135em"}`,
                                            //     // "bottom": `${isLargeScreen ? "inherit" : "20em"}`,
                                            //     "fontSize": `${isLargeScreen ? "medium" : "small"}`,
                                            //     "position": `${isLargeScreen ? "relative" : ""}`,
                                            //     "left": `${isLargeScreen ? "initial" : "11em"}`
                                            // }}
                                            id='shipNextButton'
                                            className="button primary narrowed centered"
                                            disabled={shipNextDisabled}
                                            type="button" onClick={() => { handleProgressShipAddress() }}>Next</button>
                                    </div> */}
                </Flexbox>
              )}
              {addressTypeBilling && !billButtonDisabled && (
                <button
                  id="saveBilling"
                  type="button"
                  style={{
                    top: `${isLargeScreen ? "0em" : "10em"}`,
                    width: `${isLargeScreen ? "20vw" : "40vw"}`,
                    fontSize: `${isLargeScreen ? "medium" : "smaller"}`,
                    left: `${isLargeScreen ? "9em" : "2em"}`,
                    position: `${isLargeScreen ? "relative" : ""}`,
                  }}
                  className="centered button primary fromRight"
                  onClick={() => {
                    handleFocus("billing");
                    setFocusLocked(false);
                    handleButtonsEnabled("billing");
                    setShipSaveModal(true);
                    document.getElementById("shipSavedModal").style.display =
                      "initial";
                  }}
                >
                  Save Billing
                </button>
              )}
              {addressTypeBilling && billButtonDisabled && (
                <span
                  data-tooltip
                  class="has-tip top"
                  tabindex="2"
                  title="Make sure to complete all required fields."
                >
                  <button
                    style={{
                      top: `${isLargeScreen ? "7em" : "10em"}`,
                      width: `${isLargeScreen ? "20vw" : "40vw"}`,
                      left: `${isLargeScreen ? "initial" : "2em"}`,
                    }}
                    id="saveBilling"
                    type="button"
                    style={{ top: "7em" }}
                    className="centered button primary fromRight"
                    onClick={() => {
                      handleFocus("billing");
                      handleSaveAddress("billing");
                      handleButtonsEnabled("billing");
                      setFocusLocked(false);
                    }}
                  >
                    {shippingSaved && "✅"} Save Billing
                  </button>
                </span>
              )}

              {((`${addressType}` == "shipping" && shippingSaved) ||
                (`${addressType}` == "billing" && billingSaved)) && (
                <div
                  style={{
                    position: "relative",
                    float: "right",
                    bottom: "4em",
                  }}
                >
                  <div
                    className="addressModal"
                    id="shipSavedModal"
                    style={{
                      top: `${isLargeScreen ? "16.5vw" : "65vw"}`,
                      left: `${isLargeScreen ? "30vw" : "5vw"}`,
                      display: `${shipSaveModal ? "initial" : "none"}`,
                      "box-shadow": "0px 0px 5px white",
                      zIndex: "99",
                    }}
                  >
                    <button
                      onClick={() => {
                        setShipSaveModal(false);
                      }}
                      class="close-button"
                    >
                      X
                    </button>
                    <span
                      id="saveShipAddressCheck"
                      style={{
                        zIndex: "96",
                        // "left": "24vw",
                        // "top": `${addressType == "shipping" ?
                        //     (document.getElementById('saveShipping')c + 20)
                        //     : (document.getElementById('saveBilling').getBoundingClientRect().top + window.scrollY + 20)}`,
                        position: "relative",
                      }}
                    >
                      <Checkmark
                        className="centered"
                        color="#3adb76"
                        size="large"
                      />
                    </span>
                    <span
                      className="centered shadow"
                      style={{
                        "max-width": "50vw",
                        // "background-color": "black",
                        "max-height": "4em",
                        left: "24vw",
                      }}
                    >
                      <p
                        style={{
                          "max-width": "200vw",
                          fontSize: "small",
                          margin: "1em",
                        }}
                      >
                        Your address has been saved.
                      </p>
                    </span>
                    {`${addressType}` == "shipping" ? (
                      <button
                        type="button"
                        className="functionalModalButton button primary"
                        id="shipSaveModalButton"
                        style={{ width: "5em" }}
                        onClick={() => {
                          setShipSaveModal(false);
                          handleProgressShipAddress();
                          // modalExecute();
                          // turnOffModal()
                        }}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="functionalModalButton button primary"
                        id="shipSaveModalButton"
                        style={{ width: "5em" }}
                        onClick={() => {
                          setShipSaveModal(false);
                          setTabIndex(3);
                          // modalExecute();
                          // turnOffModal()
                        }}
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              )}
              <div className="hide-for-large" style={{ height: "7em" }}></div>
            </Flexbox>
          </div>
        </FocusLock>
      </div>
    );
  }

  const [undefinedAddress, setUndefinedAddress] = useState(false);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.prevAddressShipping) {
        if (userInfo.prevAddressShipping[0] === undefined) {
          setUndefinedAddress(true);
        }
      }
    }
    if (!userInfo.prevAddressShipping) {
      setUndefinedAddress(true);
    }
  }, []);

  const [displayAddressCheckmark, setDisplayAddressCheckmark] = useState(false);

  useEffect(() => {
    let checkmark = document.getElementById("displayAddressCheckmark");

    if (eachLoaded && checkmark) {
      if (displayAddressCheckmark) {
        checkmark.style.visibility = "visible";
        checkmark.setAttribute("visibility", "visible");
      } else {
        checkmark.style.visibility = "hidden";
        checkmark.setAttribute("visibility", "hidden");
      }
    }
  }, [displayAddressCheckmark]);

  /////////////////
  ///////////////////
  /////////////////////

  // const [showSavedAddress, setShowSavedAddress] = useState("none")

  // function showPrevAddress() {

  //     if (!(userInfo.prevAddressShipping && !undefinedAddress)) {
  //         setShowSavedAddress("none")
  //     } else {
  //         setShowSavedAddress("initial")
  //     }

  // }

  // function showPrevAddress() {

  //     if (!(userInfo.prevAddressShipping && !undefinedAddress)) {
  //         setShowSavedAddress("none")
  //     } else {
  //         setShowSavedAddress("initial")
  //     }

  // }

  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (!(userInfo.prevAddressShipping && !undefinedAddress)) {
      setTabIndex(1);
    }
  }, [userInfo, undefinedAddress]);

  useEffect(() => {
    window.scrollTo(
      0,
      document.getElementById("headerHeight").getBoundingClientRect().top +
        window.scrollY
    );
  }, [tabIndex]);

  function handleProgressPrevAddress() {
    if (!usePrevShipping) {
      setTabIndex(1);
    } else {
      setTabIndex(3);
    }
  }
  function handleProgressShipAddress() {
    if (billingAddress) {
      setTabIndex(2);
    } else {
      setTabIndex(3);
    }
  }

  const [prevNextDisabled, setPrevNextDisabled] = useState(true);
  const [shipNextDisabled, setShipNextDisabled] = useState(true);
  const [billNextDisabled, setBillNextDisabled] = useState(true);

  const [directionString, setDirectionString] = useState("row");

  useEffect(() => {
    if (isLargeScreen) {
      setDirectionString("row");
    } else {
      setDirectionString("column");
    }
  }, [isLargeScreen]);

  if (addressHandled) {
    return (
      <div>
        <nav className="darkNav" aria-label="You are here:" role="navigation">
          <ul class="breadcrumbs">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <Link to="/checkout">Checkout</Link>
            </li>
            <li>
              <span class="show-for-sr">Current: Checkout</span>
            </li>
          </ul>
        </nav>
        <div className="centered">
          <Tabs
            defaultIndex={userInfo.prevAddressShipping ? 0 : 1}
            selectedIndex={tabIndex}
            onSelect={(tabIndex) => setTabIndex(tabIndex)}
          >
            <TabList>
              <Tab
                hidden={!(userInfo.prevAddressShipping && !undefinedAddress)}
                id="tabSavedAddress"
                disabled={!(userInfo.prevAddressShipping && !undefinedAddress)}
              >
                Saved Address
              </Tab>
              <Tab
                id="tabShippingAddress"
                hidden={!(displayAddressForm || undefinedAddress)}
                disabled={!(displayAddressForm || undefinedAddress)}
              >
                Shipping
              </Tab>
              <Tab
                id="tabBillingAddress"
                hidden={!billingAddress}
                disabled={!billingAddress}
              >
                Billing
              </Tab>
              <Tab
                id="tabPayment"
                hidden={!shippingSelected}
                disabled={
                  !shippingSelected ||
                  shipButtonDisabled ||
                  billButtonDisabled ||
                  shippingNotSet
                }
              >
                Payment
              </Tab>
              {/* <Tab disabled={!orderComplete}>Done</Tab> */}
            </TabList>

            <TabPanel>
              {userInfo.prevAddressShipping && !undefinedAddress && (
                <div class="form-row text-align-left">
                  <div className="prevShipping">
                    {userInfo.prevAddressShipping[0] && (
                      <div
                        className="rounded"
                        style={{
                          //   "background-color": "black",
                          "box-shadow": "0px 0px 5px white",
                          right: "10vw",
                          fontSize: `${isLargeScreen ? "medium" : "small"}`,
                        }}
                      >
                        <h4 id="shipToPrev">Ship to address on file?</h4>

                        <span
                          style={{
                            maxWidth: "30vw",
                            textAlign: "left",
                          }}
                        >
                          <p>
                            Name:{" "}
                            {`${userInfo.prevAddressShipping[0]} ${userInfo.prevAddressShipping[1]}`}
                          </p>
                          <p>Address: {`${userInfo.prevAddressShipping[3]}`}</p>
                          <p>City: {`${userInfo.prevAddressShipping[5]}`}</p>
                          <p>State: {`${userInfo.prevAddressShipping[6]}`}</p>
                          <p>Zip: {`${userInfo.prevAddressShipping[7]}`}</p>
                          <p>Email: {`${userInfo.prevAddressShipping[8]}`}</p>
                        </span>
                        <span>
                          <div id="displayAddressCheckmark"></div>
                        </span>
                        <div
                          style={{
                            height: `${isLargeScreen ? "initial" : "4em"}`,
                          }}
                        >
                          <div
                            style={{
                              float: `${isLargeScreen ? "none" : "left"}`,
                              top: `${isLargeScreen ? "" : "7em"}`,
                            }}
                          >
                            <button
                              className="button primary"
                              type="button"
                              onClick={() => {
                                handleUsePrevAddress(true);
                                setDisplayAddressCheckmark(true);
                                setPrevNextDisabled(false);
                                setShippingNotSet(false);
                              }}
                              selected
                            >
                              Yes
                            </button>
                            <button
                              className="button primary"
                              type="button"
                              onClick={() => {
                                handleUsePrevAddress(false);
                                setBillingSaved(false);
                                setShippingSaved(false);
                                setDisplayAddressCheckmark(false);
                                setTabIndex(1);
                              }}
                            >
                              New Address
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {displayAddressCheckmark &&
                      userInfo.prevAddressShipping[0] && (
                        <div
                          className="addressModal"
                          style={{
                            top: `${isLargeScreen ? "16.5vw" : "65vw"}`,
                            left: `${isLargeScreen ? "30vw" : "0vw"}`,
                          }}
                        >
                          <Checkmark
                            className="centered narrowed3"
                            color="#3adb76"
                            size="large"
                            style={{
                              top: `${isLargeScreen ? "5em" : "2em"}`,
                              position: `${isLargeScreen && "absolute"}`,
                            }}
                          />
                          <p>Shipping to your previous address.</p>
                          <button
                            className="button primary"
                            onClick={() => {
                              handleProgressPrevAddress();
                              setDisplayAddressCheckmark(false);
                            }}
                          >
                            Next
                          </button>
                        </div>
                      )}
                    {userInfo.prevAddressShipping &&
                      userInfo.prevAddressShipping[0] !== undefined && (
                        <div
                          class="switch"
                          style={{
                            position: "absolute",
                            left: "75vw",
                            top: `${isLargeScreen ? "26.5em" : "28em"}`,
                          }}
                        >
                          <p>Same as Billing Address</p>
                          <input
                            name="keepMeSignedIn"
                            class="switch-input"
                            type="checkbox"
                            id="usePrevBilling"
                            style={{
                              bottom: "20em",
                              left: "20vw",
                            }}
                            checked={sameAsBilling}
                            onClick={() => {
                              setSameAsBilling(!sameAsBilling);
                              setUsePrevBilling(!usePrevBilling);
                              setBillingAddress(!billingAddress);
                            }}
                          ></input>
                          <label class="switch-paddle" for="usePrevBilling">
                            <span
                              style={{ color: "white" }}
                              class="show-for-sr"
                            >
                              Same as billing address
                            </span>
                          </label>
                        </div>
                      )}

                    <div id="shippingInput"></div>
                  </div>
                </div>
              )}
              <div className="centered">
                {spinnerDisplayed && (
                  <div className="centered shadowed">
                    <div className="loader"></div>
                  </div>
                )}
                <div
                  style={{
                    bottom: `${isLargeScreen ? "44em" : "44em"}`,
                    position: "relative",
                  }}
                >
                  <button
                    left={`${!isLargeScreen && "5em"}`}
                    id="prevNextButton"
                    className={`button primary ${
                      isLargeScreen ? "narrowed4" : "narrowed5"
                    }`}
                    disabled={prevNextDisabled}
                    type="button"
                    onClick={() => {
                      handleProgressPrevAddress();
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              {(displayAddressForm || undefinedAddress) && (
                <AddressComponent
                  addressType="shipping"
                  style={{ right: "10vw" }}
                />
              )}
              <div className="shadowed bottomed">
                <button
                  style={{
                    right: `${isLargeScreen ? "-8vw" : "40vw"}`,
                    top: `${isLargeScreen ? "-9em" : "135em"}`,
                    // "bottom": `${isLargeScreen ? "inherit" : "20em"}`,
                    fontSize: `${isLargeScreen ? "medium" : "small"}`,
                    position: `${isLargeScreen ? "relative" : ""}`,
                    left: `${isLargeScreen ? "initial" : "11em"}`,
                    display: `${isLargeScreen ? "initial" : "none"}`,
                  }}
                  id="shipNextButton"
                  className="button primary narrowed centered"
                  disabled={shipNextDisabled}
                  type="button"
                  onClick={() => {
                    handleProgressShipAddress();
                  }}
                >
                  Next
                </button>
              </div>
            </TabPanel>
            <TabPanel>
              {billingAddress && (
                <AddressComponent
                  addressType="billing"
                  style={{ right: "10vw" }}
                />
              )}
              <div className="shadowed bottomed">
                <button
                  style={{
                    right: `${isLargeScreen ? "-8vw" : "10vw"}`,
                    top: `${isLargeScreen ? "-9em" : "135em"}`,
                    fontSize: `${isLargeScreen ? "medium" : "small"}`,
                    position: `${isLargeScreen ? "relative" : ""}`,
                    left: `${isLargeScreen ? "initial" : "11em"}`,
                  }}
                  id="billNextButton"
                  className="button primary narrowed centered3"
                  disabled={billNextDisabled}
                  type="button"
                  onClick={() => {
                    setTabIndex(3);
                  }}
                >
                  Next
                </button>
              </div>
            </TabPanel>
            <TabPanel>
              <div
                className="centered rounded"
                style={{
                  "background-color": "black",
                  "box-shadow": "0px 0px 5px white",
                  width: "90%",
                  height: `${isLargeScreen ? "initial" : "1100px"}`,
                  position: `${isLargeScreen ? "initial" : "relative"}`,
                }}
              >
                <div
                  style={{
                    textAlign: "left",
                    height: `${isLargeScreen ? "initial" : "120%"}`,
                  }}
                  className="costSummary centered"
                >
                  <Flexbox flexDirection={isLargeScreen ? "row" : "column"}>
                    <span>
                      <span
                        className="shadowed"
                        style={{
                          maxWidth: `${isLargeScreen ? "33vw" : "90vw"}`,
                          // "width": `${isLargeScreen ? "33vw" : "90vw"}`,
                          minWidth: "20vw",
                          textAlign: "left",
                          display: "inline-block",
                          marginRight: `${isLargeScreen ? "10vw" : ""}`,
                        }}
                      >
                        {tempShipAddress && tempShipAddress[0] !== undefined && (
                          <div>
                            <h4>Shipping to...</h4>
                            <p>
                              Name:
                              {`${tempShipAddress[0]} ${tempShipAddress[1]}`}
                            </p>
                            <p>Address: {`${tempShipAddress[2]}`}</p>
                            <p>City: {`${tempShipAddress[3]}`}</p>
                            <p>State: {`${tempShipAddress[4]}`}</p>
                            <p>Zip: {`${tempShipAddress[5]}`}</p>
                            {tempShipAddress[6] !== "United States" && (
                              <p>Country: {`${tempShipAddress[6]}`}</p>
                            )}
                            <p>Phone: {`${tempShipAddress[7]}`}</p>
                            <p>Email: {`${tempShipAddress[8]}`}</p>
                          </div>
                        )}
                        {userInfo.prevAddressShipping && !tempShipAddress && (
                          <div>
                            <h4>Shipping to...</h4>
                            <p>
                              Name:
                              {`${userInfo.prevAddressShipping[0]} ${userInfo.prevAddressShipping[1]}`}
                            </p>
                            <p>
                              Address: {`${userInfo.prevAddressShipping[3]}`}
                            </p>
                            <p>City: {`${userInfo.prevAddressShipping[5]}`}</p>
                            <p>State: {`${userInfo.prevAddressShipping[6]}`}</p>
                            <p>Zip: {`${userInfo.prevAddressShipping[7]}`}</p>
                            <p>Phone: {`${userInfo.prevAddressShipping[8]}`}</p>
                            <p>Email: {userEmail}</p>
                          </div>
                        )}
                        {userInfo.prevAddressShipping &&
                          tempShipAddress &&
                          tempShipAddress[0] == undefined && (
                            <div>
                              <h4>Shipping to...</h4>
                              <p>
                                Name:{" "}
                                {`${userInfo.prevAddressShipping[0]} ${userInfo.prevAddressShipping[1]}`}
                              </p>
                              <p>
                                Address: {`${userInfo.prevAddressShipping[3]}`}
                              </p>
                              <p>
                                City: {`${userInfo.prevAddressShipping[5]}`}
                              </p>
                              <p>
                                State: {`${userInfo.prevAddressShipping[6]}`}
                              </p>
                              <p>Zip: {`${userInfo.prevAddressShipping[7]}`}</p>
                              <p>
                                Phone: {`${userInfo.prevAddressShipping[8]}`}
                              </p>
                              <p>Email: {userEmail}</p>
                            </div>
                          )}
                      </span>
                    </span>
                    {isLargeScreen && <div width="100%"></div>}
                    <Flexbox
                      flexDirection="column"
                      style={{ marginRight: `${isLargeScreen ? "10vw" : ""}` }}
                    >
                      <span
                        className="shadowed"
                        style={{
                          maxWidth: `${isLargeScreen ? "29vw" : "90vw"}`,
                          // "width": `${isLargeScreen ? "33vw" : "90vw"}`
                        }}
                      >
                        <div className="table-scroll graded">
                          <table>
                            <ShippingItemList />
                          </table>
                        </div>
                      </span>
                      <span style={{ "white-space": "nowrap" }}>
                        <p>Shipping Included</p>
                        <p>Tax Included</p>
                        <h4
                          style={{
                            // "background-color": "#565759",
                            "background-color": "#1779ba",
                            padding: ".25em",
                            "border-radius": "13px",
                          }}
                        >
                          Total: ${Number(totalCost / 100).toFixed(2)}
                        </h4>
                      </span>
                    </Flexbox>
                    {isLargeScreen && <div width="100%"></div>}
                    {shippingSelected && (
                      <div className={!isLargeScreen && "centered"}>
                        <textarea
                          style={{
                            maxWidth: `${isLargeScreen ? "25vw" : "75vw"}`,
                            top: `${isLargeScreen ? "-10em" : ""}`,
                          }}
                          id="checkoutNote"
                          rows="4"
                          cols="50"
                          maxlength="150"
                          placeholder="(Optional) Special instructions for your order? 150 character limit"
                        ></textarea>
                        <Flexbox flexDirection="column">
                          <Flexbox
                            flexDirection="row"
                            className="centered"
                            style={{
                              position: "relative",
                              left: "10%",
                              top: "7em",
                              marginBottom: "-3em",
                            }}
                          >
                            <img
                              name="visa"
                              width="12%"
                              style={{ margin: ".5em" }}
                              height="auto"
                              src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/visa.png?alt=media&token=bbe2f764-b4ad-4dca-97ce-2497988fef46"
                            />
                            <img
                              name="mc"
                              width="12%"
                              style={{ margin: ".5em" }}
                              height="auto"
                              src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/mc.png?alt=media&token=3431d284-fc2e-4c99-ad50-aa837d7da85c"
                            />
                            <img
                              name="amex"
                              width="12%"
                              style={{ margin: ".5em" }}
                              height="auto"
                              src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/amex.png?alt=media&token=f957ce2c-720d-4cc0-b67e-4bd51082d878"
                            />
                            <img
                              name="disc"
                              width="12%"
                              style={{ margin: ".5em" }}
                              height="auto"
                              src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/disc.png?alt=media&token=782acf6e-58a9-4730-8d91-e87bbc6f6694"
                            />
                            <img
                              name="paypal"
                              width="12%"
                              style={{ margin: ".5em" }}
                              height="auto"
                              src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/paypal.png?alt=media&token=ffed4d97-5301-406a-a207-5fb65b1e6299"
                            />
                          </Flexbox>
                          <button
                            disabled={!enterPaymentAllowed}
                            className="centered button primary"
                            style={{
                              top: `${isLargeScreen ? "10em" : "10em"}`,
                              width: `${isLargeScreen ? "100%" : "100%"}`,
                              // "position": `${isLargeScreen ? "relative" : ""}`,
                              position: "relative",
                              fontSize: "large",
                            }}
                            type="button"
                            onClick={() => {
                              displayStripe();
                              saveEmail();
                            }}
                          >
                            Enter Payment Info
                          </button>
                        </Flexbox>
                      </div>
                    )}
                  </Flexbox>
                </div>
                {stripeDisplayed && (
                  <div
                    className="centered4"
                    style={{
                      width: `${isLargeScreen ? "50%" : " 110%"}`,
                      "background-color": "black",
                      "box-shadow": "0px 0px 5px white",
                    }}
                  >
                    <div
                      className={`${isLargeScreen ? "centered" : "centered4"}`}
                      style={{
                        width: "35vw",
                      }}
                    >
                      <Checkout />
                      {/* <PayPalButton
                                                clientId="AQa6_jLL-SRpzQ2ZZdAhqBdnMQy80zfB7pHTO_URcvNcWqV3wjkCOuO9DHFNqRMYU6_vhHGEtC8wqFFJ"
                                                amount={`${payPalCost}`}
                                                currency="USD"
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

                                                                updateDatabaseOrders(item)
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
                                                }} /> */}
                    </div>
                  </div>
                )}
                {payPalSuccess && (
                  <Flexbox flexDirection={isLargeScreen ? "row" : "column"}>
                    <Checkmark
                      size="large"
                      className="centered"
                      color="#3adb76"
                    />
                    <div className="centered">
                      <h4>Your Exchange Order is Complete!</h4>
                      <p>Items Exchanged: {itemsPurchased}</p>
                      <p>
                        Store Credit Used: $
                        {(lastExchangeOrderCreditUsed / 100).toFixed(2)}
                      </p>
                      <p>
                        Receipt email: {receiptEmail || userEmail.toString()}
                      </p>
                      <p>Estimated Arrival Date: {deliverDate.toString()}</p>
                      <p>Your Order Confirmation ID is {orderString}</p>
                      <br></br>
                      <Link to="/shop">
                        <button type="button">Continue Shopping</button>
                      </Link>
                    </div>
                  </Flexbox>
                )}
                {payPalFailure && (
                  <div>
                    <h2
                      style={{
                        color: "red",
                      }}
                    >
                      There was an error processing your payment. You have not
                      been charged.
                    </h2>
                  </div>
                )}
              </div>
            </TabPanel>
          </Tabs>
        </div>
        <br></br>
        <nav
          className="darkNav"
          aria-label="You are here:"
          role="navigation"
          onLoad={() => {
            setEachLoaded(true);
          }}
        >
          <ul class="breadcrumbs">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <Link to="/checkout">Checkout</Link>
            </li>
            <li>
              <span class="show-for-sr">Current: Checkout</span>
            </li>
          </ul>
        </nav>
      </div>
    );
  } else {
    return (
      <div>
        <h3>One Moment Please...</h3>
        <div
          className="loader"
          style={{ left: "40w", position: "relative" }}
        ></div>
      </div>
    );
  }
}
//////////////////////////////////////////////

export default ShippingComponent;
