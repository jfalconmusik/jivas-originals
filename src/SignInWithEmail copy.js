// After asking the user for their email.
var email = window.prompt('Please provide your email');
firebase.auth().fetchSignInMethodsForEmail(email)
    .then(function (signInMethods) {
        // This returns the same array as fetchProvidersForEmail but for email
        // provider identified by 'password' string, signInMethods would contain 2
        // different strings:
        // 'emailLink' if the user previously signed in with an email/link
        // 'password' if the user has a password.
        // A user could have both.
        if (signInMethods.indexOf(
            firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD) != -1) {
            // User can sign in with email/password.
        }
        if (signInMethods.indexOf(
            firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD) != -1) {
            // User can sign in with email/link.
        }
    })
    .catch(function (error) {
        // Some error occurred, you can inspect the code: error.code
    });
