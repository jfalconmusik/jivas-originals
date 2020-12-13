import React, { useState, useContext } from "react"
// import PropTypes from "prop-types"
import { Context } from "./Context.js"
import useHover from "./useHover"
import Images from "./images"

function ImageComponent(img) {
    const [hovered, ref] = useHover()
    const { toggleFavorite, addToCart, cartItems, removeFromCart } = useContext(Context)

    function heartIcon() {
        if (Images.isFavorite) {
            return <i className="ri-heart-fill favorite" onClick={() => toggleFavorite(img.id)}></i>
        } else if (hovered) {
            return <i className="ri-heart-line favorite" onClick={() => toggleFavorite(img.id)}></i>
        }
    }

    return (
        <div>
            <img src={img.src} className="image-grid" />
            {heartIcon()}
        </div>
    )
}

export default ImageComponent