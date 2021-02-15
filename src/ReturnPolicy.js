import React, { useContext, useEffect } from "react";
import { Context } from "./Context";
import Flexbox from "flexbox-react";

function ReturnPolicy() {
  const { setOnCheckout, setOnProductPage, isLargeScreen } = useContext(
    Context
  );

  useEffect(() => {
    setOnCheckout(false);
    setOnProductPage(false);
    // document.getElementById('smallSearch').style.display = "none"
    // document.getElementById('largeSearch').style.display = "none"
    document.getElementById("firebaseui-auth-container").style.display = "none";
  }, []);

  if (isLargeScreen) {
    return (
      <div
        className="centered rounded"
        style={{
          "background-color": "black",
          "box-shadow": "0px 0px 5px white",
          width: "75vw",
        }}
      >
        <div className="media-object">
          <div className="media-object-section">
            <h1>Return Policy</h1>
          </div>
          <div
            className="media-object-section"
            style={{
              fontSize: `${isLargeScreen ? "initial" : "small"}`,
            }}
          >
            <p>
              Not in love with your purchase? That's okay. If you aren't
              satisfied, neither are we. If your item has not yet shipped, you
              will receive a full refund. If your order has shipped, but it's
              still within the 60 days of our return policy, you can ship your
              items back free of charge. We will provide you with either an
              exchange or store credit, whichever you prefer.
            </p>
            <br></br>
            <p>
              If you decide to return your items, please use the same packaging.
              A return slip and a shipping label will be included with your
              items.
            </p>
            <br></br>
            <p>
              If you have any questions or concerns regarding your return, feel
              free to call or text (504)-616-6756 or email us at
              <a href="mailto:jivasoriginals@gmail.com">
                jivasoriginals@gmail.com
              </a>
              . You can expect to hear back from us within 3 business days.
            </p>
          </div>
        </div>
        <br></br>
      </div>
    );
  } else {
    return (
      <div
        className="centered rounded"
        style={{
          "background-color": "black",
          "box-shadow": "0px 0px 5px white",
          width: "75vw",
        }}
      >
        <Flexbox flexDirection="column">
          <div>
            <h1>Return Policy</h1>
          </div>
          <div
            style={{
              fontSize: `${isLargeScreen ? "initial" : "small"}`,
            }}
          >
            <p>
              Not in love with your purchase? That's okay. If you aren't
              satisfied, neither are we. If your item has not yet shipped, you
              will receive a full refund. If your order has shipped, but it's
              still within the 60 days of our return policy, you can ship your
              items back free of charge. We will provide you with either an
              exchange or store credit, whichever you prefer.
            </p>
            <br></br>
            <p>
              If you decide to return your items, please use the same packaging.
              A return slip and a shipping label will be included with your
              items.
            </p>
            <br></br>
            <p>
              If you have any questions or concerns regarding your return, feel
              free to call or text (504)-616-6756 or email us at
              <a href="mailto:jivasoriginals@gmail.com">
                jivasoriginals@gmail.com
              </a>
              . You can expect to hear back from us within 3 business days.
            </p>
          </div>
        </Flexbox>
        <br></br>
      </div>
    );
  }
}
export default ReturnPolicy;
