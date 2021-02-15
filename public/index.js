import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import * as firebase from "firebase";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import * as Stripe from "stripe";
const stripePromise = loadStripe("pk_test_vSUOdXUItkZoDH7AA0LQppyq00W7RQlEuV");

const { Provider, Consumer } = React.createContext([]);

const config = {
  apiKey: "AIzaSyBpUcfYrQBi2hjFqG4yD5sXJxFfYP-BPt0",
  authDomain: "jiva-website-405ed.firebaseapp.com",
  databaseURL: "https://jiva-website-405ed.firebaseio.com",
  projectId: "jiva-website-405ed",
  storageBucket: "jiva-website-405ed.appspot.com",
  messagingSenderId: "618010454010",
  appId: "1:618010454010:web:5b7cdeb479f76f177ca643",
  measurementId: "G-0DHGCGG5VX",
};

firebase.initializeApp(config);
Stripe.setPublishableKey("pk_test_vSUOdXUItkZoDH7AA0LQppyq00W7RQlEuV");

ReactDOM.render(
  <React.StrictMode>
    <Provider>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
