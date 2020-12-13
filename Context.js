import React, { useState, useEffect } from "react"
import Images from "./images"

const Context = React.createContext()

function ContextProvider({ children }) {
    const [allPhotos, setAllPhotos] = useState([Images])
    const [cartItems, setCartItems] = useState([])
    // const [signInDisplayed, setSignInDisplayed] = useState(false)
    const [userInfo, setUserInfo] = useState({
        userName: "",
        userMail: "",
        userPhotoUrl: ""
    })


    function toggleFavorite(id) {
        const updatedArr = allPhotos.map(photo => {
            if (photo.id === id) {
                return { ...photo, isFavorite: !photo.isFavorite }
            }
            return photo
        })
        setAllPhotos(updatedArr)
    }

    function addToCart(newItem) {
        setCartItems(prevItems => [...prevItems, newItem])
    }

    function removeFromCart(id) {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id))
    }

    function emptyCart() {
        setCartItems([])
    }

    return (
        <Context.Provider value={{
            allPhotos,
            toggleFavorite,
            cartItems,
            addToCart,
            removeFromCart,
            emptyCart,
            signInDisplayed,
            setSignInDisplayed,
            userInfo,
            setUserInfo
        }}>
            {children}
        </Context.Provider>
    )
}

export { ContextProvider, Context }