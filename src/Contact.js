import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Context } from "./Context"
import firebase from "firebase"

function Contact() {

    const {
        routerString,
        setRouterString,
        setTermsDisplay,
        setOnProductPage,
        isLargeScreen
    } = useContext(Context)

    useEffect(() => {
        setTermsDisplay(false);
        setOnProductPage(false)
        document.getElementById("firebaseui-auth-container").style.display = "none"
        // document.getElementById('smallSearch').style.display = "none"
        // document.getElementById('largeSearch').style.display = "none"
    }, [])

    const [messageSent, setMessageSent] = useState(false)

    function handleSendMessage() {
        let messageText = document.getElementById('contactNote').value
        let email = document.getElementById('contactEmail').value
        let name = document.getElementById('contactName').value

        firebase.functions().httpsCallable('contactUsEmail')({ messageText, email, name })

        setMessageSent(true)
    }

    const [messagePresent, setMessagePresent] = useState(false)

    function handleMessagePresent() {
        if ((document.getElementById("contactNote").length > 0)) {
            setMessagePresent(true)
        } else {
            setMessagePresent(false)
        }
    }

    return (
        <div>
            <nav style={{ "marginTop": "1em" }}
                className="darkNav" aria-label="You are here:" role="navigation">
                <ul class="breadcrumbs">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li>
                        <span class="show-for-sr">Current: Contact Us</span>
                    </li>
                </ul>
            </nav>
            <h1>Contact Us</h1>
            <div className="centered"
                style={{
                    "max-width": "50%",
                    // "background-color": "black",
                    // "box-shadow": "0px 0px 5px white",
                }}
            >
                {!messageSent ?
                    <div>
                        <input id="contactName" type="text" placeholder="Name" maxlength="30"></input>
                        <input id="contactEmail" type="text" placeholder="Email" maxlength="40"></input>
                        <textarea
                            id="contactNote"
                            width="50vw"
                            rows="4"
                            cols="50"
                            maxlength="300"
                            placeholder="Message"
                            onKeyUp={() => { handleMessagePresent() }}></textarea>
                        <button
                            disabled={messagePresent}
                            class="button primary"
                            type="button"
                            onClick={() => {
                                handleSendMessage()
                            }}>Send Message</button>
                    </div>
                    :
                    <h4>Your message has been sent. You can expect to hear back from us within 3 business days.
                    We look forward to getting in touch with you.</h4>

                }
                <br></br>
                {/* <h4
                    style={{
                        "background-color": "#565759",
                        "padding": ".25em",
                        "border-radius": "13px",
                        "width": `${isLargeScreen ? "50%" : "90%"}`,
                        "left": `${isLargeScreen ? "35vw" : "5vw"}`,
                        "whiteSpace": "nowrap",
                        "display": `${isLargeScreen ? "initial" : "none"}`
                    }}
                >Customer Service Email: jfalconmusik@gmail.com</h4> */}
            </div>
            <nav className="darkNav" aria-label="You are here:" role="navigation">
                <ul class="breadcrumbs">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li>
                        <span class="show-for-sr">Current: Contact Us</span>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Contact