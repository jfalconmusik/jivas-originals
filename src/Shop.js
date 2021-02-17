import React, { useContext, useState, useEffect } from "react";
import {
  useRouteMatch,
  Link,
  Switch,
  BrowserRouter as Router,
  Route,
  useParams,
} from "react-router-dom";
import firebase from "firebase";
import { Context } from "./Context";
import AllProducts from "./AllProducts";
import FullSets from "./FullSets";
import Tops from "./Tops";
import Skirts from "./Skirts";
import Belts from "./Belts";
import Flexbox from "flexbox-react";
import ContentLoader, { Facebook } from "react-content-loader";
import RecentlyViewed from "./RecentlyViewed";
import Footer from "./Footer";
// import { getClass } from "../utils"

// "in cart" marker

function Shop() {
  const match = useRouteMatch();

  const {
    routerString,
    setRouterString,
    setTermsDisplay,
    itemCategory,
    allProducts,
    productsLoaded,
    setOnCheckout,
    setCategorySearch,
    displayNumber,
    allNumber,
    itemString,
    loaderOn,
    setLoaderOn,
    loadedCount,
    setLoadedCount,
    setOnProductPage,
    isLargeScreen,
    setOnHomeScreen,
  } = useContext(Context);

  useEffect(() => {
    setRouterString("shop");
    setOnCheckout(false);
    setOnProductPage(false);
    setOnHomeScreen(false);
  }, []);

  useEffect(() => {
    setTermsDisplay(false);
    document.getElementById("firebaseui-auth-container").style.display = "none";

    // document.getElementById('smallSearch').style.display = "inline-block"
    // document.getElementById('largeSearch').style.display = "initial"
  }, []);

  // const [allNumber, setAllNumber] = useState(0)
  // const [displayNumber, setDisplayNumber] = useState(false)
  // const [itemString, setItemString] = useState("")

  // function handleSearchShop() {
  //     let input = document.getElementById("allSearch").value
  //     console.log(input)
  //     let filt1 = input.toUpperCase()
  //     let filter = filt1.split(" ").join("")
  //     let filtArr = filt1.split(" ")
  //     let filtSplit1 = filtArr[0]

  //     let filtSplit2Arr = []
  //     if (filtArr.length > 1) {
  //         let filtSplit2 = filtArr[1]
  //         filtSplit2Arr.push(filtSplit2)
  //     }

  //     let all = document.getElementsByClassName("allProducts")
  //     console.log(all)
  //     console.log(all.length)
  //     console.log(all[0])
  //     console.log(all[0].id)

  //     let allArray = Array.prototype.slice.call(all, 0, all.length + 1)
  //     console.log(allArray)
  //     console.log(allArray.length)

  //     let newArr = []

  //     allArray.forEach(prod => {
  //         console.log(prod)
  //         console.log(newArr)
  //         let prodID = prod.id
  //         console.log(prodID)

  //         if (prodID.includes(filter)
  //             || prodID.includes(filt1)
  //             || prodID.includes(filtSplit1)
  //             || ((prodID.includes(filtSplit2Arr[0]) &&
  //                 (prodID.includes(filtSplit1))
  //             ))
  //         ) {
  //             document.getElementById(prodID).style.display = "initial"
  //             document.getElementById(prodID).setAttribute("display", "initial")
  //             newArr.push(prodID)
  //             console.log(newArr)
  //         } else {
  //             document.getElementById(prodID).style.display = "none"
  //             document.getElementById(prodID).setAttribute("display", "none")
  //             console.log(newArr)
  //         }
  //     })

  //     // let i
  //     // for (i = 0; i < fullSetsArray.length; i++) {
  //     //     return (function handleIterate() {

  //     // console.log(i)
  //     // let fullSet = fullSetsArray[i]
  //     // console.log(fullSet)
  //     // })()
  //     // }

  //     let searchQuant = newArr.length
  //     setAllNumber(searchQuant)
  //     console.log(searchQuant)
  //     console.log(newArr)

  //     if (input.length > 0) {
  //         setDisplayNumber(true)
  //     } else {
  //         setDisplayNumber(false)
  //     }

  //     if (newArr.length == 1) {
  //         setItemString("item matches your search")
  //     } else {
  //         setItemString("items match your search")
  //     }

  // }

  const [productsArray, setProductsArray] = useState([]);

  useEffect(() => {
    window.scroll(0, 100);
  }, []);

  useEffect(() => {
    const productNames = allProducts.map((item) => {
      return item[0];
    });
    setProductsArray(productNames);
  }, [productsLoaded]);

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
    setCategorySearch("all");
  }, []);

  /////////////////////////////////////////////////////////////////
  // </  AutoComplete Code Section >
  /////////////////////////////////////////////////////////

  return (
    <div>
      <nav className="darkNav" aria-label="You are here:" role="navigation">
        <ul class="breadcrumbs">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/shop">Shop</Link>
          </li>
          <li>
            <span class="show-for-sr">Current: Shop</span>
          </li>
        </ul>
      </nav>
      <div className="shadowed">
        <h1 style={{ fontFamily: "Luminari" }}>Shop</h1>
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
        <main className="shopBackground">
          <div className="row">
            <Switch>
              <Route exact path="/shop">
                <AllProducts />
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
            </Switch>
          </div>
        </main>
        <br></br>
      </div>
      <br></br>
    </div>
  );
}

export default Shop;
