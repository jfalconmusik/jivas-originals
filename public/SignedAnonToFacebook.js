var credential = firebase.auth.FacebookAuthProvider.credential(
    response.authResponse.accessToken);


auth.currentUser.linkWithCredential(credential)
    .then(function (usercred) {
        var user = usercred.user;
        console.log("Anonymous account successfully upgraded", user);
    }).catch(function (error) {
        console.log("Error upgrading anonymous account", error);
    });

  // new fb signed-in user has access to data saved while anon
