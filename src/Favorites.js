import React, { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { Context } from "./Context"
import Wishlist from "./Wishlist"

function Favorites() {


    const {
        wishlistItemCount,
        isLargeScreen,
        setOnProductPage
    } = useContext(Context)


    useEffect(() => {
        setOnProductPage(false)
    }, [])


    return (
        <div >
            <nav style={{ "marginTop": "1em" }}
                className="darkNav" aria-label="You are here:" role="navigation">
                <ul class="breadcrumbs">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/account">Account</Link></li>
                    <li><Link to="/favorites">Favorites</Link></li>
                    <li>
                        <span class="show-for-sr">Current: Favorites</span>
                    </li>
                </ul>
            </nav>
            <div className="shadowed centered">
                <h4>Your Favorites</h4>
                <div className="productCard">
                    <div className="row">
                        <Wishlist />
                    </div>
                </div>
                <p
                    className="grayBlock centered"
                    style={{
                        "width": `${isLargeScreen && "33%"}`,
                        "maxHeight": "3em"
                    }}>Favorited Items: {wishlistItemCount}</p>
            </div>
            <nav className="darkNav" aria-label="You are here:" role="navigation">
                <ul class="breadcrumbs">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/account">Account</Link></li>
                    <li><Link to="/favorites">Favorites</Link></li>
                    <li>
                        <span class="show-for-sr">Current: Favorites</span>
                    </li>
                </ul>
            </nav>
        </div >
    )
}

export default Favorites