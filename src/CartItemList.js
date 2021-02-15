import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase";
import { Context } from "./Context";
import Flexbox from "flexbox-react";

function CartItemList() {
  // rewind to here in case of error

  const storage = firebase.storage();
  const storageRef = storage.ref();

  const {
    modifyCartCount,
    modifyTotalPrice,
    itemList,
    setItemList,
    itemArray,
    removeFromCart,
    addToCart,
    activateRemoveFromCartModal,
    finalItemList,
    setFinalItemList,
    orderComplete,
    setOrderComplete,
    isLargeScreen,
  } = useContext(Context);

  useEffect(() => {
    if (orderComplete) {
      setFinalItemList([]);
    }
  }, [orderComplete]);

  useEffect(() => {
    setOrderComplete(false);
  }, []);

  // const [finalItemList, setFinalItemList] = useState([])

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
    // setItemList()
  }

  const [quantSelected, setQuantSelected] = useState("1");

  function handleQuantChoice(
    productName,
    color,
    productSize,
    productQuant,
    productNickName
  ) {
    let productNameLink = productName.split(" ").join("-");

    let quantChosen = Number(
      document.getElementById(`quantityChosen${productNameLink}`).value
    );
    let itemsOfNameType = itemList.filter((item) => item[0] == productName);

    // let itemsOfColorType = itemList.filter(item => item[4] == color)
    // let itemsOfSizeType = itemList.filter(item => item[3] == productSize)
    //  item[5] == productQuant

    let itemsOfNameAndColor = itemsOfNameType.filter(
      (item) => item[4] == color
    );
    let itemsOfNameColorSize = itemsOfNameAndColor.filter(
      (item) => item[3] == productSize
    );

    let itemQuant = itemsOfNameColorSize.length;

    let itemTemplate = itemsOfNameColorSize[0];
    console.log(itemTemplate);

    console.log("handleQuantChoice fired!");

    if (itemQuant > quantChosen) {
      console.log("itemQuant > quantChosen");
      let subtractedQuant = Number(itemQuant - quantChosen);

      let newQuant = Number(itemQuant - subtractedQuant);

      handleRemoveMultipleFromCart(itemTemplate, subtractedQuant);

      // separates the final list array into a list which only has matches to the requested item,
      // and an array of all other items.
      // remove one from the list of matching items.
      // create a new version of the item with a changed quantity. push the new item to the list
      // of matching items. Then merge the matches back into the full set.

      let finalListItems = finalItemList.filter(
        (i) =>
          i[0] == itemTemplate[0] &&
          i[1] == itemTemplate[1] &&
          i[2] == itemTemplate[2] &&
          i[3] == itemTemplate[3] &&
          i[4] == itemTemplate[4] &&
          i[5] == itemQuant
      );

      let finalListOthers = finalItemList.filter(
        (i) =>
          !(i[0] == itemTemplate[0]) &&
          i[1] == itemTemplate[1] &&
          i[2] == itemTemplate[2] &&
          i[3] == itemTemplate[3] &&
          i[4] == itemTemplate[4] &&
          i[5] == itemQuant
      );

      let finalListItem = finalListItems[0];
      let countOfItemInFinalList = finalListItem.length;

      finalListItems.pop();

      let finalItemRecounted = [
        itemTemplate[0],
        itemTemplate[1],
        itemTemplate[2],
        itemTemplate[3],
        itemTemplate[4],
        newQuant,
      ];

      finalListItems.push(finalItemRecounted);

      let newList = [...finalListOthers, ...finalListItems];
      let newListNoNegatives = newList.filter((i) => i[5] !== 0);

      setFinalItemList([...newListNoNegatives]);

      modifyCartCount(Number(subtractedQuant) * -1);
      modifyTotalPrice(
        Number(itemTemplate[2]) * (Number(subtractedQuant) * -1)
      );

      console.log(finalListItems);

      let moddedNumber = Number(quantChosen + subtractedQuant);
      document.getElementById(`${productNickName}${moddedNumber}`).selected =
        "selected";
      document
        .getElementById(`${productNickName}${moddedNumber}`)
        .setAttribute("selected", "selected");

      // let i;
      // for (i = 0; i < subtractedQuant; i++) {

      // }
    } else if (itemQuant < quantChosen) {
      console.log("itemQuant > quantChosen");
      let addedQuant = Number(quantChosen - itemQuant);

      let cartItem = [
        itemTemplate[0],
        [],
        Number(itemTemplate[2]) / 100,
        [],
        [],
        itemTemplate[1],
      ];
      let colorArr = itemTemplate[4].split("_");

      let options = [itemTemplate[3], colorArr[0], colorArr[1], addedQuant];
      // name - url - price - size - color
      addToCart(cartItem, options);

      let newQuant = Number(itemQuant + addedQuant);

      let finalListItems = finalItemList.filter(
        (i) =>
          i[0] == itemTemplate[0] &&
          i[1] == itemTemplate[1] &&
          i[2] == itemTemplate[2] &&
          i[3] == itemTemplate[3] &&
          i[4] == itemTemplate[4] &&
          i[5] == itemQuant
      );

      let finalListOthers = finalItemList.filter(
        (i) =>
          !(i[0] == itemTemplate[0]) &&
          i[1] == itemTemplate[1] &&
          i[2] == itemTemplate[2] &&
          i[3] == itemTemplate[3] &&
          i[4] == itemTemplate[4] &&
          i[5] == itemQuant
      );

      let finalListItem = finalListItems[0];
      let countOfItemInFinalList = finalListItem.length;

      finalListItems.pop();

      let finalItemRecounted = [
        itemTemplate[0],
        itemTemplate[1],
        itemTemplate[2],
        itemTemplate[3],
        itemTemplate[4],
        newQuant,
      ];

      finalListItems.push(finalItemRecounted);

      let newList = [...finalListOthers, ...finalListItems];

      let newListNoNegatives = newList.filter((i) => i[5] !== 0);

      setFinalItemList([...newListNoNegatives]);

      console.log(finalListItems);

      modifyCartCount(Number(addedQuant));
      modifyTotalPrice(Number(itemTemplate[2]) * Number(addedQuant));

      let moddedNumber = Number(quantChosen - addedQuant);
      document.getElementById(`${productNickName}${moddedNumber}`).selected =
        "selected";
      document
        .getElementById(`${productNickName}${moddedNumber}`)
        .setAttribute("selected", "selected");
    }
    console.log(quantChosen);

    //     if (itemQuant > quantChosen) {

    //         let numDifference = Number(itemQuant - quantChosen)

    //         let i;
    //         for (i = 0; i < numDifference; i++)

    //             removeFromCart(itemsOfNameColorSize[0])
    //     } else if (itemQuant < quantChosen) {

    //         let numDifference = Number(quantChosen - itemQuant)

    //         let i;
    //         for (i = 0; i < numDifference; i++) {
    //             addToCart(itemsOfNameColorSize)
    //         }

    //     } else if (itemQuant === quantChosen)

    //         console.log("Same quantity!")
  }

  console.log(itemList);

  console.log(finalItemList);

  // handling item quantity :

  useEffect(() => {
    if (itemList.length > 0) {
      let newItemList = [];

      itemList.forEach((item) => {
        // const itemQuantArray = itemList.filter(i => i == item)

        let itemsOfKind = itemList.filter(
          (i) =>
            i[0] == item[0] &&
            i[1] == item[1] &&
            i[2] == item[2] &&
            i[3] == item[3] &&
            i[4] == item[4]
        );

        console.log(itemsOfKind);

        let itemsOfKindLength = itemsOfKind.length;

        let newItem = [...item, itemsOfKindLength];

        let isNewItemInListAlready = newItemList.filter(
          (i) =>
            i[0] == newItem[0] &&
            i[1] == newItem[1] &&
            i[2] == newItem[2] &&
            i[3] == newItem[3] &&
            i[4] == newItem[4] &&
            i[5] == newItem[5]
        );

        if (isNewItemInListAlready.length < 1) {
          newItemList.push(newItem);
        }

        console.log(item);
        console.log(itemList);
        console.log(newItemList);
      });

      console.log(newItemList);
      setFinalItemList(newItemList);
      console.log(finalItemList);
      // let itemArray = itemList.filter
    }
  }, [itemList]);

  if (finalItemList.length > 0) {
    return finalItemList.map((item) => {
      console.log(item);
      console.log(finalItemList);

      if (item.length > 0 && item[0]) {
        console.log(item);
        console.log(item[0]);
        let productNameArray = item[0].split(" ");
        let productNameLink = productNameArray.join("-");
        let productNickName = productNameLink.toString();
        console.log(productNickName);

        let productFullColor = item[4];

        let productColorNameHex = item[4].split("_");

        let colorName = productColorNameHex[0];
        let colorHex = productColorNameHex[1];
        let productSize = item[3];
        let productQuant = item[5];

        console.log(item[1]);
        let modalItem = [
          item[0],
          Number(Number(item[2]) / 100),
          Number(Number(item[2]) / 100),
          [],
          [],
          `${item[1]}`,
        ];

        let modalOptions = [productSize, colorName, colorHex, productQuant];

        console.log(
          productSize,
          productQuant,
          productFullColor,
          productNameLink
        );

        productNickName.concat(productSize, productFullColor);
        // let productNickString = productNick.toString
        // let productNickFull = productNickString.concat(productFullColor)
        // let productNickFullString = productNickFull.toString

        console.log(`${productNickName.toString()}`);

        let numbersBeforeSelected = [];
        // let numberAtSelected = []
        let numbersAfterSelected = [];

        let i;
        for (i = 1; i < productQuant; i++) {
          numbersBeforeSelected.push(i);
        }
        for (i = productQuant + 1; i < 11; i++) {
          numbersAfterSelected.push(i);
        }

        // function handleInitialQuant(productNickName, productQuant) {

        //     console.log(`${productNickName} ${productQuant}`)
        // }
        let sale = item[12];

        ////////////////////////////////////////////////

        return (
          <div className="column shadowed">
            <div className="itemCard shadowed graded rounded">
              <Link to={`/product/${productNameLink}`}>
                <img src={`${item[1]}`} width="50%" height="auto"></img>
                <p class="text-decoration-none">{item[0]}</p>
              </Link>
              {!sale ? (
                <p>${(Number(item[2]) / 100).toFixed(2)}</p>
              ) : (
                <p>${(Number(sale) / 100).toFixed(2)}</p>
              )}
              <Flexbox
                flexDirection="row"
                className="centered"
                style={{ left: "20px", position: "relative" }}
              >
                {productColorNameHex.length > 1 && colorName !== "One-Color" && (
                  <div className="row">
                    <Flexbox flexDirection="row" style={{}}>
                      <div className="column">
                        <button
                          style={{
                            "background-color": `${colorHex}`,
                            padding: "1em",
                            "border-radius": "50%",
                            border: "none",
                            display: "inline-block",
                            "font-size": "12px",
                            "padding-bottom": "1em",
                            "max-height": "3em",
                            "max-width": "2em",
                            "margin-left": "2em",
                            position: "relative",
                            right: "2vw",
                            bottom: ".5vw",
                          }}
                          type="button"
                          className="colorButton shadowed"
                          id={`colorButton${colorName}`}
                          name={`${colorName}`}
                        ></button>
                      </div>

                      <p className="column">{colorName}</p>
                    </Flexbox>
                  </div>
                )}
                {
                  !productSize.includes("One-Size") ? (
                    <p
                      style={{
                        left: "3vw",
                        top: "3vw",
                      }}
                    >
                      {productSize}
                    </p>
                  ) : (
                    // :
                    // <p style={{
                    //     "left": "3vw",
                    //     "top": "3vw",
                    <div></div>
                  )
                  // }}>One Size</p>
                }
              </Flexbox>
              <p>Quantity: {productQuant}</p>
              <select
                style={{
                  maxWidth: `${isLargeScreen ? "" : "45vw"}`,
                }}
                id={`quantityChosen${productNameLink}`}
                onChange={() => {
                  handleQuantChoice(
                    `${item[0]}`,
                    `${productFullColor}`,
                    `${productSize}`,
                    `${productQuant}`,
                    `${productNickName}`
                  );
                }}
                // onLoad={() => { handleInitialQuant(productNickName, productQuant) }}
              >
                {numbersBeforeSelected.map((number) => {
                  return (
                    <option
                      id={`${productNickName}${number}`}
                      value={`${number}`}
                    >
                      {number}
                    </option>
                  );
                })}
                {
                  <option id={`${productNickName}${productQuant}`} selected>
                    {productQuant}
                  </option>
                }
                {numbersAfterSelected.map((number) => {
                  return (
                    <option
                      id={`${productNickName}${number}`}
                      value={`${number}`}
                    >
                      {number}
                    </option>
                  );
                })}
              </select>
              <button
                style={{
                  maxWidth: `${isLargeScreen ? "" : "45vw"}`,
                  maxHeight: "3em",
                  fontSize: `${isLargeScreen ? "medium" : "small"}`,
                }}
                className="userButton button primary"
                type="button"
                onClick={() => {
                  handleRemoveMultipleFromCart(item, productQuant);
                  modifyCartCount(Number(productQuant) * -1);
                  modifyTotalPrice(
                    Number(item[2]) * (Number(productQuant) * -1)
                  );
                  activateRemoveFromCartModal(modalItem, modalOptions);
                  // must pass options as in add to cart function
                  // convert cart style to allProductStyle
                }}
              >
                <p>Remove</p>
              </button>

              <br></br>
              <br></br>
              <br></br>
            </div>
          </div>
        );
      } else if (item.length === 0) {
        return <div></div>;
      }
    });
  } else {
    return <div class="cart"></div>;
  }
}

export default CartItemList;
