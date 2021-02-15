import React, { useContext, useState } from "react"
import firebase from "firebase"
import { Context } from "./Context"
// import { getClass } from "../utils"

// objectives: 
// Fundamentally redesign shop to programmatically render items from productsDocument
// in db, and using forEach. addToCart(props) <-- props should carry everything necessary
// to get the proper storageRef, instead of every string being hardcoded.
//
//
// Scrolling over images gives the option to zoom in, add to wishlist or cart. Save card to user.
// SKU and db registry for each.


function Shop() {

    const storage = firebase.storage()
    const storageRef = storage.ref()

    // saving item info to cart
    function addToCart(items) {
        const item = items.toString()
        const user = firebase.auth().currentUser.email
        console.log(item + " Added to cart under " + user)

        if (items == "Beaded Set") {
            storageRef.child('w bg beaded panel back 2 IMG_0103.jpg').getDownloadURL().then(function (url) {
                let cartCache = "Beaded Set" + "%%" + url + "%%" + "28500"
                return firebase.functions().httpsCallable('addToCart')({ cartCache })
            })
        }
        else if (items == "Beaded Top") {
            storageRef.child("w bg beaded top n skirt 2 IMG_0513.jpg").getDownloadURL().then(function (url) {
                let cartCache = "Beaded Top" + "%%" + url + "%%" + "9500"
                return firebase.functions().httpsCallable('addToCart')({ cartCache })
            })
        }
        else if (items == "Velvet Coin") {
            storageRef.child("w bg coin belt blue IMG_1431.jpg").getDownloadURL().then(function (url) {
                let cartCache = "Velvet Coin Belt" + "%%" + url + "%%" + "4800"
                return firebase.functions().httpsCallable('addToCart')({ cartCache })
            })

        }
        else if (items == "Cotton Top") {
            storageRef.child("w bg cotton set IMG_0213.jpg").getDownloadURL().then(function (url) {
                let cartCache = "Cotton Top" + "%%" + url + "%%" + "6500"
                return firebase.functions().httpsCallable('addToCart')({ cartCache })
            })
        }
        else if (items == "Feather Set") {
            storageRef.child("w bg feather set IMG_0350.jpg").getDownloadURL().then(function (url) {
                let cartCache = "Feather Set" + "%%" + url + "%%" + "12000"
                return firebase.functions().httpsCallable('addToCart')({ cartCache })
            })
        }
        else if (items == "X-top") {
            storageRef.child("w bg lace x top IMG_1340.jpg").getDownloadURL().then(function (url) {
                let cartCache = "Stretch Top" + "%%" + url + "%%" + + "9500"
                return firebase.functions().httpsCallable('addToCart')({ cartCache })
            })
        }
        else if (items == "X-top_sleeves") {
            storageRef.child("w bg long sleeve x top 2 IMG_1251.jpg").getDownloadURL().then(function (url) {
                let cartCache = "Stretch Top with Sleeves" + "%%" + url + "%%" + "9500"
                return firebase.functions().httpsCallable('addToCart')({ cartCache })
            })
        }
        else if (items == "Mardi Gras Top") {
            storageRef.child("w bg mardi gras 3 IMG_0192.jpg").getDownloadURL().then(function (url) {
                let cartCache = "Mardi Gras Top" + "%%" + url + "%%" + "9500"
                return firebase.functions().httpsCallable('addToCart')({ cartCache })
            })
        }
        else if (items == "Pirate Skirt") {
            storageRef.child("w bg pirate skirt 2 IMG_1370.jpg").getDownloadURL().then(function (url) {
                let cartCache = "Pirate Skirt" + "%%" + url + "%%" + "12000"
                return firebase.functions().httpsCallable('addToCart')({ cartCache })
            })
        }
        else if (items == "Nomad Top") {
            storageRef.child("white background IMG_0043 2.jpg").getDownloadURL().then(function (url) {
                let cartCache = "Nomad Top" + "%%" + url + "%%" + "9500"
                return firebase.functions().httpsCallable('addToCart')({ cartCache })
            })
        }
        else if (items == "Nomad Pants") {
            storageRef.child("white background nomads IMG_0062.JPG").getDownloadURL().then(function (url) {
                let cartCache = "Nomad Pants" + "%%" + url + "%%" + "9500"
                return firebase.functions().httpsCallable('addToCart')({ cartCache })
            })
        }
        else if (items == "Rainbow Skirt") {
            storageRef.child("w bg rainbow skirt IMG_0555.jpg").getDownloadURL().then(function (url) {
                let cartCache = "Rainbow Skirt" + "%%" + url + "%%" + "9500"
                return firebase.functions().httpsCallable('addToCart')({ cartCache })
            })
        }

    }
    // Products List:

    // beaded panel set:
    storageRef.child('w bg beaded panel back 2 IMG_0103.jpg').getDownloadURL().then(function (url) {
        let img = document.getElementById("Beaded Set")
        img.src = url
    })

    // spiderweb top:
    storageRef.child("w bg beaded top n skirt 2 IMG_0513.jpg").getDownloadURL().then(function (url) {
        let img = document.getElementById("Beaded Top")
        img.src = url
    })

    // blue velvet coin belt:
    storageRef.child("w bg coin belt blue IMG_1431.jpg").getDownloadURL().then(function (url) {
        let img = document.getElementById("velvet_coin")
        img.src = url
    })
    // cotton:
    storageRef.child("w bg cotton set IMG_0213.jpg").getDownloadURL().then(function (url) {
        let img = document.getElementById("Cotton Top")
        img.src = url
    })
    // feather;
    storageRef.child("w bg feather set IMG_0350.jpg").getDownloadURL().then(function (url) {
        let img = document.getElementById("Feather Set")
        img.src = url
    })

    storageRef.child("w bg lace x top IMG_1340.jpg").getDownloadURL().then(function (url) {
        let img = document.getElementById("X-top")
        img.src = url
    })

    storageRef.child("w bg long sleeve x top 2 IMG_1251.jpg").getDownloadURL().then(function (url) {
        let img = document.getElementById("X-top_sleeves")
        img.src = url
    })

    storageRef.child("w bg mardi gras 3 IMG_0192.jpg").getDownloadURL().then(function (url) {
        let img = document.getElementById("mardi_gras_top")
        img.src = url
    })

    storageRef.child("w bg pirate skirt 2 IMG_1370.jpg").getDownloadURL().then(function (url) {
        let img = document.getElementById("pirate_skirt")
        img.src = url
    })

    storageRef.child("w bg rainbow skirt IMG_0555.jpg").getDownloadURL().then(function (url) {
        let img = document.getElementById("rainbow_skirt")
        img.src = url
    })

    storageRef.child("white background IMG_0043 2.jpg").getDownloadURL().then(function (url) {
        let img = document.getElementById("nomad_top")
        img.src = url
    })

    storageRef.child("white background nomads IMG_0062.JPG").getDownloadURL().then(function (url) {
        let img = document.getElementById("nomad_pants")
        img.src = url
    })


    return (
        <div>
            <h1>Shop</h1>
            <main className="productCard">
                <div className="row">
                    <div className="column">
                        <div className="productCard">
                            <img id="Beaded Set" width="100%" height="auto"></img>
                            <h1>Beaded Panel Set</h1>
                            <p class="price">$285.00</p>
                            <p>To get all the attention</p>
                            <p><button type="button" onClick={() => { addToCart("Beaded Set") }}>Add to Cart</button></p>
                        </div>
                    </div>
                    <div className="column">
                        <div className="productCard">
                            <img id="Beaded Top" width="100%" height="auto"></img>
                            <h1>Beaded Halter Top</h1>
                            <p class="price">$95.00</p>
                            <p>Handbeaded</p>
                            <p><button type="button" onClick={() => { addToCart("Beaded Top") }}>Add to Cart</button></p>
                        </div>
                    </div>
                    <div className="column">
                        <div className="productCard">
                            <img id="velvet_coin" width="100%" height="auto"></img>
                            <h1>Velvet Coin Belt</h1>
                            <p class="price">$48.00</p>
                            <p>A pirate's booty must jingle</p>
                            <p><button type="button" onClick={() => { addToCart("Velvet Coin") }}>Add to Cart</button></p>
                        </div>
                    </div>
                    <div className="column">
                        <div className="productCard">
                            <img id="Cotton Top" width="100%" height="auto"></img>
                            <h1>Cotton Top</h1>
                            <p class="price">$285.00</p>
                            <p>Breathable and flowy</p>
                            <p><button type="button" onClick={() => { addToCart("Cotton Top") }}>Add to Cart</button></p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="column">
                        <div className="productCard">
                            <img id="Feather Set" width="100%" height="auto"></img>
                            <h1>Feather Set</h1>
                            <p class="price">$285.00</p>
                            <p>Where my witches at?</p>
                            <p><button type="button" onClick={() => { addToCart("Feather Set") }}>Add to Cart</button></p>
                        </div>
                    </div>
                    <div className="column">
                        <div className="productCard">
                            <img id="X-top" width="100%" height="auto"></img>
                            <h1>Lace Stretch Top</h1>
                            <p class="price">$95.00</p>
                            <p>Form-fitting, slenderizing</p>
                            <p><button type="button" onClick={() => { addToCart("X-top") }}>Add to Cart</button></p>
                        </div>
                    </div>
                    <div className="column">
                        <div className="productCard">
                            <img id="X-top_sleeves" width="100%" height="auto"></img>
                            <h1>Cord Stretch Top</h1>
                            <p class="price">$95.00</p>
                            <p>Bestseller!</p>
                            <p><button type="button" onClick={() => { addToCart("X-top_sleeves") }}>Add to Cart</button></p>
                        </div>
                    </div>
                    <div className="column">
                        <div className="productCard">
                            <img id="mardi_gras_top" width="100%" height="auto"></img>
                            <h1>Mardi Gras Top</h1>
                            <p class="price">$95.00</p>
                            <p>Bringin' the parade</p>
                            <p><button type="button" onClick={() => { addToCart("Mardi Gras Top") }}>Add to Cart</button></p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="column">
                        <div className="productCard">
                            <img id="pirate_skirt" width="100%" height="auto"></img>
                            <h1>Pirate Skirt</h1>
                            <p class="price">$120.00</p>
                            <p>Cinches + wine-bottle pockets</p>
                            <p><button type="button" onClick={() => { addToCart("Pirate Skirt") }}>Add to Cart</button></p>
                        </div>
                    </div>
                    <div className="column">
                        <div className="productCard">
                            <img id="rainbow_skirt" width="100%" height="auto"></img>
                            <h1>Rainbow Skirt</h1>
                            <p class="price">$120.00</p>
                            <p>Sari Silk, not sorry!</p>
                            <p><button type="button" onClick={() => { addToCart("Rainbow Skirt") }}>Add to Cart</button></p>
                        </div>
                    </div>
                    <div className="column">
                        <div className="productCard">
                            <img id="nomad_top" width="100%" height="auto"></img>
                            <h1>Nomad Top</h1>
                            <p class="price">$65.00</p>
                            <p>Lightweight and breezy</p>
                            <p><button type="button" onClick={() => { addToCart("Nomad Top") }}>Add to Cart</button></p>
                        </div>
                    </div>
                    <div className="column">
                        <div className="productCard">
                            <img id="nomad_pants" width="100%" height="auto"></img>
                            <h1>Nomad Pants</h1>
                            <p class="price">$95.00</p>
                            <p>6 pockets for all your loot!</p>
                            <p><button type="button" onClick={() => { addToCart("Nomad Pants") }}>Add to Cart</button></p>
                        </div>
                    </div>
                </div>









            </main>
        </div >
    )
}

export default Shop