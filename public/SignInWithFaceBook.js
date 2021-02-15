import firebase from "firebase"

var provider = new firebase.auth.FacebookAuthProvider();

firebase.auth().signInWithPopup(provider).then(function (result) {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
}).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
});


FB.getLoginStatus(function (response) {
    if (response.status === 'connected') {
        var accessToken = response.authResponse.accessToken;
    }
});
// This method is used to rerender info that is dynamically rendered - probably
// necessary for use with React:

FB.XFBML.parse();

// The onlogin attribute on the button to set up a JavaScript callback that checks the login status
// to see if the person logged in successfully:
// <fb: login-button
//     scope="public_profile,email"
//     onlogin="checkLoginState();">
// </fb: login - button >

// Checks the most recent login state:
function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

// Spinner Logic:

var finished_rendering = function () {
    console.log("finished rendering plugins");
    var spinner = document.getElementById("spinner");
    spinner.removeAttribute("style");
    spinner.removeChild(spinner.childNodes[0]);
}
FB.Event.subscribe('xfbml.render', finished_rendering);


// Continue as {Name} Button:
return (
    <div>
        <div class="fb-login-button"
            data-width="" data-size="large"
            data-button-type="continue_with"
            data-layout="default"
            data-auto-logout-link="false"
            data-use-continue-as="true"></div>

        // This is a spinner for during login process.

        <div id="spinner"
            style="
        background: #4267b2;
        border-radius: 5px;
        color: white;
        height: 40px;
        text-align: center;
        width: 250px;">
            Loading
    <div
                class="fb-login-button"
                data-max-rows="1"
                data-size="large"
                data-button-type="continue_with"
                data-use-continue-as="true"
            ></div>
        </div>
    </div>
)