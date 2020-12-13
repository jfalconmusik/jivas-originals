var credential = firebase.auth.GoogleAuthProvider.credential(
    googleUser.getAuthResponse().id_token);


auth.currentUser.linkWithCredential(credential)
    .then(function (usercred) {
        var user = usercred.user;
        console.log("Anonymous account successfully upgraded", user);
    }).catch(function (error) {
        console.log("Error upgrading anonymous account", error);
    });


    // new account under Google user can now access data stored while anonymous