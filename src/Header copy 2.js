import React, { useContext, useState, useEffect } from "react";
import Foundation, { Menu } from "react-foundation";
import { Link } from "react-router-dom";
import firebase from "firebase";
import { Context } from "./Context";
import Flexbox from "flexbox-react";

function Header() {
  const {
    accountTitleString,
    userInfo,
    itemList,
    isLargeScreen,
    isSmallScreen,
    isPortrait,
  } = useContext(Context);

  window.onscroll = function () {
    scrollSet();
  };

  function scrollSet() {
    var winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    var height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    document.getElementById("progressBar").value = scrolled;
  }

  const storage = firebase.storage();
  const storageRef = storage.ref();

  // get cart item number icon url:

  const [urlString, setUrlString] = useState("");

  const [listShow, setListShow] = useState("hidden");

  useEffect(() => {
    if (!firebase.auth().currentUser && itemList.length == 0) {
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart-no-0.svg?alt=media&token=349f4672-ab05-4512-bf25-6a11cc359ff3";
      let img = document.getElementById("headerCartIcon");
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 0) {
      // storageRef.child("cart-no-0.svg").getDownloadURL().then(function (url) {
      // })

      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart-no-0.svg?alt=media&token=349f4672-ab05-4512-bf25-6a11cc359ff3";
      let img = document.getElementById("headerCartIcon");
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 1) {
      // storageRef.child("cart-no-1.svg").getDownloadURL().then(function (url) {
      // })
      let img = document.getElementById("headerCartIcon");
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart-no-1.svg?alt=media&token=8e7705fa-f341-4faa-aa93-ee5aab9b93be";
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 2) {
      // storageRef.child("cart-no-2.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart-no-2.svg?alt=media&token=125e4744-73ad-4c5a-ad3b-4dd722b45660";
      let img = document.getElementById("headerCartIcon");
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 3) {
      // storageRef.child("cart-no-3.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart-no-3.svg?alt=media&token=bf0d8caa-794d-4a01-bb04-766e6ed4ce4b";
      let img = document.getElementById("headerCartIcon");
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 4) {
      // storageRef.child("cart-no-4.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart-no-4.svg?alt=media&token=b501c8b9-58d7-4a65-acc8-7840ae4d70c2";
      let img = document.getElementById("headerCartIcon");
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 5) {
      // storageRef.child("cart-no-5.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart-no-5.svg?alt=media&token=a58819db-3949-45f9-883e-ed58c49909eb";
      let img = document.getElementById("headerCartIcon");
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 6) {
      // storageRef.child("cart-no-6.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart-no-6.svg?alt=media&token=07d2df3e-a1eb-41ce-bed0-48fd53f2702a";
      let img = document.getElementById("headerCartIcon");
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 7) {
      // storageRef.child("cart-no-7.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart-no-7.svg?alt=media&token=2a0eaf81-d66c-4b6a-9c84-a7557b5bf8a7";
      let img = document.getElementById("headerCartIcon");
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 8) {
      // storageRef.child("cart-no-8.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart-no-8.svg?alt=media&token=c3ffa2a2-9a93-4cee-abb4-bfcace36b9c9";
      let img = document.getElementById("headerCartIcon");
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 9) {
      // storageRef.child("cart-no-9.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart-no-9.svg?alt=media&token=2233e015-be3b-40bb-8e95-f1e1d67b8d2d";
      let img = document.getElementById("headerCartIcon");
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 10) {
      // storageRef.child("cart-no-10.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart-no-10.svg?alt=media&token=28683a46-fc3a-4203-ab37-b3cfe7b9f4fe";
      let img = document.getElementById("headerCartIcon");
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 11) {
      // storageRef.child("cart-no-11.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart-no-11.svg?alt=media&token=0a058425-e317-4205-bdca-6850f882bddd";
      let img = document.getElementById("headerCartIcon");
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 12) {
      // storageRef.child("cart-no-12.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart-no-12.svg?alt=media&token=693a69bb-661f-4f79-be65-20e790bd594d";
      let img = document.getElementById("headerCartIcon");
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length == 13) {
      // storageRef.child("cart-no-13.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart-no-13.svg?alt=media&token=a1833ae8-9b07-46d8-a158-66979419cae0";
      let img = document.getElementById("headerCartIcon");
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    } else if (itemList.length > 13) {
      // storageRef.child("cart-smiley-2.svg").getDownloadURL().then(function (url) {
      // })
      let url =
        "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart-smiley-2.svg?alt=media&token=c7a10c41-e1c3-4d3b-a1f5-53412023754e";
      let img = document.getElementById("headerCartIcon");
      // console.log(url)
      // img.src = url;
      setUrlString(url);
    }
  }, [itemList, userInfo]);

  return (
    <div>
      {/* <div style={{
                "position": "sticky",
                "top": "0"
            }} className="top-bar" id="example-menu">
                <div className="top-bar-left" style={{
                    "position": "sticky",
                    "top": "0"
                }}>

                </div>
                <div className="top-bar-right">
                    {/* <ul className="menu">
                        <li><input type="search" placeholder="Search"></input></li>
                        <li><button type="button" className="button">Search</button></li>
                    </ul> */}
      {/* </div>
            </div>  */}

      <div>
        {/* <Link to="/"> */}
        <div
          className="Header"
          style={{
            maxWidth: "100vw",
            // "maxHeight": "5em",
          }}
        >
          {/* {!isLargeScreen && (
            <span
              style={{
                left: "-3.25em",
                position: "relative",
              }}
            >
              <Link to="/">
                <Flexbox
                  flexDirection="row"
                  style={{
                    color: "white",
                    left: "15vw",
                    position: "relative",
                  }}
                >
                  <h1>Jiva's</h1>
                  <img
                    style={{
                      bottom: "1.5em",
                      zIndex: "99",
                      position: "relative",
                      maxWidth: `${isLargeScreen ? "100vw" : "300vw"}`,
                    }}
                    width="125vw"
                    alt=""
                    height="auto"
                    src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/logo%20rose%20finished.svg?alt=media&token=d4f6fc6b-cec1-4832-adcb-440dae63563b"
                  ></img>

                  <h1>Originals</h1>
                </Flexbox>
              </Link>
            </span>
          )} */}
          <div
            style={{
              position: "relative",
              margin: "0 auto",
              bottom: `55px`,
              height: "150px",
              width: "100vw",
            }}
          >
            <img
              style={{
                height: "100px",
                width: `${isPortrait || isSmallScreen ? "100vw" : "auto"}`,
                right: `${isPortrait || isSmallScreen ? "20vw" : "5vw"}`,
                position: "relative",
                margin: "0 auto",
              }}
              //   height="90px"
              src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/Banner.png?alt=media&token=647e1bad-0683-4812-b845-12693d2301c9"
              alt="Jiva's Originals Header"
            />
          </div>
        </div>
        {/* </Link> */}
      </div>
    </div>
  );
}

export default Header;
