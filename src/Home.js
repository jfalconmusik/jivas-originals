import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { tns } from "tiny-slider"
// import { slick } from "slick-carousel"
import ReturnPolicy from "./ReturnPolicy";
import { Context } from "./Context";
// requires a loader
import Carousel from "react-responsive-carousel";
// import Carousel from "@brainhubeu/react-carousel"
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
// import jQuery from "jquery"
import Glide from "@glidejs/glide";
import { Accordion, AccordionItem, AccordionContent } from "react-foundation";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import 'pure-react-carousel/dist/react-carousel.es.css';
// import '@brainhubeu/react-carousel/lib/style.css';
import AliceCarousel, { slidePrev, slideNext } from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import Flexbox from "flexbox-react";
import RecentlyViewed from "./RecentlyViewed";
import Footer from "./Footer";
// import TouchCarousel from 'react-touch-carousel'

function Home() {
  // const $ = jQuery.default;
  const {
    routerString,
    setRouterString,
    setTermsDisplay,
    setOnCheckout,
    isLargeScreen,
    setIsLargeScreen,
    setSearchString,
    sidebarOpen,
    toggleMenu,
    setToggleMenu,
    toggleString,
    setToggleString,
    handleToggleMenu,
    setOnProductPage,
    homeLoaded,
    setHomeLoaded,
    incrementHome,
    isSmallScreen,
    setIsSmallScreen,
    isPortrait,
    // isDesktopOrLaptop,
    isBigScreen,
    topsPhoto,
    beautifulDriaPhoto,
    landingPhoto,
    setTopsPhoto,
    setBeautifulDriaPhoto,
    setLandingPhoto,
    setOnHomeScreen,
  } = useContext(Context);

  useEffect(() => {
    setSearchString("");
    setTermsDisplay(false);
    setRouterString("home");
    setOnCheckout(false);
    setOnProductPage(false);
    setOnHomeScreen(true);

    document.getElementById("firebaseui-auth-container").style.display = "none";
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    window.scroll(0, 195);
    incrementHome();
  }, []);

  // Rewind to here in case of fuckup.

  function handleOnDragStart(e) {
    e.preventDefault();
  }

  useEffect(() => {
    window.mobileCheck = function () {
      let check = false;
      (function (a) {
        if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            a
          ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substr(0, 4)
          )
        )
          check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      if (check === true || isPortrait) {
        setIsMobile(true);
        setLandingPhoto(
          "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/best%20cover%20photo%202%20-%20Copy%20(2).jpg?alt=media&token=54bf23d3-2ef4-4b65-b27f-d824f3c9e9f8"
        );
        setBeautifulDriaPhoto(
          "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/70346107_2503742322981878_8139699380883030016_o%20(2).jpg?alt=media&token=38319a3b-4d5b-43b1-a23e-89409f72813b"
        );
        setTopsPhoto(
          "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/w%20bg%20long%20sleeve%20x%20top%20IMG_1243%20-%20Copy.png?alt=media&token=19362f2a-ef30-4555-94ef-6ec3e4800157"
        );
      } else {
        setIsMobile(false);
      }
      return check;
    };
  }, [counter, isSmallScreen, isPortrait, isLargeScreen]);

  useEffect(() => {
    if (isMobile) {
      setIsLargeScreen(false);
    }
  }, [isMobile]);

  function handleToggle() {
    let panel = document.getElementById("panel");
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }

  function handleSlide(direction) {
    let carousel = document.getElementById("carousel");

    if (direction === "prev") {
      carousel.slidePrev();
    } else if (direction === "next") {
      carousel.slideNext();
    }
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isPortrait || isSmallScreen) {
      setCurrentIndex(2);
      setIsSmallScreen(true);
      setIsLargeScreen(false);
    } else {
      setCurrentIndex(0);
      setIsSmallScreen(false);
      setIsLargeScreen(true);
    }

    if (isBigScreen) {
      setCurrentIndex(0);
    }
    // if (isBigScreen) {
    //   setIsLargeScreen(true);
    // }
  }, [isSmallScreen, isLargeScreen, isPortrait, isBigScreen]);

  function handleCurrentIndex(direction) {
    if (direction === "next") {
      if (currentIndex < 2) {
        setCurrentIndex(Number(currentIndex + 1));
      } else {
        setCurrentIndex(0);
      }
    } else {
      if (currentIndex > 0) {
        setCurrentIndex(Number(currentIndex - 1));
      } else {
        setCurrentIndex(2);
      }
    }
  }
  //
  //
  //
  //
  const listOfData = [
    // your data array here
  ];

  function CarouselContainer(props) {
    // render the carousel structure
  }

  function renderCard(index, modIndex, cursor) {
    const item = listOfData[modIndex];
    // render the item
  }

  return (
    <div
      onLoad={() => {
        incrementHome();
        setCounter(Number(counter + 1));
      }}
      onTouchStart={() => {
        incrementHome();
      }}
    >
      {isPortrait || isSmallScreen}
      <nav
        style={{ marginTop: "1em" }}
        className="darkNav"
        aria-label="You are here:"
        role="navigation"
      >
        <ul class="breadcrumbs">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <span class="show-for-sr">Current: Home</span>
          </li>
        </ul>
      </nav>
      <img
        alt="carousel left"
        className="arrow"
        style={{
          padding: ".5em",
          left: "3vw",
          top: `${toggleMenu ? "35em" : "30em"}`,
          borderRadius: "50px",
          backgroundColor: "black",
          opacity: "0.8",
          display: `${isLargeScreen ? "initial" : "none"}`,
        }}
        src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/left%20arrow%20white.svg?alt=media&token=9f166f00-6ab3-4c6f-b889-64178ab8472a"
        onClick={() => handleCurrentIndex("back")}
      ></img>
      <img
        alt="carousel right"
        className="arrow"
        style={{
          padding: ".5em",
          right: "3vw",
          top: `${toggleMenu ? "35em" : "30em"}`,
          borderRadius: "50px",
          backgroundColor: "black",
          opacity: "0.8",
          display: `${isLargeScreen ? "initial" : "none"}`,
        }}
        src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/right%20arrow%20white.svg?alt=media&token=b7965e38-9e56-485d-8ead-107068ad92c4"
        onClick={() => handleCurrentIndex("next")}
      ></img>

      <AliceCarousel
        onLoad={() => {
          setCounter(Number(counter + 1));
        }}
        style={{
          left: `${isLargeScreen ? "initial" : "1em"}`,
          zIndex: "94",
        }}
        buttonsDisabled={true}
        slideToIndex={currentIndex}
        id="aliceCarousel"
        mouseTrackingEnabled
        className="carousel mobileInvisible"
      >
        <h3 style={{ marginBottom: "-5em" }}>
          <img
            alt="girl in meadow"
            onLoad={() => {
              incrementHome();
            }}
            style={{
              width: `${!isPortrait ? "100vw" : "150vw"}`,
              height: "auto",
              "box-shadow": "0px 0px 5px white",
            }}
            className="carouselDialogue thumbnail"
            src={`${
              !isPortrait
                ? "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/best%20cover%20photo%202%20(2).jpg?alt=media&token=3670d217-2999-41ab-b7dd-5141e67f620c"
                : "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/best%20cover%20photo%202%20-%20Copy%20(2).jpg?alt=media&token=54bf23d3-2ef4-4b65-b27f-d824f3c9e9f8"
            }`}
            onDragStart={handleOnDragStart}
          ></img>
          <Link
            to="/shop"
            style={{
              top: "14em",
              right: "37%",
              "z-index": "95",
              position: "absolute",
            }}
          >
            <button
              style={{
                width: `${!isPortrait ? "24vw" : "67vw"}`,
                "padding-left": "-1em",
                "padding-bottom": "-1em",
                "padding-right": "-1em",
                fontSize: `${!isPortrait ? "medium" : "small"}`,
                boxShadow: "0px 0px 5px white",
                whiteSpace: "nowrap",
                maxWidth: `${!isPortrait ? "initial" : "none"}`,
                left: `${!isPortrait ? "initial" : "20vw"}`,
                position: `${!isPortrait ? "initial" : "relative"}`,
              }}
              type="button"
              className="button primary centered glowButtonBlue"
            >
              Shop Now, Look Gorgeous
            </button>
          </Link>
          <Link to="/">
            <h2 style={{ fontFamily: "Luminari", fontSize: "60px" }}>
              The Jiva Team
            </h2>
          </Link>
        </h3>
        <h3 style={{ marginBottom: "-5em" }}>
          <Flexbox flexDirection="row">
            <Link to={`/shop${!isPortrait ? `/tops` : ""}`}>
              <Flexbox flexDirection="column">
                <img alt="model in top" className="thumbnail" src={topsPhoto} />
                <button
                  type="button"
                  style={{
                    bottom: "14em",
                    left: `${!isPortrait ? "9vw" : "12vw"}`,
                    fontSize: `${!isPortrait ? "medium" : "small"}`,
                    boxShadow: "0px 0px 5px white",
                    position: "relative",
                    margin: "3em",
                    maxWidth: `${!isPortrait ? "7em" : "10em"}`,
                  }}
                  className="button primary centered glowButtonBlue"
                >
                  {!isPortrait ? "Tops" : "Shop Now!"}
                </button>
              </Flexbox>
            </Link>
            <Link
              style={{
                display: `${!isPortrait ? "initial" : "none"}`,
              }}
              to="/shop/skirts"
            >
              <Flexbox flexDirection="column">
                <img
                  alt="model in skirt"
                  className="thumbnail"
                  src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/w%20bg%20pirate%20skirt%20red%20IMG_1365.jpg?alt=media&token=95f97f8c-a1c1-41d8-98d0-9f6d1a16e3c7"
                />
                <button
                  type="button"
                  style={{
                    bottom: "14em",
                    left: "9vw",
                    fontSize: "medium",
                    boxShadow: "0px 0px 5px white",
                    position: "relative",
                    margin: "3em",
                    maxWidth: "7em",
                  }}
                  className="button primary centered glowButtonBlue"
                >
                  Skirts
                </button>
              </Flexbox>
            </Link>
            <Link
              style={{
                display: `${!isPortrait ? "initial" : "none"}`,
              }}
              to="/shop/full-sets"
            >
              <Flexbox flexDirection="column">
                <img
                  alt="model in blue coat"
                  className="thumbnail"
                  src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/products%2Fmonarch%20blue%205.png?alt=media&token=d184e0a5-8982-47e6-9bf6-142b60bdcbb4"
                />
                <button
                  type="button"
                  style={{
                    bottom: "14em",
                    left: "9vw",
                    fontSize: "medium",
                    boxShadow: "0px 0px 5px white",
                    position: "relative",
                    margin: "3em",
                    maxWidth: "7em",
                  }}
                  className="button primary centered glowButtonBlue"
                >
                  Sets
                </button>
              </Flexbox>
            </Link>
          </Flexbox>
        </h3>
        <h3 style={{ marginBottom: "-5em" }}>
          <Link to="/shop">
            <img
              alt="girl in meadow"
              style={{
                width: `${!isPortrait ? "100vw" : "150vw"}`,
                height: "auto",
                "box-shadow": "0px 0px 5px white",
              }}
              className="carouselDialogue thumbnail"
              src={`${
                !isPortrait
                  ? "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/svg%2Fdria%20meadow%20cropped.jpg?alt=media&token=53d4d632-cb62-4db6-b160-7e6bd6333540"
                  : "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/70346107_2503742322981878_8139699380883030016_o%20(2).jpg?alt=media&token=38319a3b-4d5b-43b1-a23e-89409f72813b"
              }`}
              onDragStart={handleOnDragStart}
            ></img>
          </Link>
          <Link
            to="/shop"
            style={{
              top: `${!isPortrait ? "18.5em" : "14em"}`,
              right: "37%",
              "z-index": "95",
              position: "absolute",
            }}
          >
            <button
              style={{
                width: `${!isPortrait ? "24vw" : "68vw"}`,
                paddingLeft: "-1em",
                paddingBottom: "-1em",
                paddingRight: "-1em",
                fontSize: `${!isPortrait ? "medium" : "small"}`,
                boxShadow: "0px 0px 5px white",
                maxWidth: `${!isPortrait ? "initial" : "none"}`,
                whiteSpace: "nowrap",

                left: `${!isPortrait ? "initial" : "20vw"}`,
                position: `${!isPortrait ? "initial" : "relative"}`,
              }}
              type="button"
              className="button primary centered glowButtonBlue"
            >
              Bring Out Your Inner Goddess
            </button>
          </Link>
        </h3>
      </AliceCarousel>
      <br></br>
      {isPortrait || isSmallScreen ? (
        <div>
          <div className="shadowed centered">
            <Flexbox
              className="centered"
              flexDirection={`${isLargeScreen ? "row" : "column"}`}
            >
              <Link to="/shop" className="homeBox">
                <Flexbox
                  flexDirection="column"
                  style={{ margin: "1em" }}
                  className="innerBox"
                >
                  <img
                    alt="dress icon"
                    className="centered thumbnail"
                    width="150em"
                    height="auto"
                    src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/hp%20dress%20final%20white.svg?alt=media&token=9c6af742-7966-4490-a63b-c5e9b96887a5"
                  />
                  <h4>Look Gorgeous</h4>
                  <p>Outfits to make any day special.</p>
                </Flexbox>
              </Link>
              <Link to="/shop" className="homeBox">
                {/* eventually change this to lead elsewhere */}
                <Flexbox
                  flexDirection="column"
                  style={{ margin: "1em" }}
                  className="innerBox"
                >
                  <img
                    alt="business icon"
                    className="centered thumbnail"
                    width="150em"
                    height="auto"
                    src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/hp%20shop%20final%20white.svg?alt=media&token=f39ea99b-a259-4525-bca7-2b6861efe459"
                  />
                  <h4>Support Small Business</h4>
                  <p>Clothing designed by artists from around the world.</p>
                </Flexbox>
              </Link>
              <Link to="/shop" className="homeBox">
                {/* eventually change this to lead elsewhere */}
                <Flexbox
                  flexDirection="column"
                  style={{ margin: "1em" }}
                  className="innerBox"
                >
                  <img
                    alt="charity icon"
                    className="centered thumbnail"
                    width="150em"
                    height="auto"
                    src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/h%20love%20final.svg?alt=media&token=e4c18e44-7cd7-4dc4-8c04-3819a05b326b"
                  />
                  <h4>Give Back</h4>
                  <p>5% of sales go to charity</p>
                </Flexbox>
              </Link>
            </Flexbox>
          </div>
          <Link
            to="/shop"
            style={{
              position: `${isLargeScreen ? "sticky" : "absolute"}`,
              "overflow-x": "visible",
              top: "30em",
              left: "90%",
              zIndex: "90",
              display: `${isLargeScreen ? "initial" : "none"}`,
              fontSize: "larger",
            }}
          >
            <button
              type="button"
              className="button primary centered glowButton"
              style={{ width: "150px" }}
            >
              Shop Now
            </button>
          </Link>
          <br></br>
          <div></div>
          <br></br>
          <br></br>
          {/* get ready, this is where I have two versions for each box, responsive yeh: */}
          {isLargeScreen ? (
            <div
              className="centered rounded"
              style={{
                "background-color": "black",
                "box-shadow": "0px 0px 5px white",
                width: "75vw",
              }}
            >
              <div class="media-object">
                <div class="media-object-section">
                  <img
                    alt="customer at fair"
                    className="thumbnail"
                    width="300em"
                    height="auto"
                    src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/294835_178973432170960_976701_n.jpg?alt=media&token=18a7fcd3-da83-4ba2-aaa6-e6bf19d1bb3c"
                  />
                </div>
                <div class="media-object-section">
                  <h4 onLoad={() => incrementHome()}>Our Story</h4>
                  <p>
                    Jiva herself was a pioneer of modern traveling theatre,
                    performing many original plays at renaissance festivals
                    around the country. Eventually the costumes she and her
                    troupe wore began to get a lot of attention of their own.
                    The Jiva Originals shop was born, an outlet for clothing
                    both from around the world and from local seamstresses and
                    tailors in the United States. All of our clothes are meant
                    to make you feel like the star of your own play. Mixing
                    historical and modern fashions, we hope to bridge the gap
                    between our past and present.
                  </p>
                  <br></br>
                  <p>
                    The 3 Joys of Life: To know the world, to know yourself, and
                    to look amazing while doing it!
                  </p>
                  <br></br>
                </div>
              </div>
              <br></br>
            </div>
          ) : (
            <Flexbox
              flexDirection="column"
              className="centered rounded"
              style={{
                "background-color": "black",
                "box-shadow": "0px 0px 5px white",
                width: "75vw",
              }}
            >
              <img
                alt="jiva performing in original theatre"
                className="thumbnail"
                width="300em"
                height="auto"
                src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/294835_178973432170960_976701_n.jpg?alt=media&token=18a7fcd3-da83-4ba2-aaa6-e6bf19d1bb3c"
              />
              <div>
                <h4>Our Story</h4>
                <p>
                  Jiva herself was a pioneer of modern traveling theatre,
                  performing many original plays at renaissance festivals around
                  the country. Eventually the costumes she and her troupe wore
                  began to get a lot of attention of their own. The Jiva
                  Originals shop was born, an outlet for clothing both from
                  around the world and from local seamstresses and tailors in
                  the United States. All of our clothes are meant to make you
                  feel like the star of your own theatre. Mixing historical and
                  modern fashions, we hope to bridge the gap between who we are
                  today and who we can be tomorrow.
                </p>
                <br></br>
                <p>
                  The 3 Joys of Life: To know the world, to know yourself, and
                  to look amazing while doing it!
                </p>
                <br></br>
              </div>
            </Flexbox>
          )}
          <br></br>
          {isLargeScreen ? (
            <div
              className="centered rounded"
              style={{
                "background-color": "black",
                "box-shadow": "0px 0px 5px white",
                width: "75vw",
                position: "relative",
                zIndex: "94",
              }}
            >
              <h2>Event Schedule</h2>
              <p>
                Wanna shop in person? Come find us at a renaissance faire near
                you!
              </p>
              <div
                className="media-object centered roundedLight"
                style={{
                  position: "relative",
                  left: "30%",
                  fontSize: `${isLargeScreen ? "initial" : "small"}`,
                }}
              >
                <div class="media-object-section">
                  <img
                    alt=" colorado renaissance faire"
                    width="100em"
                    height="auto"
                    src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/70244366_2501612373194873_569183467091263488_n.jpg?alt=media&token=7d38652e-fe48-4cc2-84b3-f9872091f44b"
                  />
                </div>
                <div class="media-object-section" style={{ left: "2.5em" }}>
                  <h3>{`June & July`}:</h3>
                  <span style={{ position: "relative", left: "36px" }}>
                    <p>
                      Colorado Renaissance Festival <br></br>
                      <a
                        href="https://coloradorenaissance.com/tickets/"
                        className="rounded"
                        style={{ padding: "5px" }}
                      >
                        Buy Tickets
                      </a>
                    </p>
                  </span>
                  <br></br>
                </div>
              </div>
              <div
                className="media-object centered roundedLight"
                style={{
                  position: "relative",
                  left: "30%",
                }}
              >
                <div class="media-object-section">
                  <img
                    alt="michigan renaissance faire"
                    width="100em"
                    height="auto"
                    src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/42887344_1953618671327582_4439089665261174784_o.jpg?alt=media&token=1fd94ca2-0042-4a3d-8322-62a30af346af"
                  />
                </div>
                <div class="media-object-section">
                  <h3>{`August & September`}:</h3>
                  <span>
                    <p>
                      Michigan Renaissance Festival <br></br>
                      <a
                        className="rounded"
                        style={{ padding: "5px" }}
                        href="https://tickets.vendini.com/ticket-software.html?t=tix&w=52fbb7c1bb4fbf19606f318214d7b972&vqitq=c3eb8fc3-e0ed-46f3-91cf-3a677dfecad7&vqitp=ad290479-9395-4921-b92c-b993e890866b&vqitts=1593478462&vqitc=vendini&vqite=itl&vqitrt=Safetynet&vqith=09edb3976dc3b60114ff0c1d74b8c62e"
                      >
                        Buy Tickets
                      </a>
                    </p>
                  </span>
                  <br></br>
                </div>
              </div>
              <div
                className="media-object centered roundedLight"
                style={{
                  position: "relative",
                  left: "30%",
                }}
              >
                <div class="media-object-section">
                  <img
                    alt="texas renaissance faire"
                    width="100em"
                    height="auto"
                    src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/1396816_647632598592869_748912369_o.jpg?alt=media&token=d92ae692-70c4-4fcb-bbf7-6becda76cf2d"
                  />
                </div>
                <div class="media-object-section">
                  <h3>{`October & November`}:</h3>
                  <span>
                    <p>
                      Texas Renaissance Festival <br></br>
                      <a
                        className="rounded"
                        style={{ padding: "5px" }}
                        href="https://www.texrenfest.com/tickets-season-passes"
                      >
                        Buy Tickets
                      </a>
                    </p>
                  </span>
                  <br></br>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Flexbox
                flexDirection="column"
                className="centered rounded"
                style={{
                  "background-color": "black",
                  "box-shadow": "0px 0px 5px white",
                  width: "75vw",
                  position: "relative",
                }}
              >
                <h2>Event Schedule</h2>
                <p>
                  Wanna shop in person? Come find us at a renaissance faire near
                  you!
                </p>
                <div
                  className="centered roundedLight"
                  style={{
                    position: "relative",
                    fontSize: `${isLargeScreen ? "initial" : "small"}`,
                  }}
                >
                  <div>
                    <img
                      alt="colorado renaissance faire"
                      className="thumbnail"
                      width="50vw"
                      height="auto"
                      src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/70244366_2501612373194873_569183467091263488_n.jpg?alt=media&token=7d38652e-fe48-4cc2-84b3-f9872091f44b"
                    />
                  </div>
                  <div>
                    <h3>{`June & July`}:</h3>
                    <span>
                      <p>
                        Colorado Renaissance Festival <br></br>
                        <a
                          className="rounded"
                          style={{ padding: "5px" }}
                          href="https://coloradorenaissance.com/tickets/"
                        >
                          Buy Tickets
                        </a>
                      </p>
                    </span>
                    <br></br>
                  </div>
                </div>
                <div
                  className="centered roundedLight"
                  style={{
                    position: "relative",
                    fontSize: `${isLargeScreen ? "initial" : "small"}`,
                  }}
                >
                  <div>
                    <img
                      alt="michigan renaissance faire"
                      className="thumbnail"
                      width="50vw"
                      height="auto"
                      src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/42887344_1953618671327582_4439089665261174784_o.jpg?alt=media&token=1fd94ca2-0042-4a3d-8322-62a30af346af"
                    />
                  </div>
                  <div>
                    <h3>{`August & September`}:</h3>
                    <span>
                      <p>
                        Michigan Renaissance Festival <br></br>
                        <a
                          className="rounded"
                          style={{ padding: "5px" }}
                          href="https://tickets.vendini.com/ticket-software.html?t=tix&w=52fbb7c1bb4fbf19606f318214d7b972&vqitq=c3eb8fc3-e0ed-46f3-91cf-3a677dfecad7&vqitp=ad290479-9395-4921-b92c-b993e890866b&vqitts=1593478462&vqitc=vendini&vqite=itl&vqitrt=Safetynet&vqith=09edb3976dc3b60114ff0c1d74b8c62e"
                        >
                          Buy Tickets
                        </a>
                      </p>
                    </span>
                    <br></br>
                  </div>
                </div>
                <div
                  className="centered roundedLight"
                  style={{
                    position: "relative",
                    fontSize: `${isLargeScreen ? "initial" : "small"}`,
                  }}
                >
                  <div>
                    <img
                      alt="texas renaissance faire"
                      className="thumbnail"
                      width="50vw"
                      height="auto"
                      src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/1396816_647632598592869_748912369_o.jpg?alt=media&token=d92ae692-70c4-4fcb-bbf7-6becda76cf2d"
                    />
                  </div>
                  <div>
                    <h3>{`October & November`}:</h3>
                    <span>
                      <p>
                        Texas Renaissance Festival <br></br>
                        <a
                          className="rounded"
                          style={{ padding: "5px" }}
                          href="https://www.texrenfest.com/tickets-season-passes"
                        >
                          Buy Tickets
                        </a>
                      </p>
                    </span>
                    <br></br>
                  </div>
                </div>
              </Flexbox>
              <div
                className="rounded centered"
                style={{
                  marginTop: "2em",
                  width: "75vw",
                  marginBottom: "-1em",
                }}
              >
                <Link
                  to="/shop"
                  style={{
                    "overflow-x": "visible",
                    top: "30em",
                    left: "90%",
                    zIndex: "90",
                    fontSize: "larger",
                  }}
                >
                  <button
                    type="button"
                    className="button primary centered glowButton"
                    style={{ width: "200px", marginTop: "1em" }}
                  >
                    Shop Now
                  </button>
                </Link>
              </div>
            </div>
          )}
          <br></br>
          <br></br>
          <ReturnPolicy className="centered" />
        </div>
      ) : (
        <div>
          <Link
            to="/shop"
            style={{
              position: `${isLargeScreen ? "sticky" : "absolute"}`,
              "overflow-x": "visible",
              top: "30em",
              left: "91%",
              zIndex: "90",
              display: `${isLargeScreen ? "initial" : "none"}`,
              fontSize: "larger",
            }}
          >
            <button
              type="button"
              className="button primary centered glowButton"
              style={{ width: "150px" }}
            >
              Shop Now
            </button>
          </Link>
          <div className="homeScreen">
            <div className="backgroundElement"></div>
            <div className="baseElement">
              <div className="shadowed centered">
                <Flexbox
                  className="centered"
                  flexDirection={`${isLargeScreen ? "row" : "column"}`}
                >
                  <Link to="/shop" className="homeBox">
                    <Flexbox
                      flexDirection="column"
                      style={{ margin: "1em" }}
                      className="innerBox"
                    >
                      <img
                        alt="dress icon"
                        className="centered thumbnail"
                        width="150em"
                        height="auto"
                        src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/hp%20dress%20final%20white.svg?alt=media&token=9c6af742-7966-4490-a63b-c5e9b96887a5"
                      />
                      <h4>Look Gorgeous</h4>
                      <p>Outfits to make any day special.</p>
                    </Flexbox>
                  </Link>
                  <Link to="/shop" className="homeBox">
                    {/* eventually change this to lead elsewhere */}
                    <Flexbox
                      flexDirection="column"
                      style={{ margin: "1em" }}
                      className="innerBox"
                    >
                      <img
                        alt="business icon"
                        className="centered thumbnail"
                        width="150em"
                        height="auto"
                        src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/hp%20shop%20final%20white.svg?alt=media&token=f39ea99b-a259-4525-bca7-2b6861efe459"
                      />
                      <h4>Support Small Business</h4>
                      <p>Clothing designed by artists from around the world.</p>
                    </Flexbox>
                  </Link>
                  <Link to="/shop" className="homeBox">
                    {/* eventually change this to lead elsewhere */}
                    <Flexbox
                      flexDirection="column"
                      style={{ margin: "1em" }}
                      className="innerBox"
                    >
                      <img
                        alt="charity icon"
                        className="centered thumbnail"
                        width="150em"
                        height="auto"
                        src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/h%20love%20final.svg?alt=media&token=e4c18e44-7cd7-4dc4-8c04-3819a05b326b"
                      />
                      <h4>Give Back</h4>
                      <p>5% of sales go to charity</p>
                    </Flexbox>
                  </Link>
                </Flexbox>
              </div>

              <br></br>
              <div></div>
              <br></br>
              <br></br>
              {/* get ready, this is where I have two versions for each box, responsive yeh: */}
              {isLargeScreen ? (
                <div
                  className="centered rounded"
                  style={{
                    "background-color": "black",
                    "box-shadow": "0px 0px 5px white",
                    width: "75vw",
                  }}
                >
                  <div class="media-object">
                    <div class="media-object-section">
                      <img
                        alt="jiva performing in original theatre"
                        className="thumbnail"
                        width="300em"
                        height="auto"
                        src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/294835_178973432170960_976701_n.jpg?alt=media&token=18a7fcd3-da83-4ba2-aaa6-e6bf19d1bb3c"
                      />
                    </div>
                    <div class="media-object-section">
                      <h4 onLoad={() => incrementHome()}>Our Story</h4>
                      <p>
                        Jiva herself was a pioneer of modern traveling theatre,
                        performing many original plays at renaissance festivals
                        around the country. Eventually the costumes she and her
                        troupe wore began to get a lot of attention of their
                        own. The Jiva Originals shop was born, an outlet for
                        clothing both from around the world and from local
                        seamstresses and tailors in the United States. All of
                        our clothes are meant to make you feel like the star of
                        your own play. Mixing historical and modern fashions, we
                        hope to bridge the gap between our past and present.
                      </p>
                      <br></br>
                      <p>
                        The 3 Joys of Life: To know the world, to know yourself,
                        and to look amazing while doing it!
                      </p>
                      <br></br>
                    </div>
                  </div>
                  <br></br>
                </div>
              ) : (
                <Flexbox
                  flexDirection="column"
                  className="centered rounded"
                  style={{
                    "background-color": "black",
                    "box-shadow": "0px 0px 5px white",
                    width: "75vw",
                  }}
                >
                  <img
                    alt="jiva performing in original theatre"
                    className="thumbnail"
                    width="300em"
                    height="auto"
                    src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/294835_178973432170960_976701_n.jpg?alt=media&token=18a7fcd3-da83-4ba2-aaa6-e6bf19d1bb3c"
                  />
                  <div>
                    <h4>Our Story</h4>
                    <p>
                      Jiva herself was a pioneer of modern traveling theatre,
                      performing many original plays at renaissance festivals
                      around the country. Eventually the costumes she and her
                      troupe wore began to get a lot of attention of their own.
                      The Jiva Originals shop was born, an outlet for clothing
                      both from around the world and from local seamstresses and
                      tailors in the United States. All of our clothes are meant
                      to make you feel like the star of your own theatre. Mixing
                      historical and modern fashions, we hope to bridge the gap
                      between who we are today and who we can be tomorrow.
                    </p>
                    <br></br>
                    <p>
                      The 3 Joys of Life: To know the world, to know yourself,
                      and to look amazing while doing it!
                    </p>
                    <br></br>
                  </div>
                </Flexbox>
              )}
              <br></br>
              {isLargeScreen ? (
                <div
                  className="centered rounded"
                  style={{
                    "background-color": "black",
                    "box-shadow": "0px 0px 5px white",
                    width: "75vw",
                    position: "relative",
                    zIndex: "94",
                  }}
                >
                  <h2>Event Schedule</h2>
                  <p>
                    Wanna shop in person? Come find us at a renaissance faire
                    near you!
                  </p>
                  <div
                    className="media-object centered roundedLight"
                    style={{
                      position: "relative",
                      left: "30%",
                      fontSize: `${isLargeScreen ? "initial" : "small"}`,
                    }}
                  >
                    <div class="media-object-section">
                      <img
                        alt="colorado renaissance faire"
                        width="100em"
                        height="auto"
                        src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/70244366_2501612373194873_569183467091263488_n.jpg?alt=media&token=7d38652e-fe48-4cc2-84b3-f9872091f44b"
                      />
                    </div>
                    <div class="media-object-section" style={{ left: "2.5em" }}>
                      <h3>{`June & July`}:</h3>
                      <span style={{ position: "relative", left: "36px" }}>
                        <p>
                          Colorado Renaissance Festival <br></br>
                          <a
                            href="https://coloradorenaissance.com/tickets/"
                            className="rounded"
                            style={{ padding: "5px" }}
                          >
                            Buy Tickets
                          </a>
                        </p>
                      </span>
                      <br></br>
                    </div>
                  </div>
                  <div
                    className="media-object centered roundedLight"
                    style={{
                      position: "relative",
                      left: "30%",
                    }}
                  >
                    <div class="media-object-section">
                      <img
                        alt="michigan renaissance faire"
                        width="100em"
                        height="auto"
                        src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/42887344_1953618671327582_4439089665261174784_o.jpg?alt=media&token=1fd94ca2-0042-4a3d-8322-62a30af346af"
                      />
                    </div>
                    <div class="media-object-section">
                      <h3>{`August & September`}:</h3>
                      <span>
                        <p>
                          Michigan Renaissance Festival <br></br>
                          <a
                            className="rounded"
                            style={{ padding: "5px" }}
                            href="https://tickets.vendini.com/ticket-software.html?t=tix&w=52fbb7c1bb4fbf19606f318214d7b972&vqitq=c3eb8fc3-e0ed-46f3-91cf-3a677dfecad7&vqitp=ad290479-9395-4921-b92c-b993e890866b&vqitts=1593478462&vqitc=vendini&vqite=itl&vqitrt=Safetynet&vqith=09edb3976dc3b60114ff0c1d74b8c62e"
                          >
                            Buy Tickets
                          </a>
                        </p>
                      </span>
                      <br></br>
                    </div>
                  </div>
                  <div
                    className="media-object centered roundedLight"
                    style={{
                      position: "relative",
                      left: "30%",
                    }}
                  >
                    <div class="media-object-section">
                      <img
                        alt="texas renaissance faire"
                        width="100em"
                        height="auto"
                        src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/1396816_647632598592869_748912369_o.jpg?alt=media&token=d92ae692-70c4-4fcb-bbf7-6becda76cf2d"
                      />
                    </div>
                    <div class="media-object-section">
                      <h3>{`October & November`}:</h3>
                      <span>
                        <p>
                          Texas Renaissance Festival <br></br>
                          <a
                            className="rounded"
                            style={{ padding: "5px" }}
                            href="https://www.texrenfest.com/tickets-season-passes"
                          >
                            Buy Tickets
                          </a>
                        </p>
                      </span>
                      <br></br>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <Flexbox
                    flexDirection="column"
                    className="centered rounded"
                    style={{
                      "background-color": "black",
                      "box-shadow": "0px 0px 5px white",
                      width: "75vw",
                      position: "relative",
                    }}
                  >
                    <h2>Event Schedule</h2>
                    <p>
                      Wanna shop in person? Come find us at a renaissance faire
                      near you!
                    </p>
                    <div
                      className="centered roundedLight"
                      style={{
                        position: "relative",
                        fontSize: `${isLargeScreen ? "initial" : "small"}`,
                      }}
                    >
                      <div>
                        <img
                          alt="colorado renaissance faire"
                          className="thumbnail"
                          width="50vw"
                          height="auto"
                          src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/70244366_2501612373194873_569183467091263488_n.jpg?alt=media&token=7d38652e-fe48-4cc2-84b3-f9872091f44b"
                        />
                      </div>
                      <div>
                        <h3>{`June & July`}:</h3>
                        <span>
                          <p>
                            Colorado Renaissance Festival <br></br>
                            <a
                              className="rounded"
                              style={{ padding: "5px" }}
                              href="https://coloradorenaissance.com/tickets/"
                            >
                              Buy Tickets
                            </a>
                          </p>
                        </span>
                        <br></br>
                      </div>
                    </div>
                    <div
                      className="centered roundedLight"
                      style={{
                        position: "relative",
                        fontSize: `${isLargeScreen ? "initial" : "small"}`,
                      }}
                    >
                      <div>
                        <img
                          alt="michigan renaissance faire"
                          className="thumbnail"
                          width="50vw"
                          height="auto"
                          src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/42887344_1953618671327582_4439089665261174784_o.jpg?alt=media&token=1fd94ca2-0042-4a3d-8322-62a30af346af"
                        />
                      </div>
                      <div>
                        <h3>{`August & September`}:</h3>
                        <span>
                          <p>
                            Michigan Renaissance Festival <br></br>
                            <a
                              className="rounded"
                              style={{ padding: "5px" }}
                              href="https://tickets.vendini.com/ticket-software.html?t=tix&w=52fbb7c1bb4fbf19606f318214d7b972&vqitq=c3eb8fc3-e0ed-46f3-91cf-3a677dfecad7&vqitp=ad290479-9395-4921-b92c-b993e890866b&vqitts=1593478462&vqitc=vendini&vqite=itl&vqitrt=Safetynet&vqith=09edb3976dc3b60114ff0c1d74b8c62e"
                            >
                              Buy Tickets
                            </a>
                          </p>
                        </span>
                        <br></br>
                      </div>
                    </div>
                    <div
                      className="centered roundedLight"
                      style={{
                        position: "relative",
                        fontSize: `${isLargeScreen ? "initial" : "small"}`,
                      }}
                    >
                      <div>
                        <img
                          alt="texas renaissance faire"
                          className="thumbnail"
                          width="50vw"
                          height="auto"
                          src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/1396816_647632598592869_748912369_o.jpg?alt=media&token=d92ae692-70c4-4fcb-bbf7-6becda76cf2d"
                        />
                      </div>
                      <div>
                        <h3>{`October & November`}:</h3>
                        <span>
                          <p>
                            Texas Renaissance Festival <br></br>
                            <a
                              className="rounded"
                              style={{ padding: "5px" }}
                              href="https://www.texrenfest.com/tickets-season-passes"
                            >
                              Buy Tickets
                            </a>
                          </p>
                        </span>
                        <br></br>
                      </div>
                    </div>
                  </Flexbox>
                  <div
                    className="rounded centered"
                    style={{
                      marginTop: "2em",
                      width: "75vw",
                      marginBottom: "-1em",
                    }}
                  >
                    <Link
                      to="/shop"
                      style={{
                        "overflow-x": "visible",
                        top: "30em",
                        left: "90%",
                        zIndex: "90",
                        fontSize: "larger",
                      }}
                    >
                      <button
                        type="button"
                        className="button primary centered glowButton"
                        style={{ width: "200px", marginTop: "1em" }}
                      >
                        Shop Now
                      </button>
                    </Link>
                  </div>
                </div>
              )}
              <br></br>
              <br></br>
              <ReturnPolicy className="centered" />
            </div>
          </div>
        </div>
      )}
      <RecentlyViewed />
      <nav
        style={{ marginTop: "1em" }}
        className="darkNav"
        aria-label="You are here:"
        role="navigation"
      >
        <ul class="breadcrumbs">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <span class="show-for-sr">Current: Home</span>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;
