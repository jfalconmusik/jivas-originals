import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "./Context";
import ReactImageMagnify from "react-image-magnify";
import Flexbox from "flexbox-react";
import ContentLoader, { Facebook } from "react-content-loader";
import RecentlyViewed from "./RecentlyViewed";
import AliceCarousel, { slidePrev, slideNext } from "react-alice-carousel";
import InnerImageZoom from "react-inner-image-zoom";
import "react-alice-carousel/lib/alice-carousel.css";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import Footer from "./Footer";

// to do:

// multiple pictures
// size chart (eventually...)

function ProductPage(props) {
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
    setTermsDisplay,
    productsLoaded,
    setOnCheckout,
    activateAddToWishlistModal,
    activateAddToCartModal,
    activateOptionsModal,
    itemLoadedCount,
    setItemLoadedCount,
    isLargeScreen,
    activateRemoveFromWishlistModal,
    searchString,
    setSearchString,
    setPreviouslyViewed,
    previouslyViewed,
    onProductPage,
    setOnProductPage,
    setModalOpen,
    isPortrait,
    setOnHomeScreen,
  } = useContext(Context);

  function handleContentLoader() {
    if (document.getElementById("contentLoader")) {
      document.getElementById("contentLoader").style.display = "none";
      document.getElementById("contentLoader").style.visibility = "hidden";
      document.getElementById("contentLoader").setAttribute("display", "none");
    }

    setIncrementer(incrementer + 1);
  }

  const [incrementer, setIncrementer] = useState(0);

  useEffect(() => {
    setProductStock(item[10]);
  }, [incrementer]);

  useEffect(() => {
    setSearchString("");
    setTermsDisplay(false);
    setOnCheckout(false);
    setOnHomeScreen(false);
  }, []);

  let item = props.item;

  const [quantSelected, setQuantSelected] = useState(1);

  function handleQuantChoice() {
    let quantChosen = Number(document.getElementById("quantityChosen").value);
    setQuantSelected(quantChosen);
  }

  // const [options, setOptions] = useState([])

  // useEffect(() => {
  //     if (chosenSize && chosenColor) {
  //         setOptions([chosenColor, chosenSize])
  //     }

  // }, [chosenSize, chosenColor])

  // Color Picker State:

  const [chosenColor, setChosenColor] = useState("");
  const [chosenColorHex, setChosenColorHex] = useState("");
  const [oneColor, setOneColor] = useState(false);

  const [colorArr, setColorArr] = useState([]);

  function handleColorChoiceRemix() {
    let value = document.getElementById("colorChosen").value;

    let valueArr = value.split(" ");
    let colorName = valueArr[0];
    let colorHex = valueArr[1];

    setChosenColor(`${colorName}`);
    setChosenColorHex(`${colorHex}`);
  }

  function handleColorChoice(colorName, colorHex) {
    setChosenColor(`${colorName}`);
    setChosenColorHex(`${colorHex}`);
    // let colorButtons = document.getElementsByClassName("colorButton")
    // console.log(colorButtons)

    colorArr.forEach((color) => {
      let colorSplit = color.split("_");
      let colorFirstPart = colorSplit[0];

      if (colorFirstPart !== colorName) {
        document.getElementById(`colorButton${colorName}`).style.boxShadow =
          "none";
      }
    });

    // let otherButtons = Array.prototype.filter.call(colorButtons, function (colorButton) {
    //     return !colorButton.name.includes(`${colorName}`);
    // });

    let chosenButton = document.getElementById(`colorButton${colorName}`);
    chosenButton.style.boxShadow = "white 2em";
  }

  const [onSale, setOnSale] = useState(false);

  useEffect(() => {
    if (item[12]) {
      setOnSale(true);
    } else {
      setOnSale(false);
    }
  }, [allProducts]);

  // Size Picker State:

  const [oneSize, setOneSize] = useState(false);

  const [chosenSize, setChosenSize] = useState("");

  useEffect(() => {
    itemSizes.forEach((size) => {
      if (size == "One Size") {
        setOneSize(true);
        setChosenSize("One-Size");
      }
    });
    // document.getElementById('smallSearch').style.display = "none"
    // document.getElementById('largeSearch').style.display = "none"
    document.getElementById("firebaseui-auth-container").style.display = "none";
  }, []);

  function handleSizeChoice() {
    let e = document.getElementById(`sizeChosen`);
    let selectedSize = e.options[e.selectedIndex].value;

    setChosenSize(selectedSize);
  }

  let productInWishlistArray = wishlistItems.filter((i) => i.includes(item[0]));
  let productInCartArray = itemList.filter((i) => i.includes(item[0]));

  let itemColors = item[6];

  let itemSizes = item[7];

  let cosaAlMenudoCompradoCon = item[9];

  let bestseller = item[11];

  let posArray = [];
  let emptyString = "";

  const [itemBoughtWith, setItemBoughtWith] = useState([]);

  const [productStock, setProductStock] = useState({});

  const [choiceStockCount, setChoiceStockCount] = useState(0);
  const [stockString, setStockString] = useState("");
  const [itemIsSelected, setItemIsSelected] = useState(false);
  const [choiceStockDescriptor, setChoiceStockDescriptor] = useState("");

  useEffect(() => {
    setOnProductPage(true);
  }, []);

  useEffect(() => {
    setProductStock(item[10]);
  }, []);

  useEffect(() => {
    if (chosenColor && chosenSize) {
      if (chosenSize == "One-Size" && chosenColor !== "One-Color") {
        let selection = `${chosenColor}_oneSize`;
        setStockString(selection);
      } else if (chosenSize !== "One-Size" && chosenColor == "One-Color") {
        if (chosenSize.includes("/")) {
          let formattedSize = chosenSize.split("/").join("").toLowerCase();
          let selection = `oneColor_${formattedSize}`;
          setStockString(selection);
        } else {
          let formattedSize = chosenSize.toLowerCase();
          let selection = `oneColor_${formattedSize}`;
          setStockString(selection);
        }
      } else if (chosenSize == "One-Size" && chosenColor == "One-Color") {
        setStockString("oneColor_oneSize");
      } else if (chosenSize.includes("/")) {
        let formattedSize = chosenSize.split("/").join("").toLowerCase();
        let selection = `${chosenColor}_${formattedSize}`;
        setStockString(selection);
      } else {
        let formattedSize = chosenSize.toLowerCase();
        let selection = `${chosenColor}_${formattedSize}`;
        setStockString(selection);
      }
    }
  }, [chosenColor, chosenSize]);

  useEffect(() => {
    if (stockString) {
      setChoiceStockCount(productStock[stockString]);
      setItemIsSelected(true);
    }
  }, [stockString]);

  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    if (itemIsSelected) {
      if (choiceStockCount <= 10 && choiceStockCount > 0) {
        setChoiceStockDescriptor(
          `Order soon! Only ${choiceStockCount} left in stock.`
        );
        setButtonDisabled(false);
      } else if (choiceStockCount > 10) {
        setChoiceStockDescriptor("In stock.");
        setButtonDisabled(false);
      } else if (choiceStockCount <= 0) {
        setChoiceStockDescriptor("Out of stock. Please check back soon.");
        setButtonDisabled(true);
      }
    } else {
      setButtonDisabled(false);
      setChoiceStockDescriptor("");
    }
  }, [choiceStockCount, itemIsSelected]);

  useEffect(() => {
    console.log(cosaAlMenudoCompradoCon);
    let storageArr = [];
    let storageArrAlt = [];
    let storageArrAlt2 = [];
    let newArr = cosaAlMenudoCompradoCon.map((itemName) => {
      console.log(itemName);
      let fullItem = allProducts.find((item) => item[0].includes(itemName));
      console.log(fullItem);
      let fullItem2 = allProducts.filter((item) => item[0].includes(item));
      fullItem2.forEach((i) => {
        storageArr.push(i);
      });

      let fullItemAlt = allProducts.filter((j) => j[0] == itemName);
      fullItemAlt.forEach((k) => {
        storageArrAlt.push(k);
      });

      let fullItemAlt2 = allProducts.filter((j) => j.includes(itemName));
      fullItemAlt2.forEach((k) => {
        storageArrAlt2.push(k);
      });

      return fullItem;
    });
    console.log(storageArr);
    console.log(storageArrAlt);
    console.log(storageArrAlt2);
    setItemBoughtWith(newArr);
  }, [itemLoadedCount]);

  useEffect(() => {
    console.log(itemBoughtWith);
  }, [itemBoughtWith]);

  useEffect(() => {
    let newColorArr = itemColors.filter(
      (color) => !color.includes("One Color")
    );
    setColorArr(newColorArr);

    let oneColorArr = itemColors.filter((color) => color.includes("One Color"));

    if (oneColorArr.length > 0) {
      setOneColor(true);
      setChosenColor("One-Color");
    }
  }, [itemLoadedCount]);

  function bigButton(colorName) {
    document.getElementById(`colorButton${colorName}`).style.fontSize = "14px";
  }

  function littleButton(colorName) {
    document.getElementById(`colorButton${colorName}`).style.fontSize = "12px";
  }

  let modalItem = [
    item[0],
    item[5].toString(),
    Number(item[2]) * 100,
    chosenSize,
    `${chosenColor}_${chosenColorHex}`,
  ];

  function turnOffModal() {
    setModalOpen(false);
  }

  function handleAddToCart(item, options) {
    let sale = item[12];

    if (chosenSize && chosenColor) {
      // let allColorString = itemColors.filter(color => color.includes(options[1]))
      // let colorString = allColorString[0]

      let itemQuant = Number(options[3]) || 1;
      // let newOptions = [colorString, options[1]]

      addToCart(item, options);
      modifyCartCount(itemQuant);

      if (!sale) {
        modifyTotalPrice(Number(item[2]) * 100 * itemQuant);
      } else {
        modifyTotalPrice(Number(item[12]) * 100 * itemQuant);
      }

      let options2 = [chosenSize, chosenColor, chosenColorHex, itemQuant];
      console.log(item);
      console.log(options);
      console.log(modalItem);
      console.log(options2);
      activateAddToCartModal(modalItem, itemQuant);
      /// ^ this also should be a modal :)
    } else if (chosenSize && !chosenColor) {
      // window.alert("Please select a color!")
      activateOptionsModal("color");
    } else if (!chosenSize && chosenColor) {
      activateOptionsModal("size");
      // window.alert("Please select a size!")
    } else if (!chosenSize && !chosenColor) {
      activateOptionsModal("colorSize");
      // window.alert("Please select a size and color!")
    }
  }

  let numberInCart = itemList.filter((i) => i[0] == item[0]);
  let numInCart = numberInCart.length;
  console.log(numberInCart);
  console.log(numInCart);
  console.log(item[0]);
  // so item must be format: [name] [ ] [dollars] [] [] [trueUrl]
  // options must be format: [size] [colorName] [colorHex] [quant]
  // colorString is: [options[1], options[2]].join("_")

  // currently the url is the 5th element in the array
  let itemString = item[5].toString();
  let longDescript = item[4].toString();
  let briefDescript = item[3].toString();

  let moreImagesProto = item[13];

  const [moreImages, setMoreImages] = useState([]);

  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    if (moreImagesProto) {
      console.log(moreImagesProto);
      setMoreImages([itemString, ...moreImagesProto]);
    } else {
      setMoreImages([]);
    }
  }, [incrementer]);

  useEffect(() => {
    setCurrentImage(itemString);
    setBigPic(false);
  }, [itemString]);

  function handlePicture(string) {
    setCurrentImage(string);
  }

  const [bigPic, setBigPic] = useState(false);

  function handleBigPic() {
    if (isLargeScreen) {
      setBigPic(!bigPic);
    }
  }

  const [productPageLinkString, setProductPageLinkString] = useState("");

  useEffect(() => {
    if (item[0] && item[0] !== undefined) {
      let itemString = item[0].split(" ").join("-");
      setProductPageLinkString(itemString);
    }
  }, [itemList]);

  const [itemCategory, setItemCategory] = useState("");
  const [hasCategory, setHasCategory] = useState(true);

  useEffect(() => {
    if (item[8] == "Top") {
      setItemCategory("tops");
    } else if (item[8] == "Belt") {
      setItemCategory("belts");
    } else if (item[8] == "Skirt") {
      setItemCategory("skirts");
    } else if (item[8] == "Full Set") {
      setItemCategory("full-sets");
    } else {
      setHasCategory(false);
    }
  }, [itemLoadedCount]);

  let emptyHeartSource =
    "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/heart%20trans%20white%20border%202.svg?alt=media&token=db6c4320-c1e5-4683-873b-8683e83a4f14";
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

  const [buyNowAllowed, setBuyNowAllowed] = useState(false);

  useEffect(() => {
    if (chosenColor && chosenSize) {
      setBuyNowAllowed(true);
    } else {
      setBuyNowAllowed(false);
    }
  }, [chosenColor, chosenSize]);

  function addToPrevious() {
    if (item[0] && item[0] !== undefined) {
      let itemLink = item[0].split(" ").join("-");
      let itemLink2 = itemLink.split("/");
      let lastNumber = Number(itemLink2.length - 1);

      let finalLink = itemLink2[lastNumber];

      let arr = [];

      previouslyViewed.map((i) => {
        if (i[2].includes(finalLink) || i[2].includes(itemLink)) {
          arr.push(i);
        }
      });

      if (arr.length == 0) {
        // (!previouslyViewed.includes([item[0], itemString, finalLink]))
        setPreviouslyViewed([
          ...previouslyViewed,
          [item[0], itemString, finalLink],
        ]);
      }
    }
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let indexNum = moreImages.indexOf(currentImage);
    setCurrentIndex(indexNum);
  }, [currentImage]);

  function handleCurrentIndex(direction) {
    if (direction == "next") {
      if (currentIndex < Number(moreImages.length - 1)) {
        setCurrentIndex(Number(currentIndex + 1));
      } else {
        setCurrentIndex(0);
      }
    } else {
      if (currentIndex > 0) {
        setCurrentIndex(Number(currentIndex - 1));
      } else {
        setCurrentIndex(Number(moreImages.length - 1));
      }
    }
  }

  function handleOnDragStart(e) {
    e.preventDefault();
  }

  //////////////////////////////////////////////////////////////////////
  if (productsLoaded && item[0]) {
    return (
      <div className="row">
        <nav className="darkNav" aria-label="You are here:" role="navigation">
          <ul class="breadcrumbs">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/shop">Shop</Link>
            </li>
            {hasCategory && (
              <li>
                <Link to={`/shop/${itemCategory}`}>{itemCategory}</Link>
              </li>
            )}
            {hasCategory && (
              <li>
                <Link to={`/product/${productPageLinkString}`}>{item[0]}</Link>
              </li>
            )}
            {!hasCategory && (
              <li>
                <Link
                  to={`/product/${productPageLinkString}`}
                  style={{ fontFamily: "Luminari" }}
                >
                  {item[0]}
                </Link>
              </li>
            )}
            <li>
              <span class="show-for-sr">Current: {itemCategory}</span>
            </li>
          </ul>
        </nav>
        <h1 style={{ fontFamily: "Luminari" }}>{`${item[0]}`}</h1>
        <div
          className="productPage centered"
          style={{
            width: `${isLargeScreen ? "initial" : "100vw"}`,
            right: `${isLargeScreen ? "initial" : "19%"}`,
            position: `${isLargeScreen ? "initial" : "relative"}`,
            // "align": "left",
            // "right": "5vw"
          }}
        >
          <img
            alt="favorite button"
            onClick={() => {
              handleWishlist(productInWishlistArray.length, item);
            }}
            id={`heartIcon${item[0]}`}
            style={{
              top: `${posArray[1] ? posArray[0] : emptyString}`,
              left: "36vw",
              marginTop: "1em",
              marginLeft: "-5em",
              // "left": `${(rightArray[0]) ? rightArray[0] : emptyString}`,
              // "left": "4em",
              display: "initial",
              // "display": `${(productInWishlistArray.length > 0) ? "initial" : "none"}`,
              position: "absolute",
            }}
            width={`${isLargeScreen ? "3%" : "3em"}`}
            height="auto"
            src={`${
              productInWishlistArray.length > 0
                ? filledHeartSource
                : emptyHeartSource
            }`}
          />
          <Flexbox
            className="shadowed centered rounded"
            style={{
              padding: "1em",
              right: "2em",
              "margin-right": "5vw",
              "margin-left": `${!isLargeScreen && "3vw"}`,
            }}
            flexDirection={isLargeScreen ? "row" : "column"}
          >
            <div style={{ width: "100%" }}>
              {bestseller && (
                <h4
                  className="bestseller2"
                  style={{
                    bottom: "2em",
                    top: "0em",
                    left: ".5em",
                  }}
                >
                  Bestseller
                </h4>
              )}
              <div
                style={{
                  align: "left",
                  width: "100%",
                }}
              >
                <div>
                  <div
                    style={{ minWidth: "25vw" }}
                    className={`column ${!isLargeScreen && "centered"}`}
                    onLoad={() => {
                      window.scroll(0, 130);
                      addToPrevious();
                      setItemLoadedCount(itemLoadedCount + 1);
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
                    }}
                  >
                    <Flexbox flexDirection="column">
                      <InnerImageZoom
                        alt=""
                        style={{ zIndex: "90", marginRight: "5em" }}
                        onLoad={() => {
                          handleContentLoader();
                          setItemIsSelected(false);
                        }}
                        id={`${item[0]}`}
                        src={currentImage}
                        width="260px"
                        height="auto"
                      />
                      <Flexbox
                        flexDirection="row"
                        style={{ maxWidth: "300px", top: "5em", zIndex: "91" }}
                      >
                        {moreImages.map((i) => (
                          <img
                            alt=""
                            src={i}
                            height="auto"
                            width={isLargeScreen ? "75px" : "50px"}
                            style={{
                              margin: "1.5em",
                              marginLeft: "0em",
                            }}
                            onClick={() => handlePicture(i)}
                          />
                        ))}
                      </Flexbox>
                    </Flexbox>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div
                className="column"
                style={{
                  align: "right",
                  minWidth: "10vw",
                }}
              >
                <div className="innerOptions">
                  {!oneColor && (
                    <p style={{ "margin-right": "10%" }}>
                      {!oneColor && "Color:"} {chosenColor}
                    </p>
                  )}
                  <div style={{ align: "center" }}>
                    <div>
                      <div
                        className="column"
                        style={{
                          align: "right",
                          "text-align": "right",
                          // "background-color": "#565759",
                          // "border-radius": "25px"
                        }}
                      >
                        <Flexbox
                          className="row"
                          flexDirection="row"
                          style={{
                            "max-width": "14em",
                            "max-height": "2em",
                          }}
                        >
                          <select
                            style={{
                              width: `${isLargeScreen ? "7.2em" : "14em"}`,
                              position: "relative",
                            }}
                            id="colorChosen"
                            onClick={() => {
                              handleColorChoiceRemix();
                            }}
                          >
                            {colorArr.map((color) => {
                              let colorSplit = color.split("_");
                              let colorName = colorSplit[0];
                              let colorHex = colorSplit[1];
                              return (
                                <option value={`${colorName} ${colorHex}`}>
                                  {colorName}
                                </option>
                              );
                            })}
                            {colorArr.length == 0 && <option>One Color</option>}
                          </select>
                        </Flexbox>
                        <br></br>
                      </div>
                    </div>
                  </div>
                  <div>
                    <br></br>
                    {!oneSize || itemSizes.length > 1 ? (
                      <p
                        style={{
                          marginTop: "1em",
                          right: `${isLargeScreen ? "1vw" : "10vw"}`,
                          position: "relative",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Size: {chosenSize}
                      </p>
                    ) : (
                      <p
                        style={{
                          marginTop: "1em",
                          right: "1vw",
                          position: "relative",
                        }}
                      >
                        One Size
                      </p>
                    )}
                    <select
                      id="sizeChosen"
                      onClick={() => {
                        handleSizeChoice();
                      }}
                    >
                      {itemSizes.map((size) => {
                        return <option value={`${size}`}>{size}</option>;
                      })}
                    </select>
                    {/* {oneSize && <h3>One Size</h3>} */}
                  </div>
                  <div>
                    <p>Quantity: {quantSelected ? quantSelected : "1"}</p>
                    <select
                      id="quantityChosen"
                      onChange={() => {
                        handleQuantChoice();
                      }}
                    >
                      <option value="1">1</option>
                      {(choiceStockCount > 1 || choiceStockCount == 0) && (
                        <option value="2">2</option>
                      )}
                      {(choiceStockCount > 2 || choiceStockCount == 0) && (
                        <option value="3">3</option>
                      )}
                      {(choiceStockCount > 3 || choiceStockCount == 0) && (
                        <option value="4">4</option>
                      )}
                      {(choiceStockCount > 4 || choiceStockCount == 0) && (
                        <option value="5">5</option>
                      )}
                      {(choiceStockCount > 5 || choiceStockCount == 0) && (
                        <option value="6">6</option>
                      )}
                      {(choiceStockCount > 6 || choiceStockCount == 0) && (
                        <option value="7">7</option>
                      )}
                      {(choiceStockCount > 7 || choiceStockCount == 0) && (
                        <option value="8">8</option>
                      )}
                      {(choiceStockCount > 8 || choiceStockCount == 0) && (
                        <option value="9">9</option>
                      )}
                      {(choiceStockCount > 9 || choiceStockCount == 0) && (
                        <option value="10">10</option>
                      )}
                    </select>
                  </div>
                  {/* <h4>Quantity Selected: {quantSelected}</h4> */}
                  {itemIsSelected && <p>{choiceStockDescriptor}</p>}
                  <div>
                    {numInCart > 0 && (
                      <p
                        style={{
                          "background-color": "#565759",
                          padding: ".25em",
                          "border-radius": "13px",
                          fontSize: "large",
                        }}
                      >
                        {numInCart} in cart
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{ maxWidth: `${isLargeScreen ? "40vw" : "95vw"}` }}
              className="shadowed"
            >
              <div className="productCard">
                <div>
                  <span>
                    {!onSale ? (
                      <p class="price">${item[2]}.00</p>
                    ) : (
                      <p class="price">
                        <del>${item[2]}.00</del> SALE: ${item[12]}.00
                      </p>
                    )}
                    {/* {onSale &&
                                            <p class="price"></p>} */}
                  </span>
                </div>
              </div>
              <Link to={`${buyNowAllowed ? "/cart" : "#"}`}>
                <p>
                  <button
                    disabled={buttonDisabled}
                    style={{ width: "75%" }}
                    className="button primary"
                    type="button"
                    onClick={() => {
                      handleAddToCart(item, [
                        chosenSize,
                        chosenColor,
                        chosenColorHex,
                        quantSelected,
                      ]);
                      turnOffModal();
                    }}
                  >
                    Buy Now
                  </button>
                </p>
              </Link>
              <p>
                <button
                  style={{ width: "75%" }}
                  className="hollow button primary"
                  id="addCartButton"
                  type="button"
                  disabled={buttonDisabled}
                  // disabled={buttonDisabled}
                  onClick={() => {
                    handleAddToCart(item, [
                      chosenSize,
                      chosenColor,
                      chosenColorHex,
                      quantSelected,
                    ]);
                  }}
                >
                  Add to Cart
                </button>
              </p>

              <div
                className="table-scroll"
                style={{
                  width: "150%",
                  position: "relative",
                  right: `${isLargeScreen ? "8em" : "4em"}`,
                }}
              >
                <table>
                  <p
                    className="description centered graded roundedLight2"
                    style={{
                      textAlign: "left",
                      width: "130%",
                      maxWidth: `${!isPortrait ? "500px" : "80vw"}`,
                      right: "3vw",
                      position: "relative",
                    }}
                  >
                    {longDescript}
                  </p>
                </table>
              </div>
              {!isLargeScreen && (
                <p>
                  <button
                    style={{ width: "75%" }}
                    className="hollow button primary"
                    id="addCartButton"
                    type="button"
                    disabled={buttonDisabled}
                    // disabled={buttonDisabled}
                    onClick={() => {
                      handleWishlist(productInWishlistArray.length, item);
                    }}
                  >
                    {productInWishlistArray.length < 1
                      ? "Add to Favorites"
                      : "Remove from Favorites"}
                  </button>
                </p>
              )}
              <h4>Frequently Bought With...</h4>
              <div className="row" width="110%">
                {itemBoughtWith.map((i) => {
                  let linkString = i[0].split(" ").join("-");
                  console.log(i);
                  console.log(i[0]);
                  console.log(linkString);

                  return (
                    <div className="column">
                      <Link
                        onClick={() => {
                          setChosenColor("");
                          setChosenSize("");
                        }}
                        to={`/product/${linkString}`}
                      >
                        <img
                          alt=""
                          src={`${i[5]}`}
                          width={`${isLargeScreen ? "100%" : "33%"}`}
                          height="auto"
                        ></img>
                        <p>{i[0]}</p>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </Flexbox>
          <div>
            <div>
              <h3>
                View our <Link to="/return-policy">60-day Return Policy</Link>
              </h3>
            </div>
          </div>
        </div>
        <RecentlyViewed />
        <nav className="darkNav" aria-label="You are here:" role="navigation">
          <ul class="breadcrumbs">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/shop">Shop</Link>
            </li>
            {hasCategory && (
              <li>
                <Link to={`/shop/${itemCategory}`}>{itemCategory}</Link>
              </li>
            )}
            <li>
              <Link to={`/product/${productPageLinkString}`}>{item[0]}</Link>
            </li>

            <li>
              <span class="show-for-sr">Current: {itemCategory}</span>
            </li>
          </ul>
        </nav>
        <Footer />
      </div>
    );
  } else {
    return (
      <div>
        <h2>One moment please...</h2>
        <div class="text-center">
          <div class="spinner-border" role="status"></div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default ProductPage;
