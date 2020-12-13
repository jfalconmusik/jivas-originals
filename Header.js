import React from "react"
import { Link } from "react-router-dom"
import signOutButton from "./SignOutButton"

function Header() {
    return (
        <div style={{ "overflow": "visible" }}>
            <img src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/logo%20final%20white%20background.svg?alt=media&token=7bc2c226-2566-439e-a7e4-d5181d0e5cb1"
                width="100%"
                height="auto"></img>
            <Link to="/">
                <h1>Jiva Originals</h1>
                <p>Bring Out Your Inner Goddess</p>
                {/* <signOutButton /> */}
            </Link>
        </div >

    )
}

export default Header