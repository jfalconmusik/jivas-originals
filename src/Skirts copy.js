import React, { useState, useContext, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import firebase from "firebase"
import { Context } from "./Context"
import magnificent from "magnificent"
import Flexbox from "flexbox-react"
import ContentLoader, { Facebook } from "react-content-loader";
import RecentlyViewed from "./RecentlyViewed"



function Skirts() {



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
        skirtCategory,
        activateAddToWishlistModal,
        productOnPageCount,
        setProductOnPageCount,
        setOnCheckout,
        setCategorySearch,
        displayNumber,
        allNumber,
        itemString,
        setTermsDisplay,
        activateRemoveFromWishlistModal
    } = useContext(Context)





    useEffect(() => {
        setProductOnPageCount(0)
        document.getElementById("firebaseui-auth-container").style.display = "none"
        setOnCheckout(false)
        setCategorySearch("skirt")
        // document.getElementById('smallSearch').style.display = "inline-block"
        // document.getElementById('largeSearch').style.display = "initial"
    }, [])


    // page number logix:
    const [pageNumber, setPageNumber] = useState(1)
    const [totalSkirtsCount, setTotalSkirtsCount] = useState(0)

    useEffect(() => {
        setTotalSkirtsCount(skirtCategory.length)
    }, [])

    const [pageOne, setPageOne] = useState([])
    const [pageTwo, setPageTwo] = useState([])
    const [pageThree, setPageThree] = useState([])
    const [pageFour, setPageFour] = useState([])
    const [pageFive, setPageFive] = useState([])

    // useEffect(() => {
    //     // remove search if page is changed:
    //     document.getElementById("skirtSearch").value = ""

    //     let skirts = document.getElementsByClassName("skirtsCounter")

    //     let skirtsArray = Array.prototype.slice.call(skirts, 0, skirts.length + 1)

    //     let pageOneArr = []
    //     let pageTwoArr = []
    //     let pageThreeArr = []
    //     let pageFourArr = []
    //     let pageFiveArr = []


    //     skirtsArray.forEach(skirt => {
    //         console.log(skirt)
    //         let skirtCounterID = skirt.id
    //         console.log(skirtCounterID)

    //         let skirtCounterIdSplit = skirtCounterID.split("_")
    //         let skirtNumber = Number(skirtCounterIdSplit[1])

    //         if (skirtNumber <= 20) {
    //             pageOneArr.push(skirtCounterID)
    //         } else if ((skirtNumber > 20) && (skirtNumber <= 40)) {
    //             pageTwoArr.push(skirtCounterID)
    //         } else if ((skirtNumber > 40) && (skirtNumber <= 60)) {
    //             pageThreeArr.push(skirtCounterID)
    //         } else if ((skirtNumber > 60) && (skirtNumber <= 80)) {
    //             pageFourArr.push(skirtCounterID)
    //         } else if ((skirtNumber > 80) && (skirtNumber <= 100)) {
    //             pageFiveArr.push(skirtCounterID)
    //         }
    //         //     document.getElementById(skirtID).style.display = "initial"
    //         //     document.getElementById(skirtID).setAttribute("display", "initial")
    //         //     newArr.push(skirtID)
    //         //     console.log(newArr)
    //         // } else {
    //         //     document.getElementById(skirtID).style.display = "none"
    //         //     document.getElementById(skirtID).setAttribute("display", "none")
    //         //     console.log(newArr)
    //         // }
    //     })
    //     setPageOne(pageOneArr)
    //     setPageTwo(pageTwoArr)
    //     setPageThree(pageThreeArr)
    //     setPageFour(pageFourArr)
    //     setPageFive(pageFiveArr)

    // }, [])

    const [refresh, setRefresh] = useState(0)

    useEffect(() => {

        // decide which items to display based on page number as well as choosing
        // the button styling for each page.

        if (refresh > 0) {
            if (pageNumber == 1) {

                document.getElementById("pageOne").style.color = "pink"

                if (document.getElementById("pageTwo")) {
                    document.getElementById("pageTwo").style.color = "white"
                }
                if (document.getElementById("pageThree")) {
                    document.getElementById("pageThree").style.color = "white"
                }
                if (document.getElementById("pageFour")) {
                    document.getElementById("pageFour").style.color = "white"
                }
                if (document.getElementById("pageFive")) {
                    document.getElementById("pageFive").style.color = "white"
                }

                pageOne.forEach(id => {
                    document.getElementById(id).style.display = "initial"
                })
                pageTwo.forEach(id => {
                    document.getElementById(id).style.display = "none"
                })
                pageThree.forEach(id => {
                    document.getElementById(id).style.display = "none"
                })
                pageFour.forEach(id => {
                    document.getElementById(id).style.display = "none"
                })
                pageFive.forEach(id => {
                    document.getElementById(id).style.display = "none"
                })
            } else if (pageNumber == 2) {
                document.getElementById("pageOne").style.color = "white"
                document.getElementById("pageTwo").style.color = "pink"
                if (document.getElementById("pageThree")) {
                    document.getElementById("pageThree").style.color = "white"
                }
                if (document.getElementById("pageFour")) {
                    document.getElementById("pageFour").style.color = "white"
                }
                if (document.getElementById("pageFive")) {
                    document.getElementById("pageFive").style.color = "white"
                }

                pageOne.forEach(id => {
                    document.getElementById(id).style.display = "none"
                })
                pageTwo.forEach(id => {
                    document.getElementById(id).style.display = "initial"
                })
                pageThree.forEach(id => {
                    document.getElementById(id).style.display = "none"
                })
                pageFour.forEach(id => {
                    document.getElementById(id).style.display = "none"
                })
                pageFive.forEach(id => {
                    document.getElementById(id).style.display = "none"
                })

            } else if (pageNumber == 3) {
                document.getElementById("pageOne").style.color = "white"
                document.getElementById("pageTwo").style.color = "white"
                document.getElementById("pageThree").style.color = "pink"
                if (document.getElementById("pageFour")) {
                    document.getElementById("pageFour").style.color = "white"
                }
                if (document.getElementById("pageFive")) {
                    document.getElementById("pageFive").style.color = "white"
                }
                pageOne.forEach(id => {
                    document.getElementById(id).style.display = "none"
                })
                pageTwo.forEach(id => {
                    document.getElementById(id).style.display = "none"
                })
                pageThree.forEach(id => {
                    document.getElementById(id).style.display = "initial"
                })
                pageFour.forEach(id => {
                    document.getElementById(id).style.display = "none"
                })
                pageFive.forEach(id => {
                    document.getElementById(id).style.display = "none"
                })

            } else if (pageNumber == 4) {
                document.getElementById("pageOne").style.color = "white"
                document.getElementById("pageTwo").style.color = "white"
                document.getElementById("pageThree").style.color = "white"
                document.getElementById("pageFour").style.color = "pink"
                if (document.getElementById("pageFive")) {
                    document.getElementById("pageFive").style.color = "white"
                }
                pageOne.forEach(id => {
                    document.getElementById(id).style.display = "none"
                })
                pageTwo.forEach(id => {
                    document.getElementById(id).style.display = "none"
                })
                pageThree.forEach(id => {
                    document.getElementById(id).style.display = "none"
                })
                pageFour.forEach(id => {
                    document.getElementById(id).style.display = "initial"
                })
                pageFive.forEach(id => {
                    document.getElementById(id).style.display = "none"
                })

            } else if (pageNumber == 5) {
                document.getElementById("pageOne").style.color = "white"
                document.getElementById("pageTwo").style.color = "white"
                document.getElementById("pageThree").style.color = "white"
                document.getElementById("pageFour").style.color = "white"
                document.getElementById("pageFive").style.color = "pink"

                pageOne.forEach(id => {
                    document.getElementById(id).style.display = "none"
                })
                pageTwo.forEach(id => {
                    document.getElementById(id).style.display = "none"
                })
                pageThree.forEach(id => {
                    document.getElementById(id).style.display = "none"
                })
                pageFour.forEach(id => {
                    document.getElementById(id).style.display = "none"
                })
                pageFive.forEach(id => {
                    document.getElementById(id).style.display = "initial"
                })

            }
        }
    }, [pageNumber, refresh])



    function handleProductComponent(item) {
        console.log(productPageComponent)
        setProductPageComponent(item);
        console.log(productPageComponent)
    }



    // function handleSearchSkirts() {

    //     let skirtsCounterArraylike = document.getElementsByClassName("skirtsCounter")

    //     let skirtsCounterArray = Array.prototype.slice.call
    //         (skirtsCounterArraylike, 0, skirtsCounterArraylike.length + 1)

    //     skirtsCounterArray.forEach(skirt => {
    //         let id = skirt.id
    //         document.getElementById(id).style.display = "initial"
    //     })



    //     let input = document.getElementById("skirtSearch").value

    //     if (input == "") {
    //         setRefresh(refresh + 1)
    //     }

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
    //     let skirts = document.getElementsByClassName("skirts")
    //     console.log(skirts)
    //     console.log(skirts.length)
    //     console.log(skirts[0])
    //     console.log(skirts[0].id)

    //     let skirtsArray = Array.prototype.slice.call(skirts, 0, skirts.length + 1)
    //     console.log(skirtsArray)
    //     console.log(skirtsArray.length)

    //     let newArr = []

    //     skirtsArray.forEach(skirt => {
    //         console.log(skirt)
    //         console.log(newArr)
    //         let skirtID = skirt.id
    //         console.log(skirtID)

    //         if (skirtID.includes(filter)
    //             || skirtID.includes(filt1)
    //             || skirtID.includes(filtSplit1)
    //             || ((skirtID.includes(filtSplit2Arr[0]) &&
    //                 (skirtID.includes(filtSplit1))
    //             ))
    //         ) {
    //             document.getElementById(skirtID).style.display = "initial"
    //             document.getElementById(skirtID).setAttribute("display", "initial")
    //             newArr.push(skirtID)
    //             console.log(newArr)
    //         } else {
    //             document.getElementById(skirtID).style.display = "none"
    //             document.getElementById(skirtID).setAttribute("display", "none")
    //             console.log(newArr)
    //         }
    //     })

    //     // let i
    //     // for (i = 0; i < skirtsArray.length; i++) {
    //     //     return (function handleIterate() {

    //     // console.log(i)
    //     // let skirt = skirtsArray[i]
    //     // console.log(skirt)
    //     // })()
    //     // }

    //     let searchQuant = newArr.length
    //     setSkirtsNumber(searchQuant)
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


    const [skirts, setSkirts] = useState([])

    useEffect(() => {


        const skirtNames = skirtCategory.map(item => {
            return item[0]
        })
        setSkirts(skirtNames)
    }, [skirtCategory])

    useEffect(() => {
        setTermsDisplay(false);
        document.getElementById("firebaseui-auth-container").style.display = "none"
    }, [])



    /////////////////////////////////////////////////////////////////
    // <   AutoComplete Code Section >
    /////////////////////////////////////////////////////////

    function autocomplete(inp, arr) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function (e) {
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false; }
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
            } else if (e.keyCode == 38) { //up
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
            if (currentFocus < 0) currentFocus = (x.length - 1);
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

    let emptyHeartSource = "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/heart%20transparent.svg?alt=media&token=812d1dc3-3a82-4527-8551-63d3941fc5c4"
    let filledHeartSource = "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/heart%20pinkers.svg?alt=media&token=48f11612-1d2f-4564-8625-4c0821c9df4c"

    function handleHideHeart(itemName) {
        let heartIcon = document.getElementById(`heartIcon${itemName}`)

        if (heartIcon.src == emptyHeartSource) {
            heartIcon.style.display = "none"
            heartIcon.setAttribute("display", "none")
        }
    }

    function handleShowHeart(itemName) {
        let heartIcon = document.getElementById(`heartIcon${itemName}`)

        if (heartIcon.src == emptyHeartSource) {
            heartIcon.style.display = "initial"
            heartIcon.setAttribute("display", "initial")
        }

    }

    function handleWishlist(count, item) {
        let putBackItem = [item[0], [], (Number(item[2]) / 100), [], [], `${item[1]}`]

        if (count > 0) {
            removeFromWishlist(item[0])
            activateRemoveFromWishlistModal(putBackItem)
            modifyWishlistCount(-1)
        } else {
            addToWishlist(item)
            activateAddToWishlistModal(item[0])
            modifyWishlistCount(1);
        }
    }


    return (
        <div>
            <nav aria-label="You are here:" role="navigation">
                <ul class="breadcrumbs">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/shop">Shop</Link></li>
                    <li><Link to="/shop/skirts">Skirts</Link></li>
                    <li>
                        <span class="show-for-sr">Current: Skirts</span>
                    </li>
                </ul>
            </nav>
            <div className="shadowed" style={{
                // "background-color": "black",
                // "box-shadow": "0px 0px 5px white",
            }}>
                <h2>Skirts</h2>
                <br></br>
                {displayNumber && <h3>{allNumber} {itemString}</h3>}
                {skirtCategory.map(item => {
                    let refString = item[1].toString()
                    // console.log(allProducts)
                    console.log(item)
                    console.log(item[0])
                    console.log(refString)

                    // storageRef.child(refString).getDownloadURL().then(function (url) {
                    //     return item.push(url)
                    // })
                    // make sure to always reference this with the last element in the array.
                    // currently it will be 5

                    let productInWishlistArray = wishlistItems.filter(i => i.includes(item[0]))
                    let productInCartArray = itemList.filter(i => i.includes(item[0]))


                    let productPageLinkString = item[0].split(" ").join("-")


                    let numberInCart = itemList.filter(i => i[0] == item[0])
                    let numInCart = numberInCart.length
                    let bestseller = item[11]

                    let posArray = []
                    let emptyString = ""

                    let sale = item[12]

                    return (
                        <div className="column shadowed">
                            <div className="productCard">
                                <div className="skirtsCounter" id={`skirts_${Number(skirtCategory.indexOf(item)) + 1}`}>
                                    <div id={`contentLoader${skirts.indexOf(item[0])}`}>
                                        <ContentLoader
                                            backgroundColor="white"
                                            animate={false}
                                            style={{
                                                // "background-Color": "#565759",

                                                "borderRadius": "25px",
                                                "height": "500px"
                                            }}
                                            onLoad={() => {
                                                document.getElementById(`spinner${item[0]}`).style.visibility = "visible"
                                                document.getElementById(`spinner${item[0]}`).setAttribute("visibility", "visible")
                                            }
                                            }
                                        >
                                            <rect style={{
                                                "background-Color": "white",
                                                "zIndex": "85",
                                                "borderRadius": "25px",
                                            }} x="0" y="0" rx="5" ry="5" width="400" height="500" />

                                            <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
                                            <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
                                        </ContentLoader>
                                        <div id={`spinner${item[0]}`}
                                            style={{
                                                "position": "relative",
                                                "top": "-300px", "zIndex": "86", "visibility": "none"
                                            }}
                                            className="loader centered"></div>
                                    </div>
                                    <div
                                        onMouseOver={() => { handleShowHeart(`${item[0]}`) }}
                                        onMouseOut={() => { handleHideHeart(`${item[0]}`) }}
                                        className="skirts"
                                        id={`skirts${item[0].toUpperCase()}`}>
                                        {bestseller &&
                                            <span class="label warning" style={{
                                                "color": "white",
                                                "top": `${(posArray[1]) ? posArray[0] : emptyString}`,
                                                "left": `${(posArray[1]) ? posArray[1] : emptyString}`,
                                                "position": "absolute"
                                            }}>Bestseller</span>}
                                        <img
                                            onClick={() => {
                                                handleWishlist(productInWishlistArray.length, item);
                                            }}
                                            id={`heartIcon${item[0]}`}
                                            style={{
                                                "top": `${(posArray[1]) ? posArray[0] : emptyString}`,
                                                "margin-left": "16em",
                                                // "left": `${(rightArray[0]) ? rightArray[0] : emptyString}`,
                                                // "left": "4em",
                                                "display": `${(productInWishlistArray.length > 0) ? "initial" : "none"}`,
                                                "position": "absolute"
                                            }}
                                            width="3%"
                                            height="auto"
                                            src={`${(productInWishlistArray.length > 0) ? filledHeartSource : emptyHeartSource}`} />


                                        <Link to={`/product/${productPageLinkString}`}>
                                            <img
                                                style={{ "visibility": "hidden" }}
                                                id={`${item[0]}`}
                                                width="100%"
                                                height="auto"
                                                onLoad={() => {
                                                    posArray.push(document.getElementById(`${item[0]}`).getBoundingClientRect().top + window.scrollY);
                                                    posArray.push(document.getElementById(`${item[0]}`).getBoundingClientRect().left);
                                                    document
                                                        .getElementById(`contentLoader${skirts.indexOf(item[0])}`)
                                                        .style.display = "none"

                                                    document
                                                        .getElementById(`contentLoader${skirts.indexOf(item[0])}`)
                                                        .setAttribute("display", "none")
                                                    document.getElementById(`${item[0]}`).style.visibility = "visible"
                                                }}
                                                src={item[5]}></img>
                                        </Link>
                                        <Link to={`/product/${productPageLinkString}`}>
                                            <h2 class="text-decoration-none">{item[0]}</h2>
                                        </Link>
                                        <div className="row">
                                            <Flexbox flexDirection="row">
                                                {!sale ?
                                                    <p className="column">${item[2]}.00</p>
                                                    :
                                                    <Flexbox flexDirection="row"
                                                        style={{ "position": "relative" }}>
                                                        <p
                                                            style={{ "margin-right": "2vw" }}>
                                                            <del>${item[2]}.00</del>
                                                        </p>
                                                        <p

                                                            style={{
                                                                "margin-right": "2vw",
                                                                "left": "2vw",
                                                                "position": "relative"

                                                            }}
                                                        >SALE: ${item[12]}.00</p>
                                                    </Flexbox>
                                                }
                                                {(numInCart >= 1) &&
                                                    <p style={{
                                                        "background-color": "#565759",
                                                        // "padding-left": ".25em",
                                                        // "padding-right": ".25em",
                                                        // "padding-top": ".25em",
                                                        "border-radius": "10px",
                                                        // "bottom": "1em",
                                                        "position": "relative",
                                                        "left": "2vw"
                                                        // "margin-left": "1em"
                                                    }}>{numInCart} in cart</p>}
                                            </Flexbox>
                                        </div>
                                        <p>{`${item[3]}`}</p>
                                        {/* <p><button
                                            type="button"
                                            style={{ "backgroundColor": "#1779ba" }}
                                            onClick={() => {
                                                addToWishlist(item);
                                                modifyWishlistCount(1);
                                                activateAddToWishlistModal(item[0]);
                                            }
                                            }>{(productInWishlistArray.length > 0) ? "✔ In Wishlist" : "Add to Wishlist"}</button></p> */}

                                    </div>
                                </div>
                            </div>
                        </div >
                    )

                })}
                {/* <div id="pageCounter">
                <button className="pageNumberButton"
                    type="button" id="pageOne" style={{ "color": "pink" }} onClick={() => {
                        setPageNumber(1);
                        setRefresh(refresh + 1)
                    }}>1</button>
                {(pageTwo.length >= 1) &&
                    <button className="pageNumberButton"
                        type="button" id="pageTwo" onClick={() => {
                            setPageNumber(2);
                            setRefresh(refresh + 1)
                        }}>2</button>}
                {(pageThree.length >= 1) &&
                    <button className="pageNumberButton"
                        type="button" id="pageThree" onClick={() => {
                            setPageNumber(3);
                            setRefresh(refresh + 1)
                        }}>3</button>}
                {(pageFour.length >= 1) &&
                    <button className="pageNumberButton"
                        type="button" id="pageFour" onClick={() => {
                            setPageNumber(4);
                            setRefresh(refresh + 1)
                        }}>4</button>}
                {(pageFive.length >= 1) &&
                    <button className="pageNumberButton"
                        type="button" id="pageFive" onClick={() => {
                            setPageNumber(5);
                            setRefresh(refresh + 1)
                        }}>5</button>}
            </div> */}
                <br></br>
                <RecentlyViewed />
                <nav style={{ "bottom": "0em" }} aria-label="You are here:" role="navigation">
                    <ul class="breadcrumbs">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/shop">Shop</Link></li>
                        <li><Link to="/shop/skirts">Skirts</Link></li>
                        <li>
                            <span class="show-for-sr">Current: Skirts</span>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

    )
}

export default Skirts