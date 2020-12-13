import React, { useContext } from "react";
// import NavBar from "./components/navbar";
import "./App.css";
import Header from "./Header"
import { Link, Switch, Route } from "react-router-dom"
import Cart from "./Cart"
import CartSignIn from "./CartSignIn"
import About from "./About"
import Checkout from "./Checkout"
import Contact from "./Contact"
import Shop from "./Shop"
import Account from "./Account"
import Home from "./Home"
// import CardSection from "./CardSection"
import SignInSuccessful from "./SignInSuccessful"
import SignInSuccessEmail from "./SignInSuccessEmail"
import PrivacyPolicy from "./PrivacyPolicy"
import TermsOfService from "./TermsOfService"
import { Context } from "./Context"
import firebase from "firebase"
import SignInWithEmailv2 from "./SignInWithEmailv2";
import OrderSuccess from "./OrderSuccess"

function App() {



  const {
    userInfo,
    setUserInfo,
    handleLocation } = useContext(Context)

  function handleRefresh() {
    (!firebase.auth().currentUser) &&
      window.location.reload()
  }

  // onClick={() => handleRefresh()}

  return (
    <div className="App">
      <header className="Header">
        <Header />
      </header>
      <nav className="navigation">
        <li className="li" id="home"><Link to="/" className="li">Home</Link></li>
        <li className="li" id="shop"><Link to="/shop" className="li">Shop</Link></li>
        <li className="li" id="cart"><Link to="/cart" className="li">Cart</Link></li>
        <li className="li" id="about"><Link to="/about" className="li">About</Link></li>
        <li className="li" id="account"><Link to="/account" className="li">My Account</Link></li>
        <li className="li" id="contact"><Link to="/contact" className="li">Contact Us</Link></li>
      </nav>
      <Switch>
        <Route exact path="/">
          <Home onLoad={() => { handleLocation("Home") }} />
        </Route>
        <Route path="/shop">
          <Shop onLoad={() => { handleLocation("Shop") }} />
        </Route>
        <Route path="/about">
          <About onLoad={() => { handleLocation("About") }} />
        </Route>
        <Route path="/cart">
          <Cart onLoad={() => { handleLocation("Cart") }} />
        </Route>
        <Route path="cart-sign-in">
          <CartSignIn />
        </Route>
        <Route path="/account">
          <Account onLoad={() => { handleLocation("Account") }} />
        </Route>
        <Route path="/contact">
          <Contact onLoad={() => { handleLocation("Contact") }} />
        </Route>
        <Route path="/sign-in-success">
          <Context.Consumer>
            {(userInfo, setUserInfo) =>
              <SignInSuccessful userInfo={userInfo} setUserInfo={setUserInfo} />}
          </Context.Consumer>
        </Route>
        <Route path="/privacy-policy">
          <PrivacyPolicy />
        </Route>
        <Route path="/terms-of-service">
          <TermsOfService />
        </Route>
        <Route path="/sign-in-success-email">
          <SignInSuccessEmail />
        </Route>
        <Route path='/sign-in-with-email-v2'>
          <SignInWithEmailv2 />
        </Route>
        <Route path="/checkout">
          <Checkout />
        </Route>
        <Route path="/order-success">
          <OrderSuccess />
        </Route>
      </Switch>


      <nav className="footer">
        <h2 className="footItem"><Link to="/privacy-policy" className="li">Privacy Policy</Link></h2>
        <h2 className="footItem"><Link to="/terms-of-service" className="li">Terms of Service</Link></h2>
      </nav>
    </div >
  );
}

export default App;


{/* <Link to="/sign-in-success-email" className="hidden"></Link> */ }
// Import FirebaseAuth and firebase.
// import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
// import firebase from 'firebase';
// import StripeCheckout from "react-stripe-checkout"



// Configure Firebase.
// const config = {
//   apiKey: 'AIzaSyAeue-AsYu76MMQlTOM-KlbYBlusW9c1FM',
//   authDomain: 'myproject-1234.firebaseapp.com',
//   databaseURL: 'https://jiva-website-405ed.firebaseio.com/',
//   projectID: 'jiva-website-405ed',
//   storageBucket: "gs://jiva-website-405ed.appspot.com",
//   messagingSenderId: "618010454010"

// };
// // ...
// firebase.initializeApp(config);

// Option 2: Access Firebase services using shorthand notation
// const storage = firebase.storage();
// const firestore = firebase.firestore();
// const docRef = firestore.doc('events/event')

//   // Example of adding a field to the selected database document

//   (docRef.set({
//     love: "evol"
//   }).then(function () {
//     console.log("Status saved!")
//   }).catch(function (error) {
//     console.log("Got an error: ", error)
//   }))();

// // Configure FirebaseUI.
// const uiConfig = {
//   // Popup signin flow rather than redirect flow.
//   signInFlow: 'popup',
//   // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
//   signInSuccessUrl: '/signedIn',
//   // We will display Google and Facebook as auth providers.
//   signInOptions: [
//     firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//     firebase.auth.FacebookAuthProvider.PROVIDER_ID
//   ]
// };

// class SignInScreen extends React.Component {
//   render() {
//     return (
//       <div>
//         <h1>My App</h1>
//         <p>Please sign-in:</p>
//         <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
//       </div>
//     );
//   }
// }

// The Next Lines are a link and route to checkout which is broken cuz we have no stripe: .....

{/* <li className="li"><Link to="/checkout" className="li">Checkout</Link></li> */ }
// <Route path="/checkout">
//   <Checkout />
// </Route>