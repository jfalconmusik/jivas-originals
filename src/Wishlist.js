import React, { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { Context } from "./Context"
import firebase from "firebase"

function Wishlist() {

    const storage = firebase.storage()
    const storageRef = storage.ref()


    // fix how shop items are rendered, add "wishlist" heart button to each
    // set selected items to wishlistItems, 
    // allow add to cart from this section

    const {
        fromWishlistToCart,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
        wishlistItems,
        modifyWishlistCount,
        modifyCartCount,
        modifyTotalPrice,
        activateRemoveFromWishlistModal,
        setSearchString } = useContext(Context)


    useEffect(() => {
        setSearchString("")
    }, [])

    if (wishlistItems.length > 0) {
        console.log(wishlistItems)

        return (
            wishlistItems.map(item => {

                // const itemToCart = [item[0], item[1], (Number(item[2]) / 100)]

                let productPageLinkString = item[0].split(" ").join("-")
                let putBackItem = [item[0], [], (Number(item[2]) / 100), [], [], `${item[1]}`]

                console.log(putBackItem)

                return (
                    <div className="column">
                        <div className="itemCard">
                            <Link to={`/product/${productPageLinkString}`}>
                                <h3>{item[0]}</h3>
                            </Link>
                            <Link to={`/product/${productPageLinkString}`}>
                                <img src={`${item[1]}`} width="100" height="auto"></img>
                            </Link>
                            <h4>${(Number(item[2]) / 100).toFixed(2)}</h4>
                            <button className="userButton button primary" type="button" onClick={() => {
                                removeFromWishlist(item[0]);
                                activateRemoveFromWishlistModal(putBackItem)
                                modifyWishlistCount(-1)
                            }}>Delete</button>
                        </div>
                    </div>
                )
            })
        )

    } else {
        return (
            <div>
                <p>You haven't added any Favorites yet</p>
                <p>Start by browsing our shop:</p>
                <Link to="/shop">
                    <div className="userAccount">
                        <div className="itemCard">
                            <button
                                className="userButton button primary"
                                style={{ "height": "3em" }}>Shop</button>
                        </div>
                    </div>
                </Link>
                <Link to="/account">
                    <div className="userAccount">
                        <div className="itemCard">
                            <button
                                className="userButton button primary hollow"
                                style={{ "height": "3em" }}>Back to Account</button>
                        </div>
                    </div>
                </Link>
            </div>
        )
    }


}

export default Wishlist