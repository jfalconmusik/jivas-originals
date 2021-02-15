import React from "react"
import { Link } from "react-router-dom"
import firebase from "firebase"


function Header() {

    return (
        <Link to="/">
            <div className="Header">
                <div className="HeaderText">
                    <img
                        width="100em"
                        height="auto"
                        src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/logo%20jf%20jiva-fashions.svg?alt=media&token=b10662ca-7679-4b75-938a-827a59186ef2" />
                    <h1 style={{ "text-decoration": "none" }}>Jiva Originals</h1>
                    <p style={{ "text-decoration": "none" }}>Bring Out Your Inner Goddess</p>
                </div>
            </div>
        </Link>
    )
}

export default Header