import React, { useState, useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import firebase from "firebase";
import { Context } from "./Context";
import magnificent from "magnificent";
import Flexbox from "flexbox-react";
import ContentLoader, { Facebook } from "react-content-loader";
import RecentlyViewed from "./RecentlyViewed";
import PreloadImage from "react-preload-image";
import Preload from "react-preload";
// import { Lines } from "react-preloaders"

function AllProducts() {
  const storage = firebase.storage();
  const storageRef = storage.ref();

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
    activateAddToWishlistModal,
    productOnPageCount,
    setProductOnPageCount,
    activateRemoveFromWishlistModal,
    loaderOn,
    setLoaderOn,
    loadedCount,
    setLoadedCount,
    setTermsDisplay,
    isLargeScreen,
    isSmallScreen,
  } = useContext(Context);

  useEffect(() => {
    setProductOnPageCount(0);
  }, []);

  function handleProductComponent(item) {
    console.log(productPageComponent);
    setProductPageComponent(item);
    console.log(productPageComponent);
  }

  function getElementPositioning(elementId) {
    let rects = document.getElementById(elementId);
  }

  //////////////////////////////////////////////////////////////////////
  /////////////
  //////////

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

    if (heartIcon.src == emptyHeartSource) {
      heartIcon.style.display = "initial";
      heartIcon.setAttribute("display", "initial");
    }
  }

  useEffect(() => {
    setTermsDisplay(false);
    document.getElementById("firebaseui-auth-container").style.display = "none";
  }, []);

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

  function Loader() {
    let i = 1;
    let j = 1;
    let k = 1;

    for (j = 1; j < allProducts.length; j = j + 4) {
      let f = allProducts.length;

      function Column() {
        for (k = k; k < allProducts.length; (k - 1) % 4 !== 0 && k++) {
          return (
            <Flexbox flexDirection="column">
              <Facebook
                id={`loader${k}`}
                style={{
                  visibility: "visible",
                }}
              />
            </Flexbox>
          );
        }

        let k = k + 1;
      }

      return (
        <div>
          <Flexbox flexDirection="row">
            <Column />
          </Flexbox>
        </div>
      );
    }
  }

  return allProducts.map((item) => {
    let refString = item[1].toString();
    // console.log(allProducts)
    console.log(item);
    console.log(item[0]);
    console.log(refString);
    console.log(item[12]);

    let productInWishlistArray = wishlistItems.filter((i) =>
      i.includes(item[0])
    );
    let productInCartArray = itemList.filter((i) => i.includes(item[0]));

    let productPageLinkString = item[0].split(" ").join("-");

    let modalItem = [
      item[0],
      [],
      Number(item[12] || item[2]) * 100,
      [],
      [],
      item[1],
    ];

    let numberInCart = itemList.filter((i) => i[0] == item[0]);
    let numInCart = numberInCart.length;

    let bestseller = item[11];
    console.log(numInCart);

    let posArray = [];
    let emptyString = "";

    let sale = item[12];

    return (
      <div
        className="column shadowed"
        onMouseOver={() => {
          handleShowHeart(`${item[0]}`);
        }}
        onMouseOut={() => {
          handleHideHeart(`${item[0]}`);
        }}
        style={{ maxHeight: "830px" }}
      >
        {bestseller ? (
          <div>
            <div
              className="productCard"
              style={{
                overflow: "hidden",
                "z-index": "90",
              }}
            >
              <div class="img-responsive">
                <div
                  className="allProducts paisley"
                  id={`allProducts${item[0].toUpperCase()}`}
                >
                  <img
                    alt=""
                    onClick={() => {
                      handleWishlist(productInWishlistArray.length, item);
                    }}
                    id={`heartIcon${item[0]}`}
                    style={{
                      top: `${posArray[1] ? posArray[0] : emptyString}`,
                      float: "right",
                      boxSizing: "border-box",
                      marginLeft: "20vw",
                      display: `${
                        productInWishlistArray.length > 0 && !isSmallScreen
                          ? "inline-block"
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
                  <div
                    id={`contentLoader${allProducts.indexOf(item)}`}
                    style={{ position: "absolute" }}
                  >
                    <ContentLoader
                      backgroundColor="white"
                      animate={false}
                      style={{
                        position: "relative",
                        borderRadius: "25px",
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
                      id={`spinner${allProducts.indexOf(item)}`}
                    ></div>
                  </div>
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
                  <Link
                    to={`/product/${productPageLinkString}`}
                    style={{ zIndex: "90" }}
                  >
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
                          `contentLoader${allProducts.indexOf(item)}`
                        ).style.display = "none";

                        document
                          .getElementById(
                            `contentLoader${allProducts.indexOf(item)}`
                          )
                          .setAttribute("display", "none");
                        document.getElementById(`${item[0]}`).style.visibility =
                          "visible";
                      }}
                      src={item[5]}
                    ></img>
                  </Link>
                  <Link to={`/product/${productPageLinkString}`}>
                    <h2 class="text-decoration-none">{item[0]}</h2>
                  </Link>
                  <div className="row">
                    <Flexbox flexDirection="row">
                      {!sale ? (
                        <p className="column">${item[2]}.00</p>
                      ) : (
                        <Flexbox
                          flexDirection="row"
                          style={{ position: "relative" }}
                        >
                          <p
                            style={{
                              "margin-right": "2vw",
                              color: "#565759",
                              opacity: "0.9",
                            }}
                          >
                            <del>${item[2]}.00</del>
                          </p>
                          <p
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
                            marginLeft: ".5em",
                            left: "2vw",
                            // "margin-left": "1em"
                            marginRight: `${isLargeScreen ? ".5em" : "1em"}`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {numInCart} in cart
                        </p>
                      )}
                    </Flexbox>
                  </div>
                  <p
                    style={{
                      "background-color": "#565759",
                      "border-radius": "10px",
                    }}
                  >{`${item[3]}`}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="productCard">
              <div class="img-responsive">
                <div
                  className="allProducts"
                  id={`allProducts${item[0].toUpperCase()}`}
                >
                  <img
                    alt=""
                    onClick={() => {
                      handleWishlist(productInWishlistArray.length, item);
                    }}
                    id={`heartIcon${item[0]}`}
                    style={{
                      top: `${posArray[1] ? posArray[0] : emptyString}`,
                      marginLeft: "20vw",
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
                  <div
                    id={`contentLoader${allProducts.indexOf(item)}`}
                    style={{ position: "absolute" }}
                  >
                    <ContentLoader
                      animate={false}
                      backgroundColor="white"
                      style={{
                        "background-Color": "white",
                        borderRadius: "25px",
                        height: `${!isSmallScreen ? "25vw" : "500px"}`,
                        width: `${!isSmallScreen ? "15vw" : "70vw"}`,
                        position: "relative",
                        margin: "0 auto",
                        left: `${!isSmallScreen ? "4.5vw" : "15vw"}`,
                      }}
                    >
                      <rect
                        style={{
                          zIndex: "85",
                          borderRadius: "25px",
                        }}
                        x="0"
                        y="0"
                        rx="5"
                        ry="5"
                        width="400"
                        height="700"
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
                      style={{
                        position: "relative",
                        top: `${!isSmallScreen ? "-14vw" : "-60vw"}`,
                        zIndex: "86",
                        width: `${!isSmallScreen ? "6vw" : "20vw"}`,
                        height: `${!isSmallScreen ? "6vw" : "20vw"}`,
                        left: `${!isSmallScreen ? "4.5vw" : "15vw"}`,
                      }}
                      className="loader centered"
                      id={`spinner${allProducts.indexOf(item)}`}
                    ></div>
                  </div>
                  <Link
                    to={`/product/${productPageLinkString}`}
                    style={{ zIndex: "90" }}
                  >
                    <img
                      alt=""
                      style={{ visibility: "hidden" }}
                      onLoad={() => {
                        document.getElementById(`${item[0]}`).style.visibility =
                          "visible";
                        document.getElementById(
                          `contentLoader${allProducts.indexOf(item)}`
                        ).style.display = "none";
                        document
                          .getElementById(
                            `contentLoader${allProducts.indexOf(item)}`
                          )
                          .setAttribute("display", "none");
                      }}
                      id={`${item[0]}`}
                      width="100%"
                      height="auto"
                      src={item[5]}
                    ></img>
                  </Link>
                  <Link to={`/product/${productPageLinkString}`}>
                    <h2 class="text-decoration-none">{item[0]}</h2>
                  </Link>
                  <div className="row">
                    <Flexbox flexDirection="row">
                      {!sale ? (
                        <p className="column">${item[2]}.00</p>
                      ) : (
                        <Flexbox
                          flexDirection="row"
                          style={{ position: "relative" }}
                        >
                          <p
                            style={{
                              "margin-right": "2vw",
                              color: "#565759",
                              opacity: "0.9",
                            }}
                          >
                            <del>${item[2]}.00</del>
                          </p>
                          <p
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
                            "border-radius": "10px",
                            position: "relative",
                            marginLeft: ".5em",
                            left: "2vw",

                            marginRight: `${isLargeScreen ? ".5em" : "1em"}`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {numInCart} in cart
                        </p>
                      )}
                    </Flexbox>
                  </div>

                  <p
                    style={{
                      "background-color": "#565759",
                      "border-radius": "10px",
                    }}
                  >{`${item[3]}`}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  });
}

export default AllProducts;
