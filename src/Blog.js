import React, { useEffect, useContext } from "react"
import { Link } from "react-router-dom"

import { Context } from "./Context"

function Blog() {

    const {
        setOnCheckout,
        setTermsDisplay
    } = useContext(Context)

    useEffect(() => {
        if (document.getElementById("firebaseui-auth-container")) {
            document.getElementById("firebaseui-auth-container").style.display = "none"
            setOnCheckout(false)


        }

        setTermsDisplay(false)

    }, [])

    useEffect(() => {
        document.getElementById("firebaseui-auth-container").style.display = "none"
        // document.getElementById('smallSearch').style.display = "none"
        // document.getElementById('largeSearch').style.display = "none"


    }, [])

    return (
        <div>
            <nav aria-label="You are here:" role="navigation">
                <ul class="breadcrumbs">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/blog">Blog</Link></li>
                    <li>
                        <span class="show-for-sr">Current: Blog</span>
                    </li>
                </ul>
            </nav>
            <h1>Blog</h1>
        </div>
    )
}

export default Blog