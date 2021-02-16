import React, { useState, useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import firebase from "firebase";
import { Context } from "./Context";
import magnificent from "magnificent";
import Flexbox from "flexbox-react";
import ContentLoader, { Facebook } from "react-content-loader";
import RecentlyViewed from "./RecentlyViewed";
import PreloadImage from "react-preload-image";
// import { Lines } from "react-preloaders"

function FullSets() {
  const {
    wishlistItems,
    setWishlistItems,
    cartInfo,
    setCartInfo,
    addToWishlist,
    addToCart,
    removeFromWishlist,
    allProducts,
    modifyCartCount,
    modifyTotalPrice,
    modifyWishlistCount,
    itemList,
    productPageComponent,
    setProductPageComponent,
    fullSetCategory,
    activateAddToWishlistModal,
    productOnPageCount,
    setProductOnPageCount,
    setOnCheckout,
    setCategorySearch,
    displayNumber,
    setTermsDisplay,
    allNumber,
    itemString,
    activateRemoveFromWishlistModal,
    setOnProductPage,
    isLargeScreen,
    isSmallScreen,
  } = useContext(Context);

  useEffect(() => {
    setProductOnPageCount(0);
    document.getElementById("firebaseui-auth-container").style.display = "none";
    setOnCheckout(false);
    setCategorySearch("fullSet");

    // document.getElementById('smallSearch').style.display = "inline-block"
    // document.getElementById('largeSearch').style.display = "initial"
  }, []);

  function handleProductComponent(item) {
    console.log(productPageComponent);
    setProductPageComponent(item);
    console.log(productPageComponent);
  }

  const [sets, setSets] = useState([]);

  useEffect(() => {
    const setNames = fullSetCategory.map((item) => {
      return item[0];
    });
    setSets(setNames);
  }, [fullSetCategory]);

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

  useEffect(() => {
    setTermsDisplay(false);
    document.getElementById("firebaseui-auth-container").style.display = "none";
  }, []);

  /////////////  added
  /////////    code
  //////  section

  let emptyHeartSource =
    "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/heart%20transparent.svg?alt=media&token=812d1dc3-3a82-4527-8551-63d3941fc5c4";
  let filledHeartSource =
    "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/heart%20pinkers.svg?alt=media&token=48f11612-1d2f-4564-8625-4c0821c9df4c";

  function handleHideHeart(itemName) {
    let heartIcon = document.getElementById(`heartIcon${itemName}`);

    if (heartIcon.src == emptyHeartSource) {
      heartIcon.style.display = "none";
      heartIcon.setAttribute("display", "none");
    }
  }

  function handleShowHeart(itemName) {
    let heartIcon = document.getElementById(`heartIcon${itemName}`);

    if (heartIcon.src === emptyHeartSource) {
      heartIcon.style.display = "initial";
      heartIcon.setAttribute("display", "initial");
    }
  }

  function handleWishlist(count, item) {
    let putBackItem = [
      item[0],
      [],
      Number(item[2]) / 100,
      [],
      [],
      `${item[1]}`,
    ];

    if (count > 0) {
      removeFromWishlist(item[0]);
      activateRemoveFromWishlistModal(putBackItem);
      modifyWishlistCount(-1);
    } else {
      addToWishlist(item);
      activateAddToWishlistModal(item[0]);
      modifyWishlistCount(1);
    }
  }

  useEffect(() => {
    window.scroll(0, 100);

    setOnProductPage(false);
  }, []);

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
            <Link to="/shop">Shop</Link>
          </li>
          <li>
            <Link to="/shop/full-sets">Sets</Link>
          </li>
          <li>
            <span class="show-for-sr">Current: Sets</span>
          </li>
        </ul>
      </nav>
      <div
        className="shadowed"
        style={
          {
            // "background-color": "black",
            // "box-shadow": "0px 0px 5px white",
          }
        }
      >
        <h2>Sets</h2>
        <br></br>
        {displayNumber && (
          <p
            style={{
              "background-color": "#565759",
              padding: ".25em",
              "border-radius": "13px",
              width: `${isLargeScreen ? "30%" : "90%"}`,
              zIndex: "86",
              left: `${isLargeScreen ? "35vw" : "5vw"}`,
              position: "relative",
              whiteSpace: "nowrap",
            }}
          >
            {allNumber > 0 && allNumber} {itemString}
          </p>
        )}
        {fullSetCategory.map((item) => {
          let refString = item[1].toString();
          // console.log(allProducts)
          console.log(fullSetCategory);
          console.log(item);
          console.log(item[0]);
          console.log(refString);

          // storageRef.child(refString).getDownloadURL().then(function (url) {
          //     return item.push(url)
          // })
          // make sure to always reference this with the last element in the array.
          // currently it will be 5

          let productInWishlistArray = wishlistItems.filter((i) =>
            i.includes(item[0])
          );
          let productInCartArray = itemList.filter((i) => i.includes(item[0]));

          let productPageLinkString = item[0].split(" ").join("-");

          let numberInCart = itemList.filter((i) => i[0] == item[0]);
          let numInCart = numberInCart.length;
          let bestseller = item[11];

          let posArray = [];
          let emptyString = "";

          let sale = item[12];

          return (
            <div className="column shadowed" style={{ maxHeight: "830px" }}>
              <div className="productCard">
                <div class="img-responsive">
                  <div
                    className="paisley"
                    id={`contentLoader${sets.indexOf(item[0])}`}
                    style={{ position: "absolute" }}
                  >
                    <ContentLoader
                      backgroundColor="white"
                      animate={false}
                      style={{
                        borderRadius: "25px",
                        position: "relative",
                        height: `${!isSmallScreen ? "25vw" : "500px"}`,
                        width: `${!isSmallScreen ? "15vw" : "70vw"}`,
                        margin: "0 auto",
                        left: `${!isSmallScreen ? "4.5vw" : "15vw"}`,
                      }}
                      onLoad={() => {
                        document.getElementById(
                          `spinner${item[0]}`
                        ).style.visibility = "visible";
                        document
                          .getElementById(`spinner${item[0]}`)
                          .setAttribute("visibility", "visible");
                      }}
                    >
                      <rect
                        style={{
                          "background-Color": "white",
                          zIndex: "85",
                          borderRadius: "25px",
                        }}
                        x="0"
                        y="0"
                        rx="5"
                        ry="5"
                        width="400"
                        height="500"
                      />

                      <rect
                        x="80"
                        y="17"
                        rx="4"
                        ry="4"
                        width="300"
                        height="13"
                      />
                      <rect
                        x="80"
                        y="40"
                        rx="3"
                        ry="3"
                        width="250"
                        height="10"
                      />
                    </ContentLoader>
                    <div
                      id={`spinner${item[0]}`}
                      style={{
                        position: "relative",
                        top: `${!isSmallScreen ? "-14vw" : "-60vw"}`,
                        zIndex: "86",
                        visibility: "none",
                        width: `${!isSmallScreen ? "6vw" : "20vw"}`,
                        height: `${!isSmallScreen ? "6vw" : "20vw"}`,
                        left: `${!isSmallScreen ? "4.5vw" : "15vw"}`,
                      }}
                      className="loader centered"
                    ></div>
                  </div>
                  <div
                    onMouseOver={() => {
                      handleShowHeart(`${item[0]}`);
                    }}
                    onMouseOut={() => {
                      handleHideHeart(`${item[0]}`);
                    }}
                    className="fullSets"
                    id={`fullSets${item[0].toUpperCase()}`}
                  >
                    {bestseller && (
                      <span
                        class="label warning"
                        style={{
                          color: "white",
                          top: `${posArray[1] ? posArray[0] : emptyString}`,
                          left: `${posArray[1] ? posArray[1] : emptyString}`,
                          position: "absolute",
                        }}
                      >
                        Bestseller
                      </span>
                    )}
                    <img
                      alt=""
                      onClick={() => {
                        handleWishlist(productInWishlistArray.length, item);
                      }}
                      id={`heartIcon${item[0]}`}
                      style={{
                        top: `${posArray[1] ? posArray[0] : emptyString}`,
                        marginLeft: "20vw",
                        // "left": `${(rightArray[0]) ? rightArray[0] : emptyString}`,
                        // "left": "4em",
                        display: `${
                          productInWishlistArray.length > 0 && !isSmallScreen
                            ? "initial"
                            : "none"
                        }`,
                        position: "absolute",
                      }}
                      width={`${isLargeScreen ? "3%" : "3%"}`}
                      height="auto"
                      src={`${
                        productInWishlistArray.length > 0
                          ? filledHeartSource
                          : emptyHeartSource
                      }`}
                    />

                    <Link to={`/product/${productPageLinkString}`}>
                      <img
                        alt=""
                        style={{ visibility: "hidden" }}
                        id={`${item[0]}`}
                        width="100%"
                        height="auto"
                        onLoad={() => {
                          posArray.push(
                            document
                              .getElementById(`${item[0]}`)
                              .getBoundingClientRect().top + window.scrollY
                          );
                          posArray.push(
                            document
                              .getElementById(`${item[0]}`)
                              .getBoundingClientRect().left
                          );
                          document.getElementById(
                            `contentLoader${sets.indexOf(item[0])}`
                          ).style.display = "none";

                          document
                            .getElementById(
                              `contentLoader${sets.indexOf(item[0])}`
                            )
                            .setAttribute("display", "none");
                          document.getElementById(
                            `${item[0]}`
                          ).style.visibility = "visible";
                        }}
                        src={item[5]}
                      ></img>
                    </Link>
                    <Link to={`/product/${productPageLinkString}`}>
                      <h2 class="text-decoration-none">{item[0]}</h2>
                    </Link>
                    <div className="row">
                      {!sale ? (
                        <p className="column">${item[2]}.00</p>
                      ) : (
                        <Flexbox
                          flexDirection="row"
                          style={{ position: "relative" }}
                        >
                          <p
                            className="column"
                            style={{
                              "margin-right": "2vw",
                              color: "#565759",
                              opacity: "0.9",
                            }}
                          >
                            <del>${item[2]}.00</del>
                          </p>
                          <p
                            className="column"
                            style={{
                              "margin-right": "2vw",
                              left: "2vw",
                              position: "relative",
                            }}
                          >
                            SALE: ${item[12]}.00
                          </p>
                        </Flexbox>
                      )}
                      {numInCart >= 1 && (
                        <p
                          style={{
                            "background-color": "#565759",
                            // "padding-left": ".25em",
                            // "padding-right": ".25em",
                            // "padding-top": ".25em",
                            "border-radius": "10px",
                            // "bottom": "1em",
                            position: "relative",
                            left: "2vw",
                            marginLeft: ".5em",
                            marginRight: `${isLargeScreen ? ".5em" : "1em"}`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {numInCart} in cart
                        </p>
                      )}
                    </div>
                    <p
                      style={{
                        "background-image":
                          "linear-gradient(to bottom right, #cce0ff, #404963)",
                        "border-radius": "10px",
                      }}
                    >{`${item[3]}`}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <br></br>
      </div>
      <br></br>
    </div>
  );
}

export default FullSets;
