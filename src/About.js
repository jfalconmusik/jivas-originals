import React, { useContext, useEffect } from "react"
import { Context } from "./Context"

function About() {

    const {
        routerString,
        setRouterString,
        setTermsDisplay } = useContext(Context)

    useEffect(() => {
        setRouterString("about")
    }, [])

    useEffect(() => {
        setTermsDisplay(false);


        document.getElementById("firebaseui-auth-container").style.display = "none"
    }, [])

    return (
        <div>
            <h1>About Page!</h1>
        </div>
    )
}

export default About